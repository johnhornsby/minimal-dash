
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




	constructor(enforcer) {
		if (enforcer != singletonEnforcer) throw new Error("Cannot construct singleton");
	}






	/*____________________________________________

	Public
	_____________________________________________*/

	start(identifier) { this._start(identifier) }

	stop(identifier, bytes) { this._stop(identifier, bytes) }

	getQuality(manifest) { return this._getQuality(manifest) }







	/*____________________________________________

	Private 
	_____________________________________________*/

	_init() {
		this._history = [];
	}


	_start(identifier) {
		this._history.push({
			identifier: identifier,
			start: new Date().getTime()
		})
	}


	_stop(identifier, bytes) {
		const historyData = this._findIndetifier(identifier);
		if (historyData) {
			historyData.end = new Date().getTime();
			historyData.bytes = bytes;
			historyData.time = historyData.end - historyData.start;
			historyData.bandwidth = (1000 / historyData.time) * bytes;

			console.dir(historyData);
		}
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
		// @TODO properly analyse the history data
		if (this._history.length > 0) {
			return this._history[this._history.length - 1].bandwidth;
		} else {
			return INITIAL_BANDWIDTH;
		}
	}


	_getQuality(manifest) {
		const bandwidth = this._getBandwidth();
		let increment = 0;
		let streamIndex = manifest.numberOfStreams - 1; // initially set to minimum

		while(increment < manifest.numberOfStreams) {

			if (parseInt(manifest.getStream(increment).bandwidth) < bandwidth) {
				streamIndex = increment;
				break;
			}

			increment++;
		}
		// debugger;
		return streamIndex;
		// return Math.round(Math.random()) + 3;
	}

}

export default BandwidthManager.instance;
