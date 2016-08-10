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

	_initFragment = null;

	_isInitialised = false;

	_index = null;

	_currentFragmentIncrement = 0;

	_hasBeenAppended = false;


	constructor(data) {

		this._init(data);
	}






	/*____________________________________________

	Public
	_____________________________________________*/

	[Symbol.iterator]() { return this; }

	next() { return this._next(); }

	get initialization() { return this._initialization }

	get bufferType() { return this._bufferType }

	get bandwidth() { return this._bandwidth }

	get numberOfFragment() { return this._numberOfFragments }

	get duration() { return this._duration }

	get isInitialised() { return this._isInitialised }

	set isInitialised(bool) { this._isInitialised = bool }

	get index() { return this._index }

	set hasBeenAppendded(bool) { this._hasBeenAppended = bool }

	get hasBeenAppendded() { return this._hasBeenAppended }

	getFragment(index) { return this._fragments[index] }

	getFragmentInit() { return this._initFragment }






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
		this._index = data.index;

		this._fragments = [];

		let increment = 0;
		let isLast = false;

		while(increment < this._numberOfFragments) {
			let url = this._media.replace("$RepresentationID$", data.id);
			url = url.replace("$Number$", increment + this._startNumber);

			isLast = (increment === this._numberOfFragments - 1);

			this._fragments.push(new Fragment(increment, url,  this._index, this, isLast));

			increment++;
		}

		this._initFragment = new Fragment(-1, this._initialization, this._index, this, false);
	}


	_next() {
		
		let fragmentIncrement = this._currentFragmentIncrement;

		this._currentFragmentIncrement += 1;

		let done = this._currentFragmentIncrement  > this._fragments.length;

		if (done) {
			this._currentFragmentIncrement = 0;
			return {done}

		} else {
			return {
				value: this.getFragment(fragmentIncrement)
			}
		}
	}
}
