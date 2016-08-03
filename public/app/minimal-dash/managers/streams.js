import EventEmitter from 'wolfy87-eventemitter';
import FetchXHR2 from '../../util/fetch-xhr2';
import Manifest from '../models/manifest';
import BandwidthManager from './bandwidth';

let singleton = Symbol();
let singletonEnforcer = Symbol();


class StreamsManager extends EventEmitter {

	static get instance() {
		if (!this[singleton]) {
			this[singleton] = new StreamsManager(singletonEnforcer);

			this[singleton]._init();
		}

		return this[singleton];
	}


	_manifests = null;




	constructor(enforcer) {
		super()
		
		if (enforcer != singletonEnforcer) throw new Error("Cannot construct singleton");
	}





	/*____________________________________________

	Public
	_____________________________________________*/

	getManifest(manifestURL) { return this._getManifest(manifestURL) }

	getInitData(manifestURL) { return this._getInitData(manifestURL) }






	/*____________________________________________

	Private
	_____________________________________________*/

	_init() {
	 	this._manifests = new Map();
	}


	_bind() {}


	_getManifest(manifestURL) {
		return new Promise( (resolve, reject) => {
			if (this._manifests.has(manifestURL) === false) {
				
				FetchXHR2.fetch(manifestURL, 'text')
					.then( data => {
						const manifestData = new Manifest(manifestURL, data);
						this._manifests.set(manifestURL, manifestData);

						resolve(manifestData);
					})
					.catch(this._onError);

			} else {
				resolve(this._manifests.get(manifestURL));
			}
		});
	}


	_getInitData(manifestURL) {
		return new Promise( (resolve, reject) => {
			if (this._manifests.has(manifestURL)) {

				const manifestData = this._manifests.get(manifestURL);
				
				const url = 'streams/' + manifestData.getStream(0).initialization;

				FetchXHR2.fetch(url, 'arraybuffer')
					.then(resolve)
					.catch(this._onError);

			} else {
				reject(`StreamsManager._getInitData stream has not been initialised`);
			}
		});
	}


	_getMediaData(manifestURL) {
		return new Promise( (resolve, reject) => {

			const manifestData = this._manifests.get(manifestURL);
			
			let url = 'streams/' + manifestData.getFragment(0, 0).url;

			BandwidthManager.start(url);
			
			FetchXHR2.fetch(url, 'arraybuffer')
				.then(function(data) {
					BandwidthManager.stop(url, data.length);
					resolve(data);
				})
				.catch(this._onError);

		});
	}


	_onError(error) {
		console.error(error);
	}


}

export default StreamsManager.instance;
