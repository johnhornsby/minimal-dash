import EventEmitter from 'wolfy87-eventemitter';
import FetchXHR2 from '../util/fetch-xhr2';


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


	_streams = null;




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
	 	this._streams = new Map();
	}


	_bind() {}


	_getManifest(manifestURL) {
		return new Promise( (resolve, reject) => {
			if (this._streams.has(manifestURL) === false) {
				
				FetchXHR2.fetch(manifestURL, 'text')
					.then( data => {
						const manifestData = this._parseStreamMPDData(data);
						this._streams.set(manifestURL, manifestData);

						resolve(manifestData);
						// 
						// this._getVideoInitData(initURL);
					})
					.catch(this._onError);

			} else {
				resolve(this._streams.get(manifestURL));
			}
		});
	}


	_parseStreamMPDData(string) {
		
		const parser = new DOMParser();
		const xml = parser.parseFromString(string, 'text/xml').documentElement;
		const manifestData = {};

		manifestData.streams = Array.from(xml.querySelectorAll('Representation')).map((node) => {
			return {
				bandwidth: node.getAttribute('bandwidth'),
				codecs: node.getAttribute('codecs'),
				frameRate: node.getAttribute('frameRate'),
				height: node.getAttribute('height'),
				id: node.getAttribute('id'),
				scanType: node.getAttribute('scanType'),
				width: node.getAttribute('width')
			}
		});

		let node = xml.querySelector('SegmentTemplate');

		manifestData.fragmentDuration = node.getAttribute('duration');
		manifestData.initialization = node.getAttribute('initialization');
		manifestData.media = node.getAttribute('media');
		manifestData.startNumber = node.getAttribute('startNumber');
		manifestData.timescale = node.getAttribute('timescale');

		node = xml.querySelector('AdaptationSet');

		manifestData.mimeType = node.getAttribute('mimeType');
		manifestData.segmentAlignment = node.getAttribute('segmentAlignment');
		manifestData.startWithSAP = node.getAttribute('startWithSAP');

		const durationString = xml.getAttribute('mediaPresentationDuration');
		const seconds = durationString.match(/\d*(?=S)/);
		const minutes = durationString.match(/\d*(?=M)/) || [0];
		const hours = durationString.match(/\d*(?=H)/) || [0];

		manifestData.duration = (parseInt(hours[0]) * 60 * 60) + (parseInt(minutes[0]) * 60) + parseInt(seconds[0]);
		manifestData.numberOfFragments = Math.ceil(manifestData.duration / (manifestData.fragmentDuration / 1000));

		return manifestData;
	}


	_getInitData(manifestURL) {
		return new Promise( (resolve, reject) => {
			if (this._streams.has(manifestURL)) {

				const manifestData = this._streams.get(manifestURL);
				
				const url = 'streams/' + manifestData.initialization.replace("$RepresentationID$", manifestData.streams[0].id);

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


			const manifestData = this._streams.get(manifestURL);
			
			let url = 'streams/' + manifestData.media.replace("$RepresentationID$", manifestData.streams[0].id);
			url = url.replace("$Number$", "1");
			

			FetchXHR2.fetch(url, 'arraybuffer')
				.then(resolve)
				.catch(this._onError);

		});
	}


	_onError(error) {
		console.error(error);
	}


}

export default StreamsManager.instance;
