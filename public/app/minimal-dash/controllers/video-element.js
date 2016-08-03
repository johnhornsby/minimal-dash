const BUFFER_MIN_LENGTH = 2;

export default class VideoElement {


	_videoElement = null;


	constructor(videoElement) {
		this._videoElement = videoElement;

		this._init();
	}






	/*_______________________________________________

	Public
	_______________________________________________*/

	checkBuffer() {
		return this._checkBuffer();
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
		console.log(event.type);

		switch(event.type) {
		case 'durationchange':
			break;
		case 'loadedmetadata':

			break;
		case 'progress':
			// console.log('readyState:' + this._videoElement.readyState);
			break;
		case 'loadeddata':
			break;
		}
	}


	_checkBuffer(videoElement) {
		const currentTime = this._videoElement.currentTime;

		let index = this._videoElement.buffered.length;
		const ranges = [];

		if (index === 0) return false;

		while(index--) {
			ranges.push({
				start: this._videoElement.buffered.start(index),
				end: this._videoElement.buffered.end(index),
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
}