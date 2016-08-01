import 'babel-polyfill';
import Player from './minimal-dash/player';


class Main {


	constructor() {
		this._init();
	}





	/*_______________________________________________

	Private
	_______________________________________________*/
	
	_init() {
		const videoElement = document.querySelector('video');

		const player = new Player(videoElement, '/public/streams/stream.mpd');
	}
}

new Main();