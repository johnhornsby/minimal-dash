import Stream from './stream';



export default class Manifest {


	_duration = 0;

	_url = "";

	_streams = null;

	_numberOfFragments = 0;

	_fragmentDuration = 0;

	_timescale = 0;

	_mimeType = "";

	_initialization = "";

	_media = "";

	_minBufferTime = 0;

	_startNumber = 0;


	constructor(url, manifestString) {

		this._url = url;

		this._parse(manifestString);
	}






	/*____________________________________________

	Public
	_____________________________________________*/

	get duration() { return this._duration }

	get url() { return this._url }

	getStream(index) { return this._streams[index] }

	getFragment(streamIndex, fragmentIndex) { return this._streams[streamIndex].getFragment(fragmentIndex) }

	cacheFragmentBytes(arrayBuffer, streamIndex, fragmentIndex) {
		this._streams[streamIndex].cacheFragmentBytes(arrayBuffer, fragmentIndex);
	}






	/*____________________________________________

	Private
	_____________________________________________*/

	_parse(string) {
		const parser = new DOMParser();
		const xml = parser.parseFromString(string, 'text/xml').documentElement;


		let node = xml.querySelector('SegmentTemplate');

		this._fragmentDuration = node.getAttribute('duration');
		this._initialization = node.getAttribute('initialization');
		this._media = node.getAttribute('media');
		this._startNumber = node.getAttribute('startNumber');
		this._timescale = node.getAttribute('timescale');

		node = xml.querySelector('AdaptationSet');

		this._mimeType = node.getAttribute('mimeType');

		const durationString = xml.getAttribute('mediaPresentationDuration');
		let seconds = durationString.match(/\d*(?=S)/);
		let minutes = durationString.match(/\d*(?=M)/) || [0];
		let hours = durationString.match(/\d*(?=H)/) || [0];

		this._duration = (parseInt(hours[0]) * 60 * 60) + (parseInt(minutes[0]) * 60) + parseInt(seconds[0]);
		this._numberOfFragments = Math.ceil(this._duration / (this._fragmentDuration / 1000));

		this._streams = Array.from(xml.querySelectorAll('Representation')).map((node) => {

			return new Stream({
				bandwidth: node.getAttribute('bandwidth'),
				codecs: node.getAttribute('codecs'),
				frameRate: node.getAttribute('frameRate'),
				height: node.getAttribute('height'),
				id: node.getAttribute('id'),
				scanType: node.getAttribute('scanType'),
				width: node.getAttribute('width'),
				initialization: this._initialization,
				startNumber: this._startNumber,
				media: this._media,
				mimeType: this._mimeType,
				duration: this._duration,
				numberOfFragments: this._numberOfFragments
			});
		});


	}
}