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

			this[singleton]._init();
		}

		return this[singleton];
	}


	_manifests = null;

	_root = "";




	constructor(enforcer) {
		super()
		
		if (enforcer != singletonEnforcer) throw new Error("Cannot construct singleton");
	}





	/*____________________________________________

	Public
	_____________________________________________*/

	getManifest(manifestURL) { return this._getManifest(manifestURL) }

	getData(fragment) { return this._getData(fragment) }

	set root(url) { this._root = url }






	/*____________________________________________

	Private
	_____________________________________________*/

	_init() {
	 	this._manifests = new Map();
	}


	_bind() {}


	/**
	 * @returns Promise
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
	 * @returns Promise
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


	_onError(errorObject) { throw errorObject }


}

export default LoadManager.instance;
