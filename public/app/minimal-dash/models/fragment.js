import Manifest from './manifest';

export default class Fragment {


	static status = {
		EMPTY: 'empty',
		LOADING: 'loading',
		LOADED: 'loaded'
	}


	_index = null;

	_url = null;

	_bytes = null;

	_size = null;

	_status = Fragment.status.EMPTY;

	_isLast = false;

	_isInit = false;

	_streamIndex = null;

	_stream = null;

	_loadData = null;


	constructor(index, url, streamIndex, stream, isLast = false) {
		this._index = index;
		this._url = url;
		this._isLast = isLast;
		this._isInit = index === -1;
		this._streamIndex = streamIndex;
		this._stream = stream;
	}





	/*____________________________________________

	Public
	_____________________________________________*/

	set bytes(arrayBuffer) {
		this._bytes = arrayBuffer;
		this._size = arrayBuffer.length;
		this._status = Fragment.status.LOADED;

		if (this._isInit) {
			this._stream.isInitialised = true;
		}
	}


	get bytes() {
		return this._bytes;
	}


	get size() {
		return this._size;
	}


	get status() {
		return this._status;
	}


	get url() {
		return this._url;
	}


	get isInit() {
		return this._isInit;
	}


	get isLast() {
		return this._isLast;
	}


	get streamIndex() {
		return this._streamIndex;
	}


	get stream() {
		return this._stream;
	}

	get index() {
		return this._index;
	}

	set loadData(data) {
		this._loadData = data;
	}

	get loadData() {
		return this._loadData;
	}

	isLoading() {
		if (this._status !== Fragment.status.EMPTY) {
			throw Error('Fragment is not empty :' + this._url);
		}
		this._status = Fragment.status.LOADING;
	}


	destroy() {
		this._bytes = null;
		this._size = 0;
	}
}