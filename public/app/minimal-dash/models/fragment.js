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


	constructor(index, url) {
		this._index = index;
		this._url = url;
	}





	/*____________________________________________

	Public
	_____________________________________________*/

	set bytes(arrayBuffer) {
		this._bytes = arrayBuffer;
		this._size = arrayBuffer.length;
		this._status = Fragment.status.LOADED;
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