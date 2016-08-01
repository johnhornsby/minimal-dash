import co from 'co';

import StreamsManager from './streams-manager';

const BUFFER_MIN_LENGTH = 2;

export default class Player {


	_streamModel = null;

	_videoElement = null;

	_mediaSource = null;

	_sourceBuffer = null;


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

		this._videoElement.preload = false;

		this._videoElement.addEventListener("loadstart", this._onVideoEvent);
        this._videoElement.addEventListener("emptied", this._onVideoEvent);
        this._videoElement.addEventListener("canplaythrough", this._onVideoEvent);
        this._videoElement.addEventListener("ended", this._onVideoEvent);
        this._videoElement.addEventListener("ratechange", this._onVideoEvent);
        this._videoElement.addEventListener("progress", this._onVideoEvent);
        this._videoElement.addEventListener("stalled", this._onVideoEvent);
        this._videoElement.addEventListener("playing", this._onVideoEvent);
        this._videoElement.addEventListener("durationchange", this._onVideoEvent);
        this._videoElement.addEventListener("resize", this._onVideoEvent);
        this._videoElement.addEventListener("suspend", this._onVideoEvent);
        this._videoElement.addEventListener("loadedmetadata", this._onVideoEvent);
        this._videoElement.addEventListener("waiting", this._onVideoEvent);
        this._videoElement.addEventListener("timeupdate", this._onVideoEvent);
        this._videoElement.addEventListener("abort", this._onVideoEvent);
        this._videoElement.addEventListener("loadeddata", this._onVideoEvent);
        this._videoElement.addEventListener("seeking", this._onVideoEvent);
        this._videoElement.addEventListener("play", this._onVideoEvent);
        this._videoElement.addEventListener("error", this._onVideoEvent);
        this._videoElement.addEventListener("canplay", this._onVideoEvent);
        this._videoElement.addEventListener("seeked", this._onVideoEvent);
        this._videoElement.addEventListener("pause", this._onVideoEvent);

		this._getManifest();
	}


	_bind() {
		this._onError = ::this._onError;
		this._endStream = ::this._endStream;
		this._getInitData = ::this._getInitData;
		this._onReceiveFragment = ::this._onReceiveFragment;
		this._onVideoEvent = ::this._onVideoEvent;
		this._onUpdateEnd = ::this._onUpdateEnd;
	}

	_onVideoEvent(event) {
		console.log(event.type);

		switch(event.type) {
		case 'durationchange':
			break;
		case 'loadedmetadata':

			break;
		case 'progress':
			console.log('readyState:' + this._videoElement.readyState);
			break;
		case 'loadeddata':


			this._videoElement.buffered.start(0)
			this._videoElement.buffered.end(0)
			break;
		}
	}


	_getManifest() {
		// init stream model with manifest
		StreamsManager.getManifest(this._manifestURL)
			.then( manifestData => {

				const bufferType = `${manifestData.mimeType}; codecs="${manifestData.streams[0].codecs}"`;

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


	_checkBuffer(videoElement) {
		const currentTime = videoElement.currentTime;

		let index = videoElement.buffered.length;
		const ranges = [];

		if (index === 0) return false;

		while(index--) {
			ranges.push({
				start: videoElement.buffered.start(index),
				end: videoElement.buffered.end(index),
				index: index
			});
		}

		ranges.every( range => {
			if (currentTime >= range.start && currentTime <= range.end - BUFFER_MIN_LENGTH) {
				return true;
			}
		});

		return false;
	}


	_onUpdateEnd() {
		console.log('_onUpdateEnd');
		this._checkBuffer(this._videoElement);
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