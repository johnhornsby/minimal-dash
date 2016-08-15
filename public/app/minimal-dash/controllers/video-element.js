import EventEmitter from 'wolfy87-eventemitter';

const BUFFER_MIN_LENGTH = 2;

export default class VideoElement extends EventEmitter {


	static EVENT_TIME_UPDATE = 'eventTimeUpdate';


	_videoElement = null;


	constructor(videoElement) {
		super();

		this._videoElement = videoElement;

		this._init();
	}






	/*_______________________________________________

	Public
	_______________________________________________*/

	checkBuffer(manifest) {
		return this._checkBuffer(manifest);
	}

	set src(source) {
		this._videoElement.src = source;
	}

	get currentTime() {
		return this._videoElement.currentTime;
	}



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
	}


	_bind() {
		this._onVideoEvent = ::this._onVideoEvent;
	}


	_onVideoEvent(event) {
		// console.log(event.type);

		switch(event.type) {
		case 'durationchange':
			break;
		case 'loadedmetadata':
			// this._checkBuffer();
			break;
		case 'progress':
			// console.log('readyState:' + this._videoElement.readyState);
			break;
		case 'loadeddata':
			break;
		case 'timeupdate':
			// this._checkBuffer();
			this.emit(VideoElement.EVENT_TIME_UPDATE);
		case 'canplaythrough':
			// if (this._videoElement.paused) {
			// 	this._videoElement.play();
			// }
			
		}
	}


	_checkBuffer(manifest) {
		let shouldGetData = true;

		const currentTime = this._videoElement.currentTime;

		let index = this._videoElement.buffered.length;
		const fragmentDuration = (manifest.fragmentDuration / 1000);
		let bufferEmptyAtTime = null;
		const ranges = [];

		if (index === 0 && BUFFER_MIN_LENGTH > 0) {
			shouldGetData = true;
			bufferEmptyAtTime = 0;
		}

		while(index--) {
			ranges.push({
				start: this._videoElement.buffered.start(index),
				end: this._videoElement.buffered.end(index),
				index: index
			});
		}

		// find the end of the currently playing buffer
		ranges.forEach(function(range) {
			// find the range that the currentTime is within
			if (currentTime >= range.start && currentTime <= range.end) {

				// calculate the time at when the next fragment is needed in the buffer
				bufferEmptyAtTime = Math.round(range.end / fragmentDuration) * fragmentDuration;

				if (currentTime <= bufferEmptyAtTime - BUFFER_MIN_LENGTH) {
					shouldGetData = false;
				}

				if (range.end > manifest.duration - fragmentDuration) {
					shouldGetData = false;
				}
			}
		});

		// if there is no buffer surrounding currentTime, then set to currentTime
		if (bufferEmptyAtTime === null) {
			bufferEmptyAtTime = currentTime;
		}

		return {
			shouldGetData,
			bufferEmptyAtTime
		}
	}
}