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

		const url = "https://s3-eu-west-1.amazonaws.com/johnhornsby.me/projects/verusmodus/preview/streams/stream.mpd";

		const player = new Player(videoElement, url);

		// bufferOutput is simply used to debug at the moment
		const bufferOutput = new BufferOutput(player, videoElement, document.querySelector('.minimal-dash__buffer-output'));

		player.addEventListener(Player.EVENT_MANIFEST_LOADED, (event, manifest) => {
			bufferOutput.manifest = manifest;
		});

		player.addEventListener(Player.EVENT_TIME_UPDATE, (event) => {
			bufferOutput.draw();
		});

		const button = document.querySelector('.minimal-dash__play-pause');

		button.addEventListener('click', (event) => {
			const button = event.currentTarget;

			this._updatePlayButton(button, player);
		});
	}


	_updatePlayButton(button, player) {
		if (player.paused) {

			player.play();
			button.classList.remove('minimal-dash__play-pause--paused');
		} else {
			player.pause();
			button.classList.add('minimal-dash__play-pause--paused');
		}
	}
}

new Main();