/**
 * The VideoElement controller is minimalDash's API to the HTML Video Element, The controller also
 * monitors the video playback and dispatches time update events. This is then used to call
 * this.checkBuffer which provides confirmation if we need load more into the buffer and at
 * what time
 */

import EventEmitter from 'wolfy87-eventemitter';


// Minimum fragment lengths that the we aim to keep full before loading another
const BUFFER_MIN_LENGTH = 2;

const RANGE_START_END_TOLERANCE = 0.05; // Safari and Firefox buffer ranges seem to be out by 0.03, use a tollerance for now, investingate further


export default class VideoElement extends EventEmitter {

	// Event dispatched on time update
	static EVENT_TIME_UPDATE = 'eventTimeUpdate';


	// HTML Video Element
	_videoElement = null;

	// {Boolean} video element autoplay is always set to false, this property is used replace that
	_autoplay = false;

	// {Boolean} video element loop is always set to false, this property is used replace that
	_loop = false;

	// {Boolean} flag to determine loop logic
	_hasPlayed = false;

	// {Object} the manifest data model saved for internal use
	_manifest = null;

	// flag to indentiy explicity user pausing via this classes public api
	_userPaused = false;

	_debug = false



	constructor(videoElement, debug = false) {
		super();

		this._videoElement = videoElement;
		this._debug = debug;


		this._initVideoElement();
	}






	/*_______________________________________________

	Public
	_______________________________________________*/

	/**
	 * Public access to check buffer
	 *
	 * @public
	 * @param {Object} manifest The manifest data object
	 */
	checkBuffer(manifest) {
		return this._checkBuffer(manifest);
	}


	/**
	 * Instruct the video element to play
	 *
	 * @public
	 */
	play() {
		this._userPaused = false;
		this._videoElement.play();
	}


	/**
	 * Instruct the video element to pause
	 *
	 * @public
	 */
	pause() {
		this._userPaused = true;
		this._videoElement.pause();
	}


	/**
	 * Getter of video autoplay
	 *
	 * @public
	 * @returns {Boolean} the status of the video's autoplay
	 */
	get autoplay() { return this._autoplay }


	/**
	 * Getter of video currentTime currently used in debugging
	 *
	 * @public
	 * @returns {Number} the video current time
	 */
	get currentTime() { return this._videoElement.currentTime }


	/**
	 * Getter of video duration
	 *
	 * @public
	 * @returns {Number} the video current duration
	 */
	get duration() { return this._videoElement.duration }


	/**
	 * Getter of video ended status
	 *
	 * @public
	 * @returns {Boolean} the video has ended
	 */
	get ended() { return this._videoElement.ended }


	/**
	 * Getter of video element
	 *
	 * @public
	 * @returns {HTMLVideoElement} the video element
	 */
	get element() { return this._videoElement }


	/**
	 * Getter of video autoplay
	 *
	 * @public
	 * @returns {Boolean} the status of the video's autoplay
	 */
	get loop() { return this._loop }


	/**
	 * Getter of video paused status
	 *
	 * @public
	 * @returns {Boolean} the video paused status
	 */
	get paused() { return this._videoElement.paused }


	/**
	 * Setter to set the manifest data model
	 *
	 * @public
	 * @param {Object} manifest The manifest data model saved for internal use
	 */
	set manifest(manifest) { this._manifest = manifest }


	/**
	 * Setter to set the source of the video element
	 *
	 * @public
	 * @param {String} the url created by the MediaSource, established from the SourceController
	 */
	set src(source) {
		this._videoElement.src = source;
	}






	/*_______________________________________________

	Private
	_______________________________________________*/

	/**
	 * Initialisation
	 *
	 * @private
	 */
	_initVideoElement() {
		this._bind();

		// Check explicit setting of video element to preload, typically we will not want this to be the default.
		const shouldPreload = this._videoElement.getAttribute('preload');
		this._videoElement.preload = (shouldPreload !== null && shouldPreload !== "none") ? "auto": "none";

		// the autoplay property of the video element must be set to false, we will use an internal property
		// to determine if we want to autoplay
		this._autoplay = (this._videoElement.getAttribute('autoplay') !== null) ? true: false;
		this._videoElement.autoplay = false;

		// the loop property of the video element must be set to false, we will use an internal property
		// to determine if we want to loop
		this._loop = (this._videoElement.getAttribute('loop') !== null) ? true: false;
		this._videoElement.loop = false;

		this._videoElement.addEventListener("loadstart", this._onVideoEvent);
        this._videoElement.addEventListener("abort", this._onVideoEvent);
        this._videoElement.addEventListener("canplay", this._onVideoEvent);
        this._videoElement.addEventListener("canplaythrough", this._onVideoEvent);
        this._videoElement.addEventListener("durationchange", this._onVideoEvent);
        this._videoElement.addEventListener("emptied", this._onVideoEvent);
        this._videoElement.addEventListener("ended", this._onVideoEvent);
        this._videoElement.addEventListener("error", this._onVideoEvent);
        this._videoElement.addEventListener("loadeddata", this._onVideoEvent);
        this._videoElement.addEventListener("loadedmetadata", this._onVideoEvent);
        this._videoElement.addEventListener("pause", this._onVideoEvent);
        this._videoElement.addEventListener("play", this._onVideoEvent);
        this._videoElement.addEventListener("playing", this._onVideoEvent);
        this._videoElement.addEventListener("progress", this._onVideoEvent);
        this._videoElement.addEventListener("ratechange", this._onVideoEvent);
        this._videoElement.addEventListener("resize", this._onVideoEvent);
        this._videoElement.addEventListener("seeked", this._onVideoEvent);
        this._videoElement.addEventListener("seeking", this._onVideoEvent);
        this._videoElement.addEventListener("stalled", this._onVideoEvent);
        this._videoElement.addEventListener("suspend", this._onVideoEvent);
        this._videoElement.addEventListener("timeupdate", this._onVideoEvent);
        this._videoElement.addEventListener("waiting", this._onVideoEvent);
	}


	/**
	 * Bind here for clarity
	 *
	 * @private
	 */
	_bind() {
		this._onVideoEvent = ::this._onVideoEvent;
	}


	/**
	 * Video event handler currently used to monitor time updates, this then cues the player to periodically check the buffer
	 *
	 * @private
	 * @param {Event} event browser video event
	 */
	_onVideoEvent(event) {
		if (this._debug) console.log("VIDEO EVENT: " + event.type + " " + this._videoElement.currentTime);
		switch(event.type) {
		case 'ended':
			// reset _userPaused 
			this._userPaused = false;

			if (this._loop) {
				this._videoElement.play();
			}
			break;
		case 'play':
			this._userPaused = false;
			break;
		case 'pause':
			// pause is only dispatched when user presses pause, api is told to pause or video has ended
			this._userPaused = true;
			break;
		case 'progress':
			this._checkToAutoPlay();
			break;
		case 'timeupdate':
			this.emit(VideoElement.EVENT_TIME_UPDATE);
			break;		
		}
	}


	/**
	 * @TODO this currently does not work when user plays and pauses via the video controls
	 * 
	 * Method called on progress event to check if conditions are right to auto play the video element. Conditions are,
	 * 1: AutoPlay is on video element is set
	 * 2: The VideoElement is current not playing
	 * 3: The user as not explicity paused player
	 * 4: The VideoElement has not ended
	 * 5: We have enough data in the buffer
	 * 
	 * @private
	 */
	_checkToAutoPlay() {
		const {shouldGetData} = this._checkBuffer(); 

		if (this._autoplay && this._videoElement.paused && !this._userPaused && this._videoElement.ended === false && shouldGetData === false) {
			
			this._videoElement.play();

		}
	}


	/**
	 * A Check of the video to determine if the buffer requires filling, and also at what time the video buffer will run out
	 * called by the player
	 *
	 * @private
	 * @returns {Object} containing a boolean flag to whether the buffer need topping up and also the time that the buffer is empty at
	 */
	_checkBuffer() {
		let shouldGetData = true;

		const currentTime = this._videoElement.currentTime;
		const bufferMinLength = (this._videoElement.preload === "auto") ? this._manifest.duration: BUFFER_MIN_LENGTH;

		let bufferIndex = this._videoElement.buffered.length;
		const fragmentDuration = this._manifest.fragmentDuration;

		let bufferEmptyAtTime = null;
		const ranges = [];

		if (this._videoElement.buffered.length === 0 && bufferMinLength > 0) {
			shouldGetData = true;
			bufferEmptyAtTime = 0;
		}

		while(bufferIndex--) {
			ranges.push({
				start: this._videoElement.buffered.start(bufferIndex),
				end: this._videoElement.buffered.end(bufferIndex),
				index: bufferIndex
			});
		}

		// Here we attempt to determin if the playhead is within a currently buffered range
		ranges.forEach(range => {

			const equalOrGreaterThanStart = (currentTime >= (range.start - RANGE_START_END_TOLERANCE));
			const equalOrLessThanEnd = (currentTime <= (range.end + RANGE_START_END_TOLERANCE));

			// find the range that the currentTime is within
			if (equalOrGreaterThanStart && equalOrLessThanEnd) {

				// calculate the time at when the next fragment is needed in the buffer,
				// typically this will be at the end of a fragment, and so we will use the tollerance range
				// to snap this perfectly to the first ms of the next fragment. However we can't 
				// gaurantee that the browser has not flushed the cache or only part of the fragment was 
				// attached to the media source, in this case when outside of the tollerance we will
				// simply take this value at face value to handle these unforseen circumstances.
				const snappedRangeEnd = Math.round(range.end / fragmentDuration) * fragmentDuration;
				if (range.end >= snappedRangeEnd - RANGE_START_END_TOLERANCE && range.end <= snappedRangeEnd + RANGE_START_END_TOLERANCE) {
					bufferEmptyAtTime = snappedRangeEnd;
				} else {
					bufferEmptyAtTime = range.end;
				}

				// cancel getting more data if we have enough buffer infront of the playhead
				if (currentTime <= bufferEmptyAtTime - bufferMinLength) {
					shouldGetData = false;
				}

				// cancel only if buffer is within the last fragment
				if (bufferEmptyAtTime > this._manifest.duration - fragmentDuration) {
					shouldGetData = false;
				}
			}
		});

		// If there is no buffer surrounding currentTime, then set to currentTime
		if (bufferEmptyAtTime === null) {
			bufferEmptyAtTime = currentTime;
		}

		return {
			shouldGetData,
			bufferEmptyAtTime
		}
	}
}