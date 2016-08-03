import Fragment from './fragment';


export default class Stream {


	_bandwidth = null;

	_height = null;

	_id = null;    

	_width = null;

	_initialization = null;    

	_duration = null;

	_numberOfFragments = null;

	_startNumber = 0;

	_fragments = null;


	constructor(data) {

		this._init(data);
	}






	/*____________________________________________

	Public
	_____________________________________________*/

	get initialization() { return this._initialization }

	get bufferType() { return this._bufferType }

	get bandwidth() { return this._bandwidth }

	get numberOfFragment() { return this._numberOfFragments }

	getFragment(index) { return this._fragments[index] }

	cacheFragmentBytes(arrayBuffer, fragmentIndex) {
		this.getFragment[fragmentIndex].bytes = arrayBuffer;
	}





	/*____________________________________________

	Private
	_____________________________________________*/

	_init(data) {
		this._bandwidth = data.bandwidth;
		this._bufferType = `${data.mimeType}; codecs="${data.codecs}"`;
		this._initialization = data.initialization.replace("$RepresentationID$", data.id);
		this._numberOfFragments = data.numberOfFragments;
		this._startNumber = parseInt(data.startNumber);
		this._duration = data.duration;
		this._media = data.media;

		this._fragments = [];

		let increment = 0;

		while(increment < this._numberOfFragments) {
			let url = this._media.replace("$RepresentationID$", data.id);
			url = url.replace("$Number$", increment + this._startNumber);

			this._fragments.push(new Fragment(increment, url));

			increment++;
		}
	}
}
