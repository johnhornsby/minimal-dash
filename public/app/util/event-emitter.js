export default class EventEmitter {
  
	_listeners = null;


	constructor() {
		this._listeners = {};
	}




	/*_______________________________________________

	Public
	_______________________________________________*/

	addEventListener(type, callback) {
		if(!(type in this._listeners)) {
			this._listeners[type] = [];
		}

		this._listeners[type].push(callback);
	}


	removeEventListener(type, callback) {
		if(!(type in this._listeners)) {
			return;
		}

		const stack = this._listeners[type];

		for(let i = 0, l = stack.length; i < l; i++) {
			if(stack[i] === callback){
				stack.splice(i, 1);
				return this.removeEventListener(type, callback);
			}
		}
	}


	dispatchEvent(event){
		if (typeof(event) == 'string') {
			event = {
				type: event
			}
		}

		const args = Array.from(arguments).slice(1);

		if(!(event.type in this._listeners)) {
			return;
		}

		const stack = this._listeners[event.type];
		event.target = this;

		for(let i = 0, l = stack.length; i < l; i++) {
			stack[i].call(this, event, ...args);
		}
	}
}