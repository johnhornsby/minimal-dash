/**
 * Bandwidth manager is used to calculate the bandwidth, its advised when a transfer
 * starts and stops and how much data is transfered. Bandwidth manager then retains 
 * the data and provides asumptions on bandwdth.
 */

import LoadManager from './load';
import {removeSpikes, getMean} from '../util/stats';


const MEASURE_VALID_READINGS = 3; // bandwidth readings

const INITIAL_BANDWIDTH = 500000; // 0.5 mb / s

const INITIAL_LATENCY = 100;

const CLIP_TOLERANCE = 0.25; // value between 0 and 1, 1 being maximum tollerant of peaks


let singleton = Symbol();
let singletonEnforcer = Symbol();


class BandwidthManager {

	static get instance() {
		if (!this[singleton]) {
			this[singleton] = new BandwidthManager(singletonEnforcer);

			this[singleton]._init();
		}

		return this[singleton];
	}


	_history = null;


	constructor(enforcer) {
		if (enforcer != singletonEnforcer) throw new Error("Cannot construct singleton");
	}






	/*____________________________________________

	Public
	_____________________________________________*/

	save(fragment, bytes, isCached, latency, contentTime, debug) { this._save(fragment, bytes, isCached, latency, contentTime, debug) }

	stopOnError(fragment) { this._stopOnError(fragment) }

	getQuality(manifest) { return this._getQuality(manifest) }






	/*____________________________________________

	Private 
	_____________________________________________*/

	_init() {
		this._history = [];
		this._ping = 0;
	}


	/**
	 * Called when a transfered has completed
	 * 
	 * @param {Object} Fragment Model
	 * @param {ArrayBuffer} bytes the data
	 * @param {Boolean} isCached whether the file is cached or not.
	 * @param {Int} latency time taken for first byte in ms
	 * @param {Int} time time taken for content to load after first byte in ms
	 * @param {Boolean} debug flag to determine if in debug mode
	 */
	_save(fragment, bytes, isCached, latency, time, debug) {
		const identifier = fragment.url;
		const {bandwidth, range} = this._getBandwidth(fragment.stream.manifest);

		let actualBandwidth = (1000 / time) * bytes * 8;

		if (!isFinite(actualBandwidth)) {
			actualBandwidth = 0;
		}

		fragment.loadData = {
			identifier: identifier,
			type: (fragment.isInit)? 'init': 'media',
			range: range,
			estimatedBandwidth: bandwidth,
			bytes: bytes,
			time: time,
			latency: latency,
			bandwidth: actualBandwidth,
			isCached: isCached,
			streamIndex: fragment.streamIndex
		};

		this._history.push(fragment.loadData);

		if (debug) console.log(`_save fragment:${fragment.url.split('/').pop()} total time:${time+latency} content time:${time} mbps:${(actualBandwidth / 1024 / 1024).toFixed(2)} latency:${latency}`);
	}


	_stopOnError(fragment) {
		const index = this._history.findIndex(data => data.identifier === fragment.url);

		if (index) {
			this._history = this._history.splice(index, 1);
		}
	}


	_findIndetifier(identifier) {
		return this._history.find(data => data.identifier === identifier);
	}


	_getDefaultBandwidth(initialBandwidth = INITIAL_BANDWIDTH, initialLatency = INITIAL_LATENCY) {
		return {
			bandwidth: initialBandwidth,
			range: {
				start: initialBandwidth,
				end: initialBandwidth,
				set: [initialBandwidth],
				all: [initialBandwidth]
			},
			latency: initialLatency
		}
	}


	_getMediaFragmentsHistory() {
		return this._history.filter(history => history.type === 'media' && history.bandwidth !== null);
	}


	_getBandwidth(manifest) {
		let bandwidth;
		let latency;

		if (this._history.length > 0) {

			const now = new Date().getTime();

			// use only media fragments
			let bandwidths = this._getMediaFragmentsHistory();

			// if previous fragment total load time exceeded the fragment duration then simply use this brandwidth
			if (bandwidths.length > 0) {
				const lastFragment = bandwidths[bandwidths.length - 1];
				if (lastFragment.time + lastFragment.latency > manifest.fragmentDuration * 1000) {
					bandwidths = [bandwidths.pop()];
				}
			}

			// only use history measurements within MEASURE_VALID_READINGS, that are not cached and witin MEASURE_VALID_READINGS
			let slots = MEASURE_VALID_READINGS;
			bandwidths = bandwidths.reduceRight((filteredBandwidths, nextBandwidth) => {
				if (nextBandwidth.isCached !== true && slots > 0) {
					filteredBandwidths.unshift(nextBandwidth);

					slots--;
				} 

				return filteredBandwidths;
			}, []);
			
			if (bandwidths.length > 0) {

				// get just an array of bandwidths and latencies
				let latencies = bandwidths.map(history => history.latency);
				bandwidths = bandwidths.map(history => history.bandwidth);

				// take all but the obvious spikes
				const clippedBandwidth = removeSpikes(bandwidths, CLIP_TOLERANCE);
				const clippedLatencies = removeSpikes(latencies, CLIP_TOLERANCE);

				const sortedBandwidth = clippedBandwidth.slice(0).sort((a, b) => a - b);

				// choose an appropriate bandwidth from the clipped array
				
				// bandwdth = this._selectBandwidth(sortedBandwidth);
				bandwidth = this._guessWeightedAverage(clippedBandwidth);
				latency = this._guessWeightedAverage(clippedLatencies);

				// set bandwidth into localStorage
				if (!isNaN(bandwidth) && isFinite(bandwidth)) {
					window.localStorage.bandwidth = parseInt(bandwidth);
					window.localStorage.latency = parseInt(latency);
				}

				const bandwidthData = {
					bandwidth:bandwidth,
					range: {
						start: sortedBandwidth[0],
						end: sortedBandwidth[sortedBandwidth.length - 1],
						set: clippedBandwidth,
						all: bandwidths
					},
					latency: latency
				}

				//sconsole.log(JSON.stringify(bandwidthData));

				return bandwidthData;
			}
		}

		if (window.localStorage.bandwidth) {
			bandwidth = parseInt(window.localStorage.bandwidth);
			latency = parseInt(window.localStorage.latency);
			return this._getDefaultBandwidth(bandwidth, latency);
		} else {
			return this._getDefaultBandwidth();
		}
	}

	// Now unused 
	// _selectBandwidth(bandwidths) {

	// 	// used to take mean or median here, however lets be a little more pesimistic and ensure a lower value
	// 	// return getMean(bandwidths);
	// 	// use the value that is 25% between the min and max
	// 	return bandwidths[0] + ((bandwidths[bandwidths.length - 1] - bandwidths[0]) * 0.25);
	// }


	/**
	 * Takes a chronologically ordered array of values and determine an average that
	 * weights the values using a sine curve to favour those nearer the end.
	 * 
	 * @param {Array} values 
	 * @returns {Number}
	 */
	_guessWeightedAverage(values) {
		let sum = 0;
		let mutiplierSum = 0;

		values.forEach(function(value, index, array) {
			const multiplier = Math.sin(((index + 1) / array.length) * (Math.PI / 2));

			mutiplierSum += multiplier;
			sum  += value * multiplier
		});

		return sum / mutiplierSum;
	}


	/**
	 * Ideally we want to download a fragment in the same time as its duration,
	 * this would indicate we are playing back at maximum capacity.
	 * 0 latency and bandwidth of 1mbps. However if we know we have a latency of 0.5 seconds,
	 * then we are needing a seconds worth of playback do down load in the remaining 0.5 second
	 */
	_getQuality(manifest) {
		const {bandwidth, range, latency} = this._getBandwidth(manifest);
		
		let increment = 0;
		let streamIndex = manifest.numberOfStreams - 1; // initially set to minimum

		// iterate through streams and determine the stream that is just under the bandwidth 

		let highestValidBandwidth = 0;
		let bandwidthAdjustedForLatency;		

		while(increment < manifest.numberOfStreams) {

			let streamData = {
				bandwidth: parseInt(manifest.getStream(increment).bandwidth),
				index: increment
			}

			// we need to account for the latency in our check for the right stream 
			bandwidthAdjustedForLatency = (1000 - (latency / manifest.fragmentDuration)) / 1000 * bandwidth;

			//bandwidthAdjustedForLatency *= 0.9;

			if (streamData.bandwidth < bandwidthAdjustedForLatency && streamData.bandwidth > highestValidBandwidth) {
				highestValidBandwidth = bandwidthAdjustedForLatency;
				streamIndex = increment;
			}

			increment++;
		}

		// check to gradually assend to next stream if gap between last is greater that 1
		let previousStreamIndex = streamIndex;
		let bandwidths = this._getMediaFragmentsHistory();
		if (bandwidths.length > 0) {
			const lastFragmentHistory = bandwidths.pop();
			if (lastFragmentHistory.streamIndex - 1 > streamIndex) {
				streamIndex = lastFragmentHistory.streamIndex - 1;
			}
		}


		console.dir(range.all);
		console.log(`Bandwidth _getQuality bandwidth:${bandwidth} latency:${latency} bandwidthAdjustedForLatency:${bandwidthAdjustedForLatency} streamIndex:${streamIndex}`);

		return streamIndex;
	}
}

export default BandwidthManager.instance;
