
const MEASURE_TIME_LIMIT = 3;


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

	}


	_getQuality(manifest) {
		// manifest.streams.
	}

}

export default BandwidthManager.instance;
