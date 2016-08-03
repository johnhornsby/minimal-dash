import co from 'co';

import StreamsManager from './managers/streams';
import VideoController from './controllers/video-element';
import SourceController from './controllers/source';




export default class Player {


	_streamModel = null;

	_videoElement = null;

	_mediaSource = null;

	_sourceBuffer = null;

	_videoController = null;

	_sourceController = null;

	_manifest = null;


	constructor(videoElement, manifestURL) {

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
		this._sourceController = new SourceController();

		this._getManifest();
	}


	_bind() {
		this._onError = ::this._onError;
		this._endStream = ::this._endStream;
		this._getInitData = ::this._getInitData;
		this._onReceiveFragment = ::this._onReceiveFragment;
		this._onUpdateEnd = ::this._onUpdateEnd;
	}


	_getManifest() {
		// init stream model with manifest
		StreamsManager.getManifest(this._manifestURL)
			.then( manifestData => {

				const bufferType = manifestData.getStream(0).bufferType;

				this._mediaSource = new MediaSource();

				this._initialiseMediaSource(bufferType, this._videoElement, this._mediaSource)
					.then( ({mediaSource, sourceBuffer}) => {

						console.log('mediaSource readyState: ' + mediaSource.readyState);


						mediaSource.duration = manifestData.duration;

						mediaSource.addEventListener('error', this._onError);
						sourceBuffer.addEventListener('error', this._onError);
						sourceBuffer.addEventListener('updateend', this._onUpdateEnd);

						this._sourceBuffer = sourceBuffer;

						this._getInitData();
					})
					.catch(this._onError);
			})
			.catch(this._onError);
	}


	_getInitData() {
		StreamsManager.getInitData(this._manifestURL).then((arrayBuffer) => {
			this._onReceiveFragment(arrayBuffer);

			// @TEMP
			StreamsManager._getMediaData(this._manifestURL).then(this._onReceiveFragment);
		});
		
	}


	_initialiseMediaSource(bufferType, videoElement, mediaSource) {
		return new Promise((resolve, reject) => {

			if (MediaSource.isTypeSupported(bufferType) === false) {
				reject(new Error('Media type is not supported:', bufferType));
			}

			videoElement.src = null;

			mediaSource.addEventListener('sourceopen', onSourceOpen);

			let sourceURL = window.URL.createObjectURL(mediaSource);
			videoElement.src = sourceURL;

			function onSourceOpen() {
				window.URL.revokeObjectURL(sourceURL);

				mediaSource.removeEventListener('sourceopen', onSourceOpen);

				const sourceBuffer = mediaSource.addSourceBuffer(bufferType);

				resolve({mediaSource, sourceBuffer});
			}
		});
	}


	_onReceiveFragment(arrayBuffer, isFinalFragment = false) {
		console.log('_onReceiveFragment arrayBuffer length: ' + arrayBuffer.length);
		this._sourceBuffer.appendBuffer(arrayBuffer);

		// if (this._videoElement.paused) {
		// 	this._videoElement.play(); // Start playing if paused
		// }

		if (isFinalFragment) {
			this._sourceBuffer.addEventListener('updateend', this._endStream);
		}		
	}


	_onUpdateEnd() {
		console.log('_onUpdateEnd');
		
		this._videoController.checkBuffer();
	}


	_endStream() {
		if (this._mediaSource.readyState !== 'open') {
			this._onError(new Error("MediaSource readyState is not open, can't end steam"));
		}

		this._mediaSource.endOfStream();
	}


	_onError(error) {
		console.error(error);
	}
} 