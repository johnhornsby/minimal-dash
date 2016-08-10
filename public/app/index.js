import 'babel-polyfill';
import Player from './minimal-dash/player';
import BufferOutput from './minimal-dash/debug/buffer-output';


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

		const bufferOutput = new BufferOutput(player, videoElement, document.querySelector('.minimal-dash__buffer-output'));

		player.addEventListener(Player.EVENT_TIME_UPDATE, (event, manifest) => {
			bufferOutput.draw(manifest);
		});
	}
}

new Main();