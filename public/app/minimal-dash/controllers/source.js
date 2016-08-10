import EventEmitter from 'wolfy87-eventemitter';

export default class Source extends EventEmitter {


	static EVENT_SOURCE_OPEN = 'eventSourceOpen';



	_mediaSource = null;

	_sourceBuffer = null;

	_videoController = null;

	_quality = null;

	_isInitialised = false;

	_isUpdating = false;


	constructor(videoController) {
		super();

		this._videoController = videoController;

		this._init();
	}





	/*_______________________________________________

	Public
	_______________________________________________*/

	initialise(stream) { return this._initialise(stream) }

	appendToBuffer(fragment) { return this._appendToBuffer(fragment) }

	get quality() { return this._quality }

	get isInitialised() { return this._isInitialised }

	get isUpdating() { return this._isUpdaing }






	/*_______________________________________________

	Private
	_______________________________________________*/

	_init() {
		this._bind();

		this._mediaSource = new MediaSource();
	}


	_bind() {
		this.initialise = ::this.initialise;
		this._onInitialised = ::this._onInitialised;
		this._onError = ::this._onError;
		this._endStream = ::this._endStream;
		// this._getInitData = ::this._getInitData;
		// this._onReceiveFragment = ::this._onReceiveFragment;
		// this._onUpdateEnd = ::this._onUpdateEnd;
	}


	/**
	 * @returns Promise
	 */
	_initialise(stream) {

		return this._initialiseMediaSource(stream, this._videoController, this._mediaSource)
			.then(this._onInitialised)
			.catch(this._onError);

	}


	/**
	 * @returns Promise
	 */
	_initialiseMediaSource(stream, videoController, mediaSource) {
		return new Promise((resolve, reject) => {

			if (MediaSource.isTypeSupported(stream.bufferType) === false) {
				reject(new Error('Media type is not supported:', stream.bufferType));
			}

			videoController.src = null;

			mediaSource.addEventListener('sourceopen', onSourceOpen);

			let sourceURL = window.URL.createObjectURL(mediaSource);
			videoController.src = sourceURL;

			function onSourceOpen() {

				window.URL.revokeObjectURL(sourceURL);

				mediaSource.removeEventListener('sourceopen', onSourceOpen);

				const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.64001E"');

				resolve({mediaSource, sourceBuffer, stream});
			}
		});
	}


	_onInitialised({mediaSource, sourceBuffer, stream}) {

		console.log('mediaSource readyState: ' + mediaSource.readyState);

		mediaSource.duration = stream.duration;

		mediaSource.addEventListener('error', this._onError);
		sourceBuffer.addEventListener('error', this._onError);
		// sourceBuffer.addEventListener('updateend', this._onUpdateEnd);

		this._sourceBuffer = sourceBuffer;

		this._isInitialised = true;
	}


	_appendToBuffer(fragment) {
		// if (this._isUpdaing === false) {

		// 	this._isUpdaing = true;

		return new Promise((resolve, reject) => {
			console.log('_appendToBuffer arrayBuffer length: ' + fragment.size + ' ' + fragment.url);

			const sourceBuffer = this._sourceBuffer;

			this._quality = fragment.streamIndex;

			sourceBuffer.appendBuffer(fragment.bytes);

			// if (this._videoElement.paused) {
			// 	this._videoElement.play(); // Start playing if paused
			// }

			if (fragment.isLast) {
				// this._sourceBuffer.addEventListener('updateend', this._endStream);
			}

			sourceBuffer.addEventListener('updateend', onUpdateEnd);

			function onUpdateEnd() {
				console.log('_appendToBuffer onUpdateEnd');
				sourceBuffer.removeEventListener('updateend', onUpdateEnd);

				// this._isUpdaing = false;

				resolve();
			}

		});
		// }
	}


	// _onUpdateEnd() {
	// 	console.log('_onUpdateEnd');
	// 	//@TODO check the buffer and request more data if necessary
	// 	//this._videoController.checkBuffer();
	// }


	_endStream() {
		if (this._mediaSource.readyState !== 'open') {
			this._onError(new Error("MediaSource readyState is not open, can't end steam"));
		}

		this._mediaSource.endOfStream();
	}


	_onError(errorObject) { throw errorObject }
}