import LoadManager from './managers/load';
import VideoController from './controllers/video-element';
import SourceController from './controllers/source';
import BandwidthManager from './managers/bandwidth';
import EventEmitter from '../util/event-emitter';


export default class Player extends EventEmitter {


	static EVENT_TIME_UPDATE = 'eventTimeUpdate';


	// controller of the video element
	_videoController = null;

	// controllor the video's related MediaSource and SourceBuffer
	_sourceController = null;

	// url of manifest file
	_manifestURL = null;

	// mainifest data object
	_manifest = null;

	// current stream index
	_streamIndex = null;

	_isUpdating = false;


	constructor(videoElement, manifestURL) {
		super();

		this._videoElement = videoElement;

		this._manifestURL = manifestURL;


		this._init();
	}






	/*_______________________________________________

	Public
	_______________________________________________*/







	/*_______________________________________________

	Private
	_______________________________________________*/

	_init() {
		this._bind();

		this._videoController = new VideoController(this._videoElement);
		this._videoController.on(VideoController.EVENT_TIME_UPDATE, this._onTimeUpdate);
		this._sourceController = new SourceController(this._videoController);

		// Get manifest and kickstart checking cached data
		this._getManifest()
			.then( manifest => {
				this._manifest = manifest;

				this._checkVideoBuffer();

				// this._sourceController.initialise(manifest.getStream(5))
				// 		.then(() => {
				// 			this._createSelects(manifest);
				// 		})
				// 		.catch(this._onError);


			})
			.catch(this._onError);
	}


	// _createSelects(manifest) {
	// 	for (let stream of manifest) {
	// 		const select = document.createElement('select');
	// 		select.id = 'stream-' + stream.index;
	// 		document.body.appendChild(select);

	// 		const option = document.createElement('option');
	// 		option.value = '';
	// 		option.innerHTML = 'Select Fragment';
	// 		select.appendChild(option);

	// 		select.addEventListener('change', (event) => {
	// 			const index = parseInt(select.value);

	// 			let fragment;
	// 			if (index === -1) {
	// 				fragment = stream.getFragmentInit();
	// 			} else {
	// 				fragment = stream.getFragment(index);
	// 			}

	// 			this._sourceController.appendToBuffer(fragment);
	// 		});

	// 		LoadManager.getData(stream.getFragmentInit())
	// 				.then( fragment => {
	// 					this._createOption(select, fragment, stream);
	// 				}) // now data has loaded re check cached data 
	// 				.catch(this._onError);
	// 	}
	// }


	// _createOption(select, fragment, stream) {
	// 	const option = document.createElement('option');
	// 	option.value = fragment.index;
	// 	option.innerHTML = fragment.url;
	// 	select.appendChild(option);

	// 	this._loadNext(select, fragment.index + 1, stream);
	// }

	// _loadNext(select, index, stream) {
	// 	const fragment = stream.getFragment(index);
	// 	if (fragment) {
	// 		LoadManager.getData(fragment)
	// 				.then( fragment => {
	// 					this._createOption(select, fragment, stream);
	// 				}) // now data has loaded re check cached data 
	// 				.catch(this._onError);
	// 	}
		
	// }



	_bind() {
		this._onTimeUpdate = ::this._onTimeUpdate;
	}


	_getManifest() {
		// init stream model with manifest
		return LoadManager.getManifest(this._manifestURL);
	}


	_checkVideoBuffer() {
		const {shouldGetData, bufferEmptyAtTime} = this._videoController.checkBuffer(this._manifest);

		if (shouldGetData) {
			this._checkCachedData(bufferEmptyAtTime);
		}
	}


	_checkCachedData(bufferEmptyAtTime) {

		const fragmentIndex = this._manifest.getFragmentIndex(bufferEmptyAtTime);

		// check through all streams to find any cached fragment

		let fragment = this._manifest.getCachedFragment(fragmentIndex);
		const streamIndex = BandwidthManager.getQuality(this._manifest);
		let stream;

		// is there a fragment in the cache
		if (fragment) {
			stream = this._manifest.getStream(fragment.streamIndex);

			// do we have the init fragment for the stream
			if (stream.isInitialised) {

				if (this._sourceController.isInitialised === false) {
					this._sourceController.initialise(stream)
						.then(() => {
							this._checkVideoBuffer()
						})
						.catch(this._onError);
				} else if (this._sourceController.quality === fragment.stream.index) {
					if (this._isUpdating === false) {
						this._isUpdating = true;

						this._sourceController.appendToBuffer(fragment)
							.then(() => {
								console.log('_checkCachedData COMPLETE');
								this._isUpdating = false;
								this._checkVideoBuffer()
							})
							.catch(this._onError);
					}
				} else {
					console.log('APPEND DIFFERENT STREAM');
					if (this._isUpdating === false) {
						this._isUpdating = true;

						Promise.resolve()
							.then(() => this._sourceController.appendToBuffer(stream.getFragmentInit()))
							.then(() => this._sourceController.appendToBuffer(fragment))
							.then(() => {
								console.log('_checkCachedData COMPLETE');
								this._isUpdating = false;
								this._checkVideoBuffer()
							})
							.catch(this._onError);
					}
					
				}
			} else {
				// load stream init
				LoadManager.getData(stream.getFragmentInit())
					.then( fragment => this._checkVideoBuffer()) // now data has loaded re check cached data 
					.catch(this._onError);
			}
		} else {
			stream = this._manifest.getStream(streamIndex);
			fragment = stream.getFragment(fragmentIndex);
			const getDataPromises = [LoadManager.getData(fragment)];

			if (stream.isInitialised === false) {
				getDataPromises.push(LoadManager.getData(stream.getFragmentInit()));
			}

			Promise.all(getDataPromises)
				.then( fragments => this._checkVideoBuffer()) // now data has loaded re check cached data 
				.catch(this._onError);
		}

		// if find one 
			// check init fragment is there
				// if current stream index matches fragment index 
					// append cached buffer
				// else 
					// switch streams
			// load fragment init
				// if current stream index matches fragment index 
					// append cached buffer
				// else 
					// switch streams
		// else
			// check init fragment is there
				// load fragment
					// if current stream index matches fragment index 
						// append cached buffer
					// else 
						// switch streams
			// else
				// load fragment and init
					// if current stream index matches fragment index 
						// append cached buffer
					// else 
						// switch streams

	}


	_onTimeUpdate() {
		this._checkVideoBuffer();

		this.dispatchEvent(Player.EVENT_TIME_UPDATE, this._manifest);
	}


	_onError(errorObject) { throw errorObject }
} 