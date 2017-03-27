/** 
 * Main controller class for the Minimal Dash Player.
 */

import LoadManager from './managers/load';
import VideoController from './controllers/video-element';
import SourceController from './controllers/source';
import BandwidthManager from './managers/bandwidth';
import EventEmitter from '../util/event-emitter';
import Fragment from './models/fragment';


export default class Player extends EventEmitter {


	static EVENT_TIME_UPDATE = 'eventTimeUpdate';

	static EVENT_MANIFEST_LOADED = 'eventManifestLoaded';


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



	constructor(videoElement, manifestURL) {
		super();

		this._videoElement = videoElement;

		this._manifestURL = manifestURL;


		this._initPlayer();
	}






	/*_______________________________________________

	Public
	_______________________________________________*/

	// @TODO
	// get autoplay() {}
	// set autoplay() {}


	/**
	 * Getter of video currentTime currently used in debugging
	 *
	 * @public
	 * @returns {Number} the video current time
	 */
	get currentTime() { return this._videoController.currentTime }


	/**
	 * Getter of video duration
	 *
	 * @public
	 * @returns {Number} the video current duration
	 */
	get duration() { return this._videoController.duration }

	// @TODO
	// set loop() {}
	// get loop() {}



	/**
	 * Getter of video paused status
	 *
	 * @public
	 * @returns {Boolean} the video paused status
	 */
	get paused() { return this._videoController.paused }


	/**
	 * Instruct the video element to play
	 *
	 * @public
	 */
	play() {
		this._videoController.play();
	}


	/**
	 * Instruct the video element to pause
	 *
	 * @public
	 */
	pause() {
		this._videoController.pause();
	}






	/*_______________________________________________

	Private
	_______________________________________________*/

	/**
	 * Initalisation
	 *
	 * @private
	 */
	_initPlayer() {
		this._bind();
		this._loadManifest();
	}


	/**
	 * Bind all bound methods here for clarity
	 *
	 * @private
	 */
	_bind() {
		this._onTimeUpdate = ::this._onTimeUpdate;
	}


	/**
	 * Called to load the manifest before we do anything else
	 *
	 * @private
	 */
	_loadManifest() {
		// Remove filename from path to get root directory content
		LoadManager.root = this._manifestURL.split("/").splice(0, this._manifestURL.match(/\//g).length).join("/") + "/";

		// Get the manifest file and then kickstart our checkVideoBuffer method
		LoadManager.getManifest(this._manifestURL)
			.then( manifest => {
				this._manifest = manifest;

				this._onManifestReady();

			})
			.catch(this._onError);
	}


	/**
	 * Called when manifest is ready and we can proceed with instantiation
	 *
	 * @private
	 */
	_onManifestReady() {
		// Create VideoController that will listen to the video element
		this._videoController = new VideoController(this._videoElement);
		this._videoController.manifest = this._manifest;
		this._videoController.on(VideoController.EVENT_TIME_UPDATE, this._onTimeUpdate);

		// Create SourceController that controls the MediaSource
		this._sourceController = new SourceController(this._videoController);

		this.dispatchEvent(Player.EVENT_MANIFEST_LOADED, this._manifest);

		// Initiate a process to calcualate the PING, once done we are good to go in initiating the checkVideoBuffer
		BandwidthManager.calculatePing(this._manifest)
			.then( ping => {
				this._checkVideoBuffer();
				console.log('PING = ' + ping);
			});
	}


	/**
	 * Called to check on the state of the video buffer. Load another fragment data if we need to. 
	 * Method is repeated called to check upon the state from video time updates and the callbacks
	 * from async promises.
	 *
	 * @private
	 */
	_checkVideoBuffer() {
		// check video element buffer
		const {shouldGetData, bufferEmptyAtTime} = this._videoController.checkBuffer();

		if (shouldGetData) {
			this._checkCachedData(bufferEmptyAtTime);
		} 
	}


	/**
	 * The checkCached data method is repeated called via checkVideoBuffer upon video time updates
	 * and any update to the state in the controllers. This method drives all the initialisation and
	 * loading of data for the video.
	 *
	 * The main logic for the checkCachedData method is as follows
	 *
	 *  // if find one 
	 *		// check init fragment is there
	 *			// if current stream index matches fragment index 
	 *				// append cached buffer
	 *			// else 
	 *				// switch streams
	 *		// load fragment init
	 *			// if current stream index matches fragment index 
	 *				// append cached buffer
	 *			// else 
	 *				// switch streams
	 *	// else
	 *		// check init fragment is there
	 *			// load fragment
	 *				// if current stream index matches fragment index 
	 *					// append cached buffer
	 *				// else 
	 *					// switch streams
	 *		// else
	 *			// load fragment and init
	 *				// if current stream index matches fragment index 
	 *					// append cached buffer
	 *				// else 
	 *					// switch streams
	 *
	 *
	 * @private
	 * @param {Number} bufferEmptyAtTime
	 */
	_checkCachedData(bufferEmptyAtTime) {

		console.log("READY STATE: " + this._videoElement.readyState);

		const fragmentIndex = this._manifest.getFragmentIndex(bufferEmptyAtTime);

		// check through all streams to find any cached fragment
		let fragment = this._manifest.getCachedFragment(fragmentIndex);
		let stream;

		// is there a fragment in the cache
		if (fragment) {
			stream = fragment.stream;

			// Do we have the init fragment for the stream
			if (stream.isInitialised) {

				// The SourceControler is currently intialised once, this involves opening a MediaSource
				// @TODO we need to check this is ok
				if (this._sourceController.isInitialised === false) {

					this._sourceController.initialise(stream)
						.then(() => {
							this._checkVideoBuffer()
						})
						.catch(this._onError);

				// Does the current SourceController quality match incoming fragment stream quality,
				// if so then we can add the fragment data to the buffer
				} else if (this._sourceController.quality === fragment.stream.index) {

					this._sourceController.appendToBuffer(fragment)
						.then(() => {
							console.log('_checkCachedData COMPLETE');

							this._checkVideoBuffer()
						})
						.catch(this._onError);

				// If the Fragment quality is different to that of the SourceController then we'll,
				// switch streams first before appending the fragment data
				} else {
					console.log('APPEND DIFFERENT STREAM');

					Promise.resolve()
						.then(() => this._sourceController.appendToBuffer(stream.getFragmentInit()))
						.then(() => this._sourceController.appendToBuffer(fragment))
						.then(() => {
							console.log('_checkCachedData COMPLETE');

							this._checkVideoBuffer()
						})
						.catch(this._onError);
				}

			// The SourceController is not initialised we need do this first, then re check
			} else {
				LoadManager.getData(stream.getFragmentInit())
					.then( fragment => this._checkVideoBuffer()) // now data has loaded re check cached data 
					.catch(this._onError);
			}

		// No Fragment data, we need to download before continuing
		} else {

			// There maybe no cached fragment but there may one one loading
			const loadingFragment = this._manifest.getLoadingFragment(fragmentIndex);

			// Check that the fragment is not loading
			if (loadingFragment == null) {
				const streamIndex = BandwidthManager.getQuality(this._manifest);

				stream = this._manifest.getStream(streamIndex);
				fragment = stream.getFragment(fragmentIndex);

				if (fragment.status === Fragment.status.EMPTY) {
					const getDataPromises = [LoadManager.getData(fragment)];

					if (stream.isInitialised === false) {
						getDataPromises.push(LoadManager.getData(stream.getFragmentInit()));
					}

					Promise.all(getDataPromises)
						.then( fragments => this._checkVideoBuffer()) // now data has loaded re check cached data 
						.catch(this._onError);
				} else {
					throw new Error('Stream is not empty')
				}
			}
		}
	}


	/**
	 * Event handler called from VideoController when the video time updates. Here we 
	 * want to check the buffer.
	 * 
	 * @private
	 */
	_onTimeUpdate() {
		this._checkVideoBuffer();

		this.dispatchEvent(Player.EVENT_TIME_UPDATE, this._manifest);
	}


	/**
	 * Generic Error handling method
	 * 
	 * @private
	 * @param {Error} errorObject
	 */
	_onError(errorObject) { throw errorObject }
} 