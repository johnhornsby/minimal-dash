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
		return Math.floor(time / this._fragmentDuration);
	}

	getCachedFragment(index) { return this._getFragmentWithStatus(index) }

	getLoadingFragment(index) { return this._getFragmentWithStatus(index, Fragment.status.LOADING ) }







	/*____________________________________________

	Private
	_____________________________________________*/

	_parse(string) {
		const parser = new DOMParser();
		const xml = parser.parseFromString(string, 'text/xml').documentElement;

		let segmentNode = xml.querySelector('SegmentTemplate');

		this._fragmentDuration = parseInt(segmentNode.getAttribute('duration')) / parseInt(segmentNode.getAttribute('timescale'));
		this._initialization = segmentNode.getAttribute('initialization');
		this._media = segmentNode.getAttribute('media');
		this._startNumber = parseInt(segmentNode.getAttribute('startNumber'));
		this._timescale = parseInt(segmentNode.getAttribute('timescale'));

		segmentNode = xml.querySelector('AdaptationSet');

		this._mimeType = segmentNode.getAttribute('mimeType');

		const durationString = xml.getAttribute('mediaPresentationDuration');

		// https://stackoverflow.com/questions/14934089/convert-iso-8601-duration-with-javascript
		const iso8601DurationRegex = /(-)?P(?:([\.,\d]+)Y)?(?:([\.,\d]+)M)?(?:([\.,\d]+)W)?(?:([\.,\d]+)D)?T(?:([\.,\d]+)H)?(?:([\.,\d]+)M)?(?:([\.,\d]+)S)?/;

		const matches = durationString.match(iso8601DurationRegex);

		let seconds = matches[8] === undefined ? 0 : matches[8];
		let minutes = matches[7] === undefined ? 0 : matches[7];
		let hours = matches[6] === undefined ? 0 : matches[6];

		this._duration = (parseInt(hours) * 60 * 60) + (parseInt(minutes) * 60) + parseInt(seconds);
		this._numberOfFragments = Math.ceil(this._duration / this._fragmentDuration);

		this._streams = Array.from(xml.querySelectorAll('Representation')).map((node, index) => {

			return new Stream({
				bandwidth: node.getAttribute('bandwidth'),
				codecs: node.getAttribute('codecs') || segmentNode.getAttribute('codecs'),
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
				index: index,
				manifest: this
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
	

	_getFragmentWithStatus(index, status = Fragment.status.LOADED) {
		let fragment;

		const cachedStream = this._streams.find((stream, streamIndex) => {
			fragment = stream.getFragment(index);

			if (!fragment) {
				debugger;
			}

			return fragment.status === status;
		});

		if (cachedStream) {
			return cachedStream.getFragment(index);
		} else {
			return null;
		}
	}
}