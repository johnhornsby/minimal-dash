import EventEmitter from 'wolfy87-eventemitter';
import FetchXHR2 from '../../util/fetch-xhr2';
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

	// {Map} record of all loaded Manifest data models
	_manifests = null;

	// {String} the root url from which to compose all Fragemnt relative links
	_root = "";




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
	getManifest(manifestURL) { return this._getManifest(manifestURL) }


	/**
	 * Async Methd to aquire the data for s Fragment Data Model
	 *
	 * @public
	 * @param {Object} fragment The empty Fragment Data Model
	 * @returns {Promise} The promise returing the Fragment Data Model now containing the data
	 */
	getData(fragment) { return this._getData(fragment) }


	/**
	 * Setter setting the root path from which to get the streams fragment files
	 *
	 * @public
	 * @param {String} url The url of the root path
	 */
	set root(url) { this._root = url }






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
		// worker script used to load images, here plucked from the dom
		// this._workerScript = document.querySelector('#image-loader-worker').textContent;

		this._workerScript = `self.addEventListener('message', function(e) {
			onload = function () {

				switch(e.data.type) {
				case 'arraybuffer':
					self.postMessage(xhr.response, [xhr.response]);
					break;
				case 'text':
					self.postMessage(xhr.response);
					break;
				}

				self.close();
				console.log(this + ' load ' + e.data.url);
			};

			onabort = function() {
				console.error(this + ' abort ' + e.data.url);
			}

			onerror = function() {
				console.error(this + ' error ' + e.data.url);
			}

			var xhr = new XMLHttpRequest();
			xhr.responseType = e.data.type;
			xhr.onload = onload;
			xhr.onerror = onerror;
			xhr.onabort = onabort;
			xhr.open('GET', e.data.url, true);
			xhr.send();

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
	_getManifest(manifestURL) {
		if (this._manifests.has(manifestURL) === false) {

			return new Promise((resolve, reject) => {
				const blob = new Blob([this._workerScript]);
				const worker = new Worker(window.URL.createObjectURL(blob));

				worker.addEventListener('message', (event) => {
					const manifest = new Manifest(manifestURL, event.data);
					this._manifests.set(manifestURL, manifest);

					resolve(manifest);
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
	_getData(fragment) {
		const url = this._root + fragment.url;

		fragment.isLoading();
		BandwidthManager.start(fragment);

		return new Promise((resolve, reject) => {

			// WORKER
			// const blob = new Blob([this._workerScript]);
			// const worker = new Worker(window.URL.createObjectURL(blob));

			// worker.addEventListener('message', (event) => {
			// 	console.log('worker message received ' + url);

			// 	const arraybuffer = new Uint8Array(event.data);
			// 	BandwidthManager.stop(fragment, arraybuffer.length);
			// 	fragment.bytes = arraybuffer;

			// 	resolve(fragment);
			// }, false);
			// worker.addEventListener('error', this._onError, false);
			// worker.postMessage({url: url, type: 'arraybuffer'});


			// NON WORKER
			onload = function () {
				const arraybuffer = new Uint8Array(xhr.response);
				BandwidthManager.stop(fragment, arraybuffer.length);
				fragment.bytes = arraybuffer;

				resolve(fragment);


				console.log(this + ' load ' + url);
			};

			var xhr = new XMLHttpRequest();
			xhr.responseType = 'arraybuffer';
			xhr.onload = onload;
			xhr.open('GET', url, true);
			xhr.send();


		});
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
