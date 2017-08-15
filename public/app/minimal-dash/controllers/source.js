import EventEmitter from 'wolfy87-eventemitter';

export default class Source extends EventEmitter {


	static EVENT_SOURCE_OPEN = 'eventSourceOpen';



	_mediaSource = null;

	_sourceBuffer = null;

	_videoController = null;

	_quality = null;

	_isInitialised = false;

	_isUpdating = false;

	_currentFragmentIndex = null;


	constructor(videoController) {
		super();

		this._videoController = videoController;


		this._initSource();
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

	_initSource() {
		this._bind();

		this._mediaSource = new MediaSource();
	}


	_bind() {
		this.initialise = ::this.initialise;
		this._onInitialised = ::this._onInitialised;
		this._onError = ::this._onError;
		this._endStream = ::this._endStream;
	}


	/**
	 * Initialises the opening of the media source and once done calls Initialised
	 *
	 * @private
	 * @param {Object} stream The stream data model object
	 * @returns Promise
	 */
	_initialise(stream) {
		return this._initialiseMediaSource(stream, this._videoController, this._mediaSource)
			.then(this._onInitialised)
			.catch(this._onError);
	}


	/**
	 * Init method that opens our MediaSource within a promise and resolves when open, initiated from Player.
	 *
	 * @private
	 * @param {Object} stream The stream data model object
	 * @param {VideoController} videoController the video element controller, api to the HTML video element
	 * @param {MediaSource} mediaSource our MediaSource
	 * @returns Promise
	 */
	_initialiseMediaSource(stream, videoController, mediaSource) {
		return new Promise((resolve, reject) => {
			if (MediaSource.isTypeSupported(stream.bufferType) === false) {
				reject(new Error('Media type is not supported:', stream.bufferType));
			}

			// This caused an error on my macbook, omitting for now
			// videoController.src = null;

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
		return new Promise((resolve, reject) => {

			if (this._isUpdating === false) {
				this._isUpdating = true;

				console.log('_appendToBuffer arrayBuffer length: ' + fragment.size + ' ' + fragment.url);

				const sourceBuffer = this._sourceBuffer;
				const self = this;

				this._quality = fragment.streamIndex;
				this._currentFragmentIndex = fragment.index;

				sourceBuffer.appendBuffer(fragment.bytes);

				// if (this._videoElement.paused) {
				// 	this._videoElement.play(); // Start playing if paused
				// }

				if (fragment.isLast) {
					this._sourceBuffer.addEventListener('updateend', this._endStream);
				}

				sourceBuffer.addEventListener('updateend', onUpdateEnd);

				function onUpdateEnd() {
					console.log('_appendToBuffer onUpdateEnd');
					sourceBuffer.removeEventListener('updateend', onUpdateEnd);

					self._isUpdating = false;

					resolve();
				}
			}
			// } else {
			// 	reject(new Error(`Will not appendBuffer with fragment index ${fragment.index}, SourceBuffer is still being updated with fragment index ${this._currentFragmentIndex}, try later`));
			// }

		});
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
		console.log('Source endOfStream()');
		this._sourceBuffer.removeEventListener('updateend', this._endStream);
	}


	_onError(errorObject) { throw errorObject }
}