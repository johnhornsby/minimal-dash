import LoadManager from './load';
import {removeSpikes} from '../../util/stats';

const MEASURE_TIME_LIMIT = 3;

const INITIAL_BANDWIDTH = 1000000; // 1 MB / s


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
	}


	_stop(fragment, bytes) {
		const identifier = fragment.url;

		const historyData = this._findIndetifier(identifier);
		if (historyData) {
			historyData.end = new Date().getTime();
			historyData.bytes = bytes;
			historyData.time = Math.max((historyData.end - historyData.start) - this._ping, 0);
			historyData.ping = this._ping;
			historyData.bandwidth = (1000 / historyData.time) * bytes * 8; // in bits

			console.dir(historyData);
		}

		fragment.loadData = historyData;
	}


	_findIndetifier(identifier) {
		let decriment = this._history.length;
		let data = null;
		while(decriment--) {
			if (this._history[decriment].identifier === identifier) {
				return this._history[decriment];
			}
		}

		return data;
	}


	_getBandwidth() {
		
		if (this._history.length > 0) {
			let bandwidths = this._history.filter(history => history.type === 'media');
			
			if (bandwidths.length === 0) {
				return { bandwidth: INITIAL_BANDWIDTH, range: {start: INITIAL_BANDWIDTH, end: INITIAL_BANDWIDTH}};
			}
			bandwidths = bandwidths.map(history => history.bandwidth);

			const clippedBandwidth = removeSpikes(bandwidths);
			const sum = clippedBandwidth.reduce((previous, next) => previous + next);
			const bandwidth = sum / clippedBandwidth.length;

			console.log('bandwidth: ' + bandwidth);

			return { bandwidth:bandwidth, range: { start: clippedBandwidth[0], end: clippedBandwidth[clippedBandwidth.length - 1]}};
		} else {
			return { bandwidth: INITIAL_BANDWIDTH, range: {start: INITIAL_BANDWIDTH, end: INITIAL_BANDWIDTH}};
		}
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
							const sum = clippedTimes.reduce((previous, next) => previous + next);

							// average load time of init fragments
							this._ping = sum / clippedTimes.length;

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
