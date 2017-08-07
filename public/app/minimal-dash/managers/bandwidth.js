/**
 * Bandwidth manager is used to calculate the bandwidth, its advised when a transfer
 * starts and stops and how much data is transfered. Bandwidth manager then retains 
 * the data and provides asumptions on bandwdth.
 */

import LoadManager from './load';
import {removeSpikes} from '../../util/stats';


const MEASURE_TIME_LIMIT = 5000; // ms

const INITIAL_BANDWIDTH = 500000; // 0.5 mb / s

const CLIP_TOLERANCE = 0.95; // value between 0 and 1


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

	_ping = null;




	constructor(enforcer) {
		if (enforcer != singletonEnforcer) throw new Error("Cannot construct singleton");
	}






	/*____________________________________________

	Public
	_____________________________________________*/

	start(identifier) { this._start(identifier) }

	stop(identifier, bytes) { this._stop(identifier, bytes) }

	getQuality(manifest) { return this._getQuality(manifest) }

	get ping() { return this._ping }

	calculatePing(manifest) { return this._calculatePing(manifest) }






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
		console.log(`_start fragment ${fragment.url}`);
	}


	/**
	 * Called when a transfered has completed
	 * 
	 * @param {Object} Fragment Model
	 * @param {ArrayBuffer} bytes the data
	 */
	_stop(fragment, bytes) {
		const identifier = fragment.url;

		const historyData = this._findIndetifier(identifier);
		if (historyData) {
			historyData.end = new Date().getTime();
			historyData.bytes = bytes;
			historyData.time = Math.max((historyData.end - historyData.start) - this._ping, 0);
			historyData.ping = this._ping;
			historyData.bandwidth = (1000 / historyData.time) * bytes * 8; // in bits / second

			if (isFinite(historyData.bandwidth) === false) {
				historyData.bandwidth = null;
			}
		}

		console.log(`_stop fragment ${fragment.url} load time: ${historyData.time} bps: ${historyData.bandwidth / 1024}`);

		fragment.loadData = historyData;
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

			// only use history measurements within MEASURE_TIME_LIMIT
			bandwidths = bandwidths.filter(history => history.start >= now - MEASURE_TIME_LIMIT);
			
			if (bandwidths.length > 0) {

				bandwidths = bandwidths.map(history => history.bandwidth);

				// take all but the obvious spikes
				const clippedBandwidth = removeSpikes(bandwidths, CLIP_TOLERANCE); 

				// choose an appropriate bandwidth from the clipped array
				const bandwidth = this._selectBandwidth(clippedBandwidth);

				// set bandwidth into localStorage
				window.localStorage.bandwidth = parseInt(bandwidth);

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


	_selectPing(pings) {
		// use the min value, this helps minimise null bandwidth calculations
		return pings[0];
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


	/**
	 * In order to caluclate ping we load all the init fragments generally small (1kb) resulting
	 * in reponse time being the ping. Init fragments are then already loaded.
	 * Calculate Ping is called initially by Player to get all init fragments and also of
	 * course calculate ping to aid future bandwidth calculations.
	 *
	 * @param {Object} Manifest Data Model
	 */
	_calculatePing(manifest) {
		return new Promise((resolve, reject) => {
			let decriment = manifest.numberOfStreams;

			const initFragments = [];

			const loadInitFragment = () =>  {
				const fragment = manifest.getStream(decriment - 1).getFragmentInit();

				initFragments.push(fragment);

				LoadManager.getData(fragment)
					.then(() => {
						if (decriment -= 1 > 0) {
							loadInitFragment();
						} else {

							const times = initFragments.map(fragment => fragment.loadData.time);
							const clippedTimes = removeSpikes(times);

							this._ping = this._selectPing(clippedTimes);

							resolve(this._ping);
						}
					})
					.catch( error => { throw error });
			}

			loadInitFragment();
		});
	}

}

export default BandwidthManager.instance;
