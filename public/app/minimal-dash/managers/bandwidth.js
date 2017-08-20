/**
 * Bandwidth manager is used to calculate the bandwidth, its advised when a transfer
 * starts and stops and how much data is transfered. Bandwidth manager then retains 
 * the data and provides asumptions on bandwdth.
 */

import LoadManager from './load';
import {removeSpikes} from '../../util/stats';


const MEASURE_VALID_READINGS = 10; // bandwidth readings

const INITIAL_BANDWIDTH = 500000; // 0.5 mb / s

const CLIP_TOLERANCE = 0.95; // value between 0 and 1

const CACHED_THRESHHOLD = 32; // ms loading within threshold to determine a cached fragment. 


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

	_debug = false;




	constructor(enforcer) {
		if (enforcer != singletonEnforcer) throw new Error("Cannot construct singleton");
	}






	/*____________________________________________

	Public
	_____________________________________________*/

	start(fragment) { this._start(fragment) }

	stop(fragment, bytes, isCached) { this._stop(fragment, bytes, isCached) }

	stopOnError(fragment) { this._stopOnError(fragment) }

	getQuality(manifest) { return this._getQuality(manifest) }

	set debug(debug) { this._debug = debug }






	/*____________________________________________

	Private 
	_____________________________________________*/

	_init() {
		this._history = [];
	}


	/**
	 * Called when a transfered is initiated
	 * 
	 * @param {Object} Fragment Model
	 */
	_start(fragment) {
		const identifier = fragment.url;
		const {bandwidth, range} = this._getBandwidth();

		this._history.push({
			identifier: identifier,
			start: new Date().getTime(),
			type: (fragment.isInit)? 'init': 'media',
			range: range,
			estimatedBandwidth: bandwidth
		})

		if (this._debug) console.log(`_start fragment ${fragment.url}`);
	}


	/**
	 * Called when a transfered has completed
	 * 
	 * @param {Object} Fragment Model
	 * @param {ArrayBuffer} bytes the data
	 */
	_stop(fragment, bytes, isCached = false) {
		const identifier = fragment.url;

		const historyData = this._findIndetifier(identifier);
		if (historyData) {
			historyData.end = new Date().getTime();
			historyData.bytes = bytes;
			historyData.time = Math.max(historyData.end - historyData.start, 0);
			historyData.isCached = isCached;

			if (isCached) {
				historyData.time = 0;
			}

			historyData.bandwidth = (1000 / historyData.time) * bytes * 8; // in bits / second

			if (isFinite(historyData.bandwidth) === false) {
				historyData.bandwidth = null;
			}
		}

		if (this._debug) console.log(`_stop fragment ${fragment.url} load time: ${historyData.time} mbps: ${historyData.bandwidth / 1024 / 1024}`);

		fragment.loadData = historyData;
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


	_getDefaultBandwidth(initialBandwidth = INITIAL_BANDWIDTH) {
		return {
			bandwidth: initialBandwidth,
			range: {
				start: initialBandwidth,
				end: initialBandwidth,
				set: [initialBandwidth],
				all: [initialBandwidth]
			}
		}
	}


	_getBandwidth() {
		if (this._history.length > 0) {

			const now = new Date().getTime();

			// use only media fragments
			let bandwidths = this._history.filter(history => history.type === 'media' && history.bandwidth !== null);

			// only use history measurements within MEASURE_VALID_READINGS, that are not cached and witin MEASURE_VALID_READINGS
			let slots = 10;
			bandwidths = bandwidths.reduceRight((filteredBandwidths, nextBandwidth) => {
				if (nextBandwidth.isCached !== true && slots > 0 && nextBandwidth.end) {
					filteredBandwidths.unshift(nextBandwidth);

					slots--;
				} 

				return filteredBandwidths;
			}, []);
			
			if (bandwidths.length > 0) {

				bandwidths = bandwidths.map(history => history.bandwidth);

				// take all but the obvious spikes
				const clippedBandwidth = removeSpikes(bandwidths, CLIP_TOLERANCE); 

				// choose an appropriate bandwidth from the clipped array
				const bandwidth = this._selectBandwidth(clippedBandwidth);

				// set bandwidth into localStorage
				if (!isNaN(bandwidth) && isFinite(bandwidth)) {
					window.localStorage.bandwidth = parseInt(bandwidth);
				}

				return {
					bandwidth:bandwidth,
					range: {
						start: clippedBandwidth[0],
						end: clippedBandwidth[clippedBandwidth.length - 1],
						set: clippedBandwidth,
						all: bandwidths
					}
				}
			}
		}

		if (window.localStorage.bandwidth) {
			return this._getDefaultBandwidth(window.localStorage.bandwidth);
		} else {
			return this._getDefaultBandwidth();
		}
	}


	_selectBandwidth(bandwidths) {
		// used to take mean or median here, however lets be a little more pesimistic and ensure a lower value
		// use the value that is 25% between the min and max
		return bandwidths[0] + ((bandwidths[bandwidths.length - 1] - bandwidths[0]) * 0.25);
	}


	_getQuality(manifest) {
		const {bandwidth, range} = this._getBandwidth();
		let increment = 0;
		let streamIndex = manifest.numberOfStreams - 1; // initially set to minimum

		while(increment < manifest.numberOfStreams) {

			if (parseInt(manifest.getStream(increment).bandwidth) < bandwidth) {
				streamIndex = increment;
				break;
			}

			increment++;
		}

		return streamIndex;
	}
}

export default BandwidthManager.instance;
