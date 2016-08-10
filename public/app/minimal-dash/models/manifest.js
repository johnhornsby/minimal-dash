import Stream from './stream';
import Fragment from './fragment';


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

	_currentStreamIncrement = 0;


	constructor(url, manifestString) {

		this._url = url;

		this._parse(manifestString);
	}






	/*____________________________________________

	Public
	_____________________________________________*/

	[Symbol.iterator]() { return this; }

	next() { return this._next(); }

	get duration() { return this._duration }

	get url() { return this._url }

	getStream(index) { return this._streams[index] }

	get numberOfStreams() { return this._streams.length }

	get fragmentDuration() { return this._fragmentDuration }

	get numberOfFragments() { return this._numberOfFragments }

	getFragment(streamIndex, fragmentIndex) { return this._streams[streamIndex].getFragment(fragmentIndex) }

	cacheFragmentBytes(arrayBuffer, streamIndex, fragmentIndex) {
		this._streams[streamIndex].cacheFragmentBytes(arrayBuffer, fragmentIndex);
	}

	getFragmentIndex(time) { 
		return Math.floor(time / (this._fragmentDuration / 1000));
	}

	getCachedFragment(index) {
		// @TODO account for loading fragments

		let fragment;

		const cachedStream = this._streams.find((stream, streamIndex) => {
			fragment = stream.getFragment(index);
			return fragment.status === Fragment.status.LOADED;
		});

		if (cachedStream) {
			return cachedStream.getFragment(index);
		} else {
			return null;
		}
	}






	/*____________________________________________

	Private
	_____________________________________________*/

	_parse(string) {
		const parser = new DOMParser();
		const xml = parser.parseFromString(string, 'text/xml').documentElement;

		let node = xml.querySelector('SegmentTemplate');

		this._fragmentDuration = parseInt(node.getAttribute('duration'));
		this._initialization = node.getAttribute('initialization');
		this._media = node.getAttribute('media');
		this._startNumber = parseInt(node.getAttribute('startNumber'));
		this._timescale = parseInt(node.getAttribute('timescale'));

		node = xml.querySelector('AdaptationSet');

		this._mimeType = node.getAttribute('mimeType');

		const durationString = xml.getAttribute('mediaPresentationDuration');
		let seconds = durationString.match(/\d*(?=S)/);
		let minutes = durationString.match(/\d*(?=M)/) || [0];
		let hours = durationString.match(/\d*(?=H)/) || [0];

		this._duration = (parseInt(hours[0]) * 60 * 60) + (parseInt(minutes[0]) * 60) + parseInt(seconds[0]);
		this._numberOfFragments = Math.ceil(this._duration / (this._fragmentDuration / 1000));

		this._streams = Array.from(xml.querySelectorAll('Representation')).map((node, index) => {

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
				numberOfFragments: this._numberOfFragments,
				index: index
			});
		});
	}


	_next() {
		
		let streamImcrement = this._currentStreamIncrement;

		this._currentStreamIncrement += 1;

		let done = this._currentStreamIncrement  > this._streams.length;

		if (done) {
			this._currentStreamIncrement = 0;
			return {done}

		} else {
			return {
				value: this.getStream(streamImcrement)
			}
		}
	}
}