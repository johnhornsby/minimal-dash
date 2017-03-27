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
		this._workerScript = document.querySelector('#image-loader-worker').textContent;
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
			
			return FetchXHR2.fetch(manifestURL, 'text')
				.then( data => {
					const manifest = new Manifest(manifestURL, data);
					this._manifests.set(manifestURL, manifest);

					return manifest;
				})
				.catch(this._onError);

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
		
		return FetchXHR2.fetch(url, 'arraybuffer')
			.then(function(arraybuffer) {
				BandwidthManager.stop(fragment, arraybuffer.length);
				fragment.bytes = arraybuffer;
				return fragment;
			})
			.catch(this._onError);
	}


	// /**
 //    * Spawns a worker to actually load the image
 //    */
 //   _loadImage(url) {
 //      const blob = new Blob([this._workerScript]);
 //      const worker = new Worker(window.URL.createObjectURL(blob));

 //      worker.addEventListener('message', this._onImageLoad, false);
 //      worker.addEventListener('error', this._onImageError, false);
 //      worker.postMessage({url: url});
 //   }


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
