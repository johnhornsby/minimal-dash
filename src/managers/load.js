import EventEmitter from 'wolfy87-eventemitter';
import FetchXHR2 from '../util/fetch-xhr2';
import Manifest from '../models/manifest';
import BandwidthManager from './bandwidth';

let singleton = Symbol();
let singletonEnforcer = Symbol();


class LoadManager extends EventEmitter {

	static get instance() {
		if (!this[singleton]) {
			this[singleton] = new LoadManager(singletonEnforcer);

			this[singleton]._initLoadManager();
		}

		return this[singleton];
	}

	static STATUS_LOADED = 'loaded';
	static STATUS_ERROR = 'error';
	static STATUS_TIMEOUT = 'timeout';
	static STATUS_ABORT = 'abort';

	static XHR_TIMEOUT = 60000;


	// {Map} record of all loaded Manifest data models
	_manifests = null;

	// {String} the root url from which to compose all Fragemnt relative links
	_root = "";

	// unique reference to workers
	_workersSet = new Set();



	constructor(enforcer) {
		super()
		
		if (enforcer != singletonEnforcer) throw new Error("Cannot construct singleton");
	}





	/*____________________________________________

	Public
	_____________________________________________*/

	/**
	 * Async Methd to aquire a Manifest Data Model
	 *
	 * @public
	 * @param {String} manifestURL The url of the manifest file
	 * @returns {Promise} The promise returing the Manifest Data Model
	 */
	getManifest(manifestURL, debug) { return this._getManifest(manifestURL, debug) }


	/**
	 * Async Methd to aquire the data for s Fragment Data Model
	 *
	 * @public
	 * @param {Object} fragment The empty Fragment Data Model
	 * @returns {Promise} The promise returing the Fragment Data Model now containing the data
	 */
	getData(fragment, debug) { return this._getData(fragment, debug) }






	/*____________________________________________

	Private
	_____________________________________________*/

	/**
	 * Initialisation
	 *
	 * @private
	 */
	_initLoadManager() {
		this._manifests = new Map();
		
	}


	/**
	 * Create Worker Script
	 *
	 * @param {Boolean} debug
	 * @param {String}
	 * @private
	 */
	_getWorkerScript(debug = false) {
		// worker script used to load images
		return `

		var STATUS_LOADED = '${LoadManager.STATUS_LOADED}';
		var STATUS_ERROR = '${LoadManager.STATUS_ERROR}';
		var STATUS_TIMEOUT = '${LoadManager.STATUS_TIMEOUT}';
		var STATUS_ABORT = '${LoadManager.STATUS_ABORT}';
		
		var XHR_TIMEOUT = ${LoadManager.XHR_TIMEOUT};

		self.xhr = null;
		self.url = '';
		self.type = '';
		self.timeoutId = null;
		self.requestDate = null;
		self.latency = null;
		self.contentTime = null;
		self.isCached = false;
		self.accessibleDateInHeader = false;
		self.completionStatus = null;
		self.debug = ${debug}

		self.onLoad = function(event) {
			self.completionStatus = STATUS_LOADED;

			self.contentTime = new Date().getTime() - (self.requestDate.getTime() + self.latency);

			var dateString;

			if (xhr.getAllResponseHeaders().indexOf('date: ') > -1) {
				dateString = xhr.getResponseHeader('Date');
			}
			
			if (dateString != null) {
				var repsonseDate = new Date(dateString);
				self.isCached = repsonseDate.getTime() < self.requestDate.getTime();
				self.accessibleDateInHeader = true;
			}

			//if (self.debug) console.log(self + ' worker.onLoad ' + self.url + ' cached:' + self.isCached + ' latency:' + self.latency + ' contentTime:' + self.contentTime);
			self.initNotificationBeacon();
		}

		self.onabort = function() {
			self.completionStatus = STATUS_ABORT;
			//if (self.debug) console.error(self + ' abort ' + self.url);
			self.initNotificationBeacon();
		}

		self.onerror = function(event) {
			self.completionStatus = STATUS_ERROR;
			//if (self.debug) console.error(self + ' error ' + self.url);
			self.initNotificationBeacon();
		}

		self.ontimeout = function() {
			self.completionStatus = STATUS_TIMEOUT;
			//if (self.debug) console.error(self + ' timeout ' + self.url);
			self.initNotificationBeacon();
		}

		// net::ERR_INTERNET_DISCONNECTED
		self.onreadystatechange = function(event) {
			var urlArray = self.url.split('/');
			var file = urlArray.pop();
			var stream = urlArray.pop();
			if (self.debug) console.log(self + ' onreadystatechange ' + stream + ' ' + file + ' readyState:' + self.xhr.readyState + ' status:' + self.xhr.status);
			
			// check for timeout error here, as we are not using timeout event
			if (xhr.readyState === 4 && xhr.status !== 200) {
				var errorDate = new Date();
				var loadSeconds = (errorDate.getTime() - self.requestDate.getTime()) / 1000;				
				if (loadSeconds * 100 > 99 && loadSeconds * 100 < 101) {
					self.ontimeout();
				} else {
					self.onerror();
				}
			}

			// check for when first byte loads to accertain latency
			if (xhr.readyState === 3 && xhr.status === 200 && self.latency === null) {
				self.latency = new Date().getTime() - self.requestDate.getTime();
			}
		}

		self.onprogress = function(event) {
			var urlArray = self.url.split('/');
			var file = urlArray.pop();
			var stream = urlArray.pop();
			// if (self.debug) console.log(self + ' onprogress ' + stream + ' ' + file + ' readyState:' + self.xhr.readyState + ' status:' + self.xhr.status);
			
		}

		self.initNotificationBeacon = function() {
			self.clearNotificationBeacon();
			self.postMessage({
				"status": self.completionStatus,
				"isCached": self.isCached,
				"accessibleDateInHeader": self.accessibleDateInHeader,
				"latency": self.latency,
				"contentTime": self.contentTime
			});

			self.timeoutId = self.setTimeout(self.initNotificationBeacon, 1000);
		}

		self.clearNotificationBeacon = function() {
			if (self.timeoutId > 1) {
				var str = 'clearNotificationBeacon()' + self.url + ' ' + self.timeoutId
				if (self.debug) console.log(str);
			}
			self.clearTimeout(self.timeoutId);
		}

		self.initLoad = function(url, type) {
			self.requestDate = new Date();
			self.url = url;
			self.type = type;
			self.xhr = new XMLHttpRequest();
			self.xhr.timeout = XHR_TIMEOUT;
			self.xhr.onload = self.onLoad;
			self.xhr.onerror = self.onerror;
			self.xhr.onabort = self.onabort;
			self.xhr.onprogress = self.onprogress;
			self.xhr.onreadystatechange = self.onreadystatechange;
			self.xhr.open('GET', url, true);
			self.xhr.responseType = type; // IE11 must be asigned after open 
			self.xhr.send();
		}

		self.retrieveResponse = function() {
			switch(self.type) {
			case 'arraybuffer':
				self.postMessage(self.xhr.response, [self.xhr.response]);
				break;
			case 'text':
				self.postMessage(self.xhr.response);
				break;
			}

			self.destroy();
			if (self.debug) console.log(self + ' worker.retrieveResponse ' + self.url);
		}

		self.destroy = function() {
			self.clearNotificationBeacon();
			self.close();
		}

		self.addEventListener('message', function(event) {
			if (event.data.action) {
				if (event.data.action === 'retrieve') {
					self.retrieveResponse();
				} else if (event.data.action === 'destroy') {
					self.destroy();
				}
			}

			if (event.data.url && event.data.url !== '') {
				self.initLoad(event.data.url, event.data.type);
			}
		}, false);`
	}


	/**
	 * Method loads a manifest file, the instantiates the Manifest data nodel and stores it within a Map,
	 * the wrapping promise is then resolved. If the manifest has already been loaded then this is 
	 * resolved immediately.
	 *
	 * @private
	 * @param {String} manifestURL the url of the manifest file
	 * @returns {Promise}
	 */
	_getManifest(manifestURL, debug = false) {
		if (this._manifests.has(manifestURL) === false) {

			return new Promise((resolve, reject) => {
				const workerScript = this._getWorkerScript(debug);
				const blob = new Blob([workerScript]);
				const worker = new Worker(window.URL.createObjectURL(blob));

				this._workersSet.add(worker);

				worker.addEventListener('message', (event) => {
					if (event.data.constructor === Object && event.data.status) {

						switch(event.data.status) {
							case LoadManager.STATUS_LOADED:
								worker.postMessage({action: 'retrieve'});
								break;
							default:
								worker.postMessage({action: 'destroy'});
						}

					} else {
						const manifest = new Manifest(manifestURL, event.data);
						this._manifests.set(manifestURL, manifest);

						this._removeWorker(worker);

						resolve(manifest);
					}
				}, false);
				worker.addEventListener('error', this._onError, false);
				worker.postMessage({url: manifestURL, type: 'text'});
			});

		} else {
			return Promise.resolve(this._manifests.get(manifestURL));
		}
	}


	/**
	 * Method loads the data for the Fragment, then when aquired appends the data and resolves the Fragment,
	 * we also here prompt the BandwidthManager to track the start and stop of the load metrics.
	 *
	 * @private
	 * @param {Object} fragment The empty Fragment Data Model
	 * @returns {Promise} The promise returing the Fragment Data Model now containing the data
	 */
	_getData(fragment, debug = false) {
		let url = fragment.stream.manifest.url;
		url = url.split("/").splice(0, url.match(/\//g).length).join("/") + "/";
		url += fragment.url;

		fragment.isLoading();

		return new Promise((resolve, reject) => {

			// WORKER
			const workerScript = this._getWorkerScript(debug);
			const blob = new Blob([workerScript]);
			const worker = new Worker(window.URL.createObjectURL(blob));
			let isCached = false;
			let latency = 0;
			let time = 0;

			this._workersSet.add(worker);

			worker.addEventListener('message', (event) => {

				if (debug) console.log('worker message received ' + url + ' data.status:' + event.data.status );

				if (event.data.constructor === Object && event.data.status) {

					switch(event.data.status) {
						case LoadManager.STATUS_LOADED:

							isCached = event.data.isCached;
							latency = event.data.latency;
							time = event.data.contentTime;

							worker.postMessage({action: 'retrieve'});

							break;
						default:
							worker.postMessage({action: 'destroy'});
							
							fragment.isLoading(false);
							BandwidthManager.stopOnError(fragment);

							this._removeWorker(worker);
							resolve(fragment);
					}

				} else {
					const arraybuffer = new Uint8Array(event.data);

					BandwidthManager.save(fragment, arraybuffer.length, isCached, latency, time, debug);
					
					fragment.bytes = arraybuffer;

					this._removeWorker(worker);

					resolve(fragment);
				}
			}, false);
			worker.addEventListener('error', this._onError, false);
			worker.postMessage({url: url, type: 'arraybuffer'});


			// NON WORKER
			// onload = function () {
			// 	const arraybuffer = new Uint8Array(xhr.response);
			// 	BandwidthManager.stop(fragment, arraybuffer.length);
			// 	fragment.bytes = arraybuffer;

			// 	resolve(fragment);


			// 	console.log(this + ' load ' + url);
			// };

			// var xhr = new XMLHttpRequest();
			// xhr.responseType = 'arraybuffer';
			// xhr.onload = onload;
			// xhr.open('GET', url, true);
			// xhr.send();
		});
	}


	/**
	 * Method tries to delete worker from worker Set
	 *
	 * @private
	 * @param {Worker} worker
	 */
	_removeWorker(worker) {
		if (this._workersSet.has(worker)) {
			this._workersSet.delete(worker);
		} else {
			//reject("Can't delete worker");
		}
	}


	/**
	 * Generic Error handler for the promises
	 *
	 * @prviate
	 */
	_onError(errorObject) {
		throw errorObject
	}
}

export default LoadManager.instance;
