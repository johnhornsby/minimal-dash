import 'babel-polyfill';
import Player from '../src//player';
import BufferOutput from '../src/debug/buffer-output';


class Main {


	constructor() {
		this._init();
	}





	/*_______________________________________________

	Private
	_______________________________________________*/
	
	_init() {
		const videoElement = document.querySelector('video');

		// const url = "http://rdmedia.bbc.co.uk/dash/ondemand/bbb/2/client_manifest-common_init.mpd"

		const url = "https://s3-eu-west-1.amazonaws.com/johnhornsby.me/projects/verusmodus/preview/streams/stream.mpd";

		const player = new Player(videoElement, url, {
			initialStreamIndex: 3,
			debug: true
		});

		// bufferOutput is simply used to debug at the moment
		const bufferOutput = new BufferOutput(player, videoElement, document.querySelector('.minimal-dash__buffer-output'));

		player.addEventListener(Player.EVENT_MANIFEST_LOADED, (event, manifest) => {
			bufferOutput.manifest = manifest;
		});

		player.addEventListener(Player.EVENT_TIME_UPDATE, (event) => {
			bufferOutput.draw();
		});

		const button = document.querySelector('.minimal-dash__play-pause');

		videoElement.addEventListener('play', function() {
			button.classList.remove('minimal-dash__play-pause--paused');
		});
		videoElement.addEventListener('pause', function() {
			button.classList.add('minimal-dash__play-pause--paused');
		});

		button.addEventListener('click', (event) => {
			if (videoElement.paused) {
				videoElement.play();
			} else {
				videoElement.pause();
			}
		});
	}
}

new Main();