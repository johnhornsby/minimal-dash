(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 12);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__manifest__ = __webpack_require__(4);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Fragment = function () {
	function Fragment(index, url, streamIndex, stream) {
		var isLast = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

		_classCallCheck(this, Fragment);

		this._index = null;
		this._url = null;
		this._bytes = null;
		this._size = null;
		this._status = Fragment.status.EMPTY;
		this._isLast = false;
		this._isInit = false;
		this._streamIndex = null;
		this._stream = null;
		this._loadData = null;
		this._loadAttempts = 0;

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

	_createClass(Fragment, [{
		key: 'isLoading',
		value: function isLoading() {
			var _isLoading = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			if (_isLoading) {
				if (this._status !== Fragment.status.EMPTY) {
					throw Error('Fragment is not empty :' + this._url);
				}
				this._status = Fragment.status.LOADING;

				this._loadAttempts++;
			} else {
				this._status = Fragment.status.EMPTY;
			}
		}
	}, {
		key: 'destroy',
		value: function destroy() {
			this._bytes = null;
			this._size = 0;
		}
	}, {
		key: 'bytes',
		set: function set(arrayBuffer) {
			this._bytes = arrayBuffer;
			this._size = arrayBuffer.length;
			this._status = Fragment.status.LOADED;

			if (this._isInit) {
				this._stream.isInitialised = true;
			}
		},
		get: function get() {
			return this._bytes;
		}
	}, {
		key: 'size',
		get: function get() {
			return this._size;
		}
	}, {
		key: 'status',
		get: function get() {
			return this._status;
		}
	}, {
		key: 'url',
		get: function get() {
			return this._url;
		}
	}, {
		key: 'isInit',
		get: function get() {
			return this._isInit;
		}
	}, {
		key: 'isLast',
		get: function get() {
			return this._isLast;
		}
	}, {
		key: 'streamIndex',
		get: function get() {
			return this._streamIndex;
		}
	}, {
		key: 'stream',
		get: function get() {
			return this._stream;
		}
	}, {
		key: 'index',
		get: function get() {
			return this._index;
		}
	}, {
		key: 'loadData',
		set: function set(data) {
			this._loadData = data;
		},
		get: function get() {
			return this._loadData;
		}
	}, {
		key: 'loadAttempts',
		get: function get() {
			return this._loadAttempts;
		}
	}]);

	return Fragment;
}();

Fragment.status = {
	EMPTY: 'empty',
	LOADING: 'loading',
	LOADED: 'loaded'
};
/* harmony default export */ __webpack_exports__["a"] = Fragment;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * EventEmitter v5.1.0 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function (exports) {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    function isValidListener (listener) {
        if (typeof listener === 'function' || listener instanceof RegExp) {
            return true
        } else if (listener && typeof listener === 'object') {
            return isValidListener(listener.listener)
        } else {
            return false
        }
    }

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        if (!isValidListener(listener)) {
            throw new TypeError('listener must be a function');
        }

        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listenersMap = this.getListenersAsObject(evt);
        var listeners;
        var listener;
        var i;
        var key;
        var response;

        for (key in listenersMap) {
            if (listenersMap.hasOwnProperty(key)) {
                listeners = listenersMap[key].slice(0);

                for (i = 0; i < listeners.length; i++) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
            return EventEmitter;
        }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}(this || {}));


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__load__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_stats__ = __webpack_require__(11);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Bandwidth manager is used to calculate the bandwidth, its advised when a transfer
 * starts and stops and how much data is transfered. Bandwidth manager then retains 
 * the data and provides asumptions on bandwdth.
 */




var MEASURE_VALID_READINGS = 10; // bandwidth readings

var INITIAL_BANDWIDTH = 500000; // 0.5 mb / s

var CLIP_TOLERANCE = 0.95; // value between 0 and 1

var CACHED_THRESHHOLD = 32; // ms loading within threshold to determine a cached fragment. 


var singleton = Symbol();
var singletonEnforcer = Symbol();

var BandwidthManager = function () {
	_createClass(BandwidthManager, null, [{
		key: 'instance',
		get: function get() {
			if (!this[singleton]) {
				this[singleton] = new BandwidthManager(singletonEnforcer);

				this[singleton]._init();
			}

			return this[singleton];
		}
	}]);

	function BandwidthManager(enforcer) {
		_classCallCheck(this, BandwidthManager);

		this._history = null;

		if (enforcer != singletonEnforcer) throw new Error("Cannot construct singleton");
	}

	/*____________________________________________
 	Public
 _____________________________________________*/

	_createClass(BandwidthManager, [{
		key: 'start',
		value: function start(fragment, debug) {
			this._start(fragment, debug);
		}
	}, {
		key: 'stop',
		value: function stop(fragment, bytes, isCached, debug) {
			this._stop(fragment, bytes, isCached, debug);
		}
	}, {
		key: 'stopOnError',
		value: function stopOnError(fragment) {
			this._stopOnError(fragment);
		}
	}, {
		key: 'getQuality',
		value: function getQuality(manifest) {
			return this._getQuality(manifest);
		}

		/*____________________________________________
  	Private 
  _____________________________________________*/

	}, {
		key: '_init',
		value: function _init() {
			this._history = [];
		}

		/**
   * Called when a transfered is initiated
   * 
   * @param {Object} Fragment Model
   */

	}, {
		key: '_start',
		value: function _start(fragment) {
			var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var identifier = fragment.url;

			var _getBandwidth2 = this._getBandwidth(),
			    bandwidth = _getBandwidth2.bandwidth,
			    range = _getBandwidth2.range;

			this._history.push({
				identifier: identifier,
				start: new Date().getTime(),
				type: fragment.isInit ? 'init' : 'media',
				range: range,
				estimatedBandwidth: bandwidth
			});

			if (debug) console.log('_start fragment ' + fragment.url);
		}

		/**
   * Called when a transfered has completed
   * 
   * @param {Object} Fragment Model
   * @param {ArrayBuffer} bytes the data
   */

	}, {
		key: '_stop',
		value: function _stop(fragment, bytes) {
			var isCached = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
			var debug = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

			var identifier = fragment.url;

			var historyData = this._findIndetifier(identifier);
			if (historyData) {
				historyData.end = new Date().getTime();
				historyData.bytes = bytes;
				historyData.time = Math.max(historyData.end - historyData.start, 0);
				historyData.isCached = isCached;

				if (isCached) {
					historyData.time = 0;
				}

				historyData.bandwidth = 1000 / historyData.time * bytes * 8; // in bits / second

				if (isFinite(historyData.bandwidth) === false) {
					historyData.bandwidth = null;
				}
			}

			if (debug) console.log('_stop fragment ' + fragment.url + ' load time: ' + historyData.time + ' mbps: ' + historyData.bandwidth / 1024 / 1024);

			fragment.loadData = historyData;
		}
	}, {
		key: '_stopOnError',
		value: function _stopOnError(fragment) {
			var index = this._history.findIndex(function (data) {
				return data.identifier === fragment.url;
			});

			if (index) {
				this._history = this._history.splice(index, 1);
			}
		}
	}, {
		key: '_findIndetifier',
		value: function _findIndetifier(identifier) {
			return this._history.find(function (data) {
				return data.identifier === identifier;
			});
		}
	}, {
		key: '_getDefaultBandwidth',
		value: function _getDefaultBandwidth() {
			var initialBandwidth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : INITIAL_BANDWIDTH;

			return {
				bandwidth: initialBandwidth,
				range: {
					start: initialBandwidth,
					end: initialBandwidth,
					set: [initialBandwidth],
					all: [initialBandwidth]
				}
			};
		}
	}, {
		key: '_getBandwidth',
		value: function _getBandwidth() {
			if (this._history.length > 0) {

				var now = new Date().getTime();

				// use only media fragments
				var bandwidths = this._history.filter(function (history) {
					return history.type === 'media' && history.bandwidth !== null;
				});

				// only use history measurements within MEASURE_VALID_READINGS, that are not cached and witin MEASURE_VALID_READINGS
				var slots = 10;
				bandwidths = bandwidths.reduceRight(function (filteredBandwidths, nextBandwidth) {
					if (nextBandwidth.isCached !== true && slots > 0 && nextBandwidth.end) {
						filteredBandwidths.unshift(nextBandwidth);

						slots--;
					}

					return filteredBandwidths;
				}, []);

				if (bandwidths.length > 0) {

					bandwidths = bandwidths.map(function (history) {
						return history.bandwidth;
					});

					// take all but the obvious spikes
					var clippedBandwidth = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__util_stats__["a" /* removeSpikes */])(bandwidths, CLIP_TOLERANCE);

					// choose an appropriate bandwidth from the clipped array
					var bandwidth = this._selectBandwidth(clippedBandwidth);

					// set bandwidth into localStorage
					if (!isNaN(bandwidth) && isFinite(bandwidth)) {
						window.localStorage.bandwidth = parseInt(bandwidth);
					}

					return {
						bandwidth: bandwidth,
						range: {
							start: clippedBandwidth[0],
							end: clippedBandwidth[clippedBandwidth.length - 1],
							set: clippedBandwidth,
							all: bandwidths
						}
					};
				}
			}

			if (window.localStorage.bandwidth) {
				return this._getDefaultBandwidth(window.localStorage.bandwidth);
			} else {
				return this._getDefaultBandwidth();
			}
		}
	}, {
		key: '_selectBandwidth',
		value: function _selectBandwidth(bandwidths) {
			// used to take mean or median here, however lets be a little more pesimistic and ensure a lower value
			// use the value that is 25% between the min and max
			return bandwidths[0] + (bandwidths[bandwidths.length - 1] - bandwidths[0]) * 0.25;
		}
	}, {
		key: '_getQuality',
		value: function _getQuality(manifest) {
			var _getBandwidth3 = this._getBandwidth(),
			    bandwidth = _getBandwidth3.bandwidth,
			    range = _getBandwidth3.range;

			var increment = 0;
			var streamIndex = manifest.numberOfStreams - 1; // initially set to minimum

			// iterate through streams and determine the stream that is just under the bandwidth 

			var highestValidBandwidth = 0;

			while (increment < manifest.numberOfStreams) {

				var streamData = {
					bandwidth: parseInt(manifest.getStream(increment).bandwidth),
					index: increment
				};

				if (streamData.bandwidth < bandwidth && streamData.bandwidth > highestValidBandwidth) {
					highestValidBandwidth = streamData.bandwidth;
					streamIndex = increment;
				}

				increment++;
			}

			return streamIndex;
		}
	}]);

	return BandwidthManager;
}();

/* harmony default export */ __webpack_exports__["a"] = BandwidthManager.instance;

/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__util_fetch_xhr2__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_manifest__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__bandwidth__ = __webpack_require__(2);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var singleton = Symbol();
var singletonEnforcer = Symbol();

var LoadManager = function (_EventEmitter) {
	_inherits(LoadManager, _EventEmitter);

	_createClass(LoadManager, null, [{
		key: 'instance',
		get: function get() {
			if (!this[singleton]) {
				this[singleton] = new LoadManager(singletonEnforcer);

				this[singleton]._initLoadManager();
			}

			return this[singleton];
		}

		// {Map} record of all loaded Manifest data models


		// {String} the root url from which to compose all Fragemnt relative links


		// unique reference to workers

	}]);

	function LoadManager(enforcer) {
		_classCallCheck(this, LoadManager);

		var _this = _possibleConstructorReturn(this, (LoadManager.__proto__ || Object.getPrototypeOf(LoadManager)).call(this));

		_this._manifests = null;
		_this._root = "";
		_this._workersSet = new Set();


		if (enforcer != singletonEnforcer) throw new Error("Cannot construct singleton");
		return _this;
	}

	/*____________________________________________
 	Public
 _____________________________________________*/

	/**
  * Async Methd to aquire a Manifest Data Model
  *
  * @public
  * @param {String} manifestURL The url of the manifest file
  * @returns {Promise} The promise returing the Manifest Data Model
  */


	_createClass(LoadManager, [{
		key: 'getManifest',
		value: function getManifest(manifestURL, debug) {
			return this._getManifest(manifestURL, debug);
		}

		/**
   * Async Methd to aquire the data for s Fragment Data Model
   *
   * @public
   * @param {Object} fragment The empty Fragment Data Model
   * @returns {Promise} The promise returing the Fragment Data Model now containing the data
   */

	}, {
		key: 'getData',
		value: function getData(fragment, debug) {
			return this._getData(fragment, debug);
		}

		/*____________________________________________
  	Private
  _____________________________________________*/

		/**
   * Initialisation
   *
   * @private
   */

	}, {
		key: '_initLoadManager',
		value: function _initLoadManager() {
			this._manifests = new Map();
		}

		/**
   * Create Worker Script
   *
   * @param {Boolean} debug
   * @param {String}
   * @private
   */

	}, {
		key: '_getWorkerScript',
		value: function _getWorkerScript() {
			var debug = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

			// worker script used to load images
			return '\n\n\t\tvar STATUS_LOADED = \'' + LoadManager.STATUS_LOADED + '\';\n\t\tvar STATUS_ERROR = \'' + LoadManager.STATUS_ERROR + '\';\n\t\tvar STATUS_TIMEOUT = \'' + LoadManager.STATUS_TIMEOUT + '\';\n\t\tvar STATUS_ABORT = \'' + LoadManager.STATUS_ABORT + '\';\n\t\t\n\t\tvar XHR_TIMEOUT = ' + LoadManager.XHR_TIMEOUT + ';\n\n\t\tself.xhr = null;\n\t\tself.url = \'\';\n\t\tself.type = \'\';\n\t\tself.timeoutId = null;\n\t\tself.requestDate = null;\n\t\tself.isCached = false;\n\t\tself.accessibleDateInHeader = false;\n\t\tself.completionStatus = null;\n\t\tself.debug = ' + debug + '\n\n\t\tself.onLoad = function(event) {\n\t\t\tself.completionStatus = STATUS_LOADED;\n\t\t\tvar dateString;\n\n\t\t\tif (xhr.getAllResponseHeaders().indexOf(\'date: \') > -1) {\n\t\t\t\tdateString = xhr.getResponseHeader(\'Date\');\n\t\t\t}\n\t\t\t\n\t\t\tif (dateString != null) {\n\t\t\t\tvar repsonseDate = new Date(dateString);\n\t\t\t\tself.isCached = repsonseDate.getTime() < self.requestDate.getTime();\n\t\t\t\tself.accessibleDateInHeader = true;\n\t\t\t}\n\n\t\t\tif (self.debug) console.log(self + \' worker.onLoad \' + self.url + \' cached:\' + self.isCached);\n\t\t\tself.initNotificationBeacon();\n\t\t}\n\n\t\tself.onabort = function() {\n\t\t\tself.completionStatus = STATUS_ABORT;\n\t\t\tif (self.debug) console.error(self + \' abort \' + self.url);\n\t\t\tself.initNotificationBeacon();\n\t\t}\n\n\t\tself.onerror = function(event) {\n\t\t\tself.completionStatus = STATUS_ERROR;\n\t\t\tif (self.debug) console.error(self + \' error \' + self.url);\n\t\t\tself.initNotificationBeacon();\n\t\t}\n\n\t\tself.ontimeout = function() {\n\t\t\tself.completionStatus = STATUS_TIMEOUT;\n\t\t\tif (self.debug) console.error(self + \' timeout \' + self.url);\n\t\t\tself.initNotificationBeacon();\n\t\t}\n\n\t\t// net::ERR_INTERNET_DISCONNECTED\n\t\tself.onreadystatechange = function(event) {\n\t\t\tif (self.debug) console.log(self + \' onreadystatechange \' + self.url + \' readyState:\' + self.xhr.readyState + \' status:\' + self.xhr.status);\n\t\t\t\n\t\t\t// check for timeout error here, as we are not using timeout event\n\t\t\tif (xhr.readyState === 4 && xhr.status !== 200) {\n\t\t\t\tvar errorDate = new Date();\n\t\t\t\tvar loadSeconds = (errorDate.getTime() - self.requestDate.getTime()) / 1000;\t\t\t\t\n\t\t\t\tif (loadSeconds * 100 > 99 && loadSeconds * 100 < 101) {\n\t\t\t\t\tself.ontimeout();\n\t\t\t\t} else {\n\t\t\t\t\tself.onerror();\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\n\t\tself.initNotificationBeacon = function() {\n\t\t\tself.clearNotificationBeacon();\n\t\t\tself.postMessage({\'status\':self.completionStatus, \'isCached\':self.isCached, \'accessibleDateInHeader\':self.accessibleDateInHeader});\n\n\t\t\tself.timeoutId = self.setTimeout(self.initNotificationBeacon, 1000);\n\t\t}\n\n\t\tself.clearNotificationBeacon = function() {\n\t\t\tif (self.timeoutId > 1) {\n\t\t\t\tvar str = \'clearNotificationBeacon()\' + self.url + \' \' + self.timeoutId\n\t\t\t\tif (self.debug) console.log(str);\n\t\t\t}\n\t\t\tself.clearTimeout(self.timeoutId);\n\t\t}\n\n\t\tself.initLoad = function(url, type) {\n\t\t\tself.requestDate = new Date();\n\t\t\tself.url = url;\n\t\t\tself.type = type;\n\t\t\tself.xhr = new XMLHttpRequest();\n\t\t\tself.xhr.timeout = XHR_TIMEOUT;\n\t\t\tself.xhr.onload = self.onLoad;\n\t\t\tself.xhr.onerror = self.onerror;\n\t\t\tself.xhr.onabort = self.onabort;\n\t\t\tself.xhr.onreadystatechange = self.onreadystatechange;\n\t\t\tself.xhr.open(\'GET\', url, true);\n\t\t\tself.xhr.responseType = type; // IE11 must be asigned after open \n\t\t\tself.xhr.send();\n\t\t}\n\n\t\tself.retrieveResponse = function() {\n\t\t\tswitch(self.type) {\n\t\t\tcase \'arraybuffer\':\n\t\t\t\tself.postMessage(self.xhr.response, [self.xhr.response]);\n\t\t\t\tbreak;\n\t\t\tcase \'text\':\n\t\t\t\tself.postMessage(self.xhr.response);\n\t\t\t\tbreak;\n\t\t\t}\n\n\t\t\tself.destroy();\n\t\t\tif (self.debug) console.log(self + \' worker.retrieveResponse \' + self.url);\n\t\t}\n\n\t\tself.destroy = function() {\n\t\t\tself.clearNotificationBeacon();\n\t\t\tself.close();\n\t\t}\n\n\t\tself.addEventListener(\'message\', function(event) {\n\t\t\tif (event.data.action) {\n\t\t\t\tif (event.data.action === \'retrieve\') {\n\t\t\t\t\tself.retrieveResponse();\n\t\t\t\t} else if (event.data.action === \'destroy\') {\n\t\t\t\t\tself.destroy();\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (event.data.url && event.data.url !== \'\') {\n\t\t\t\tself.initLoad(event.data.url, event.data.type);\n\t\t\t}\n\t\t}, false);';
		}

		/**
   * Method loads a manifest file, the instantiates the Manifest data nodel and stores it within a Map,
   * the wrapping promise is then resolved. If the manifest has already been loaded then this is 
   * resolved immediately.
   *
   * @private
   * @param {String} manifestURL the url of the manifest file
   * @returns {Promise}
   */

	}, {
		key: '_getManifest',
		value: function _getManifest(manifestURL) {
			var _this2 = this;

			var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			if (this._manifests.has(manifestURL) === false) {

				return new Promise(function (resolve, reject) {
					var workerScript = _this2._getWorkerScript(debug);
					var blob = new Blob([workerScript]);
					var worker = new Worker(window.URL.createObjectURL(blob));

					_this2._workersSet.add(worker);

					worker.addEventListener('message', function (event) {
						if (event.data.constructor === Object && event.data.status) {

							switch (event.data.status) {
								case LoadManager.STATUS_LOADED:
									worker.postMessage({ action: 'retrieve' });
									break;
								default:
									worker.postMessage({ action: 'destroy' });
							}
						} else {
							var manifest = new __WEBPACK_IMPORTED_MODULE_2__models_manifest__["a" /* default */](manifestURL, event.data);
							_this2._manifests.set(manifestURL, manifest);

							_this2._removeWorker(worker);

							resolve(manifest);
						}
					}, false);
					worker.addEventListener('error', _this2._onError, false);
					worker.postMessage({ url: manifestURL, type: 'text' });
				});
			} else {
				return Promise.resolve(this._manifests.get(manifestURL));
			}
		}

		/**
   * Method loads the data for the Fragment, then when aquired appends the data and resolves the Fragment,
   * we also here prompt the BandwidthManager to track the start and stop of the load metrics.
   *
   * @private
   * @param {Object} fragment The empty Fragment Data Model
   * @returns {Promise} The promise returing the Fragment Data Model now containing the data
   */

	}, {
		key: '_getData',
		value: function _getData(fragment) {
			var _this3 = this;

			var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

			var url = fragment.stream.manifest.url;
			url = url.split("/").splice(0, url.match(/\//g).length).join("/") + "/";
			url += fragment.url;

			fragment.isLoading();
			__WEBPACK_IMPORTED_MODULE_3__bandwidth__["a" /* default */].start(fragment, debug);

			return new Promise(function (resolve, reject) {

				// WORKER
				var workerScript = _this3._getWorkerScript(debug);
				var blob = new Blob([workerScript]);
				var worker = new Worker(window.URL.createObjectURL(blob));
				var isCached = false;

				_this3._workersSet.add(worker);

				worker.addEventListener('message', function (event) {

					if (debug) console.log('worker message received ' + url + ' data.status:' + event.data.status);

					if (event.data.constructor === Object && event.data.status) {

						switch (event.data.status) {
							case LoadManager.STATUS_LOADED:
								isCached = event.data.isCached;
								worker.postMessage({ action: 'retrieve' });
								break;
							default:
								worker.postMessage({ action: 'destroy' });

								fragment.isLoading(false);
								__WEBPACK_IMPORTED_MODULE_3__bandwidth__["a" /* default */].stopOnError(fragment);

								_this3._removeWorker(worker);
								resolve(fragment);
						}
					} else {
						var arraybuffer = new Uint8Array(event.data);
						__WEBPACK_IMPORTED_MODULE_3__bandwidth__["a" /* default */].stop(fragment, arraybuffer.length, isCached, debug);
						fragment.bytes = arraybuffer;

						_this3._removeWorker(worker);

						resolve(fragment);
					}
				}, false);
				worker.addEventListener('error', _this3._onError, false);
				worker.postMessage({ url: url, type: 'arraybuffer' });

				// NON WORKER
				// onload = function () {
				// 	const arraybuffer = new Uint8Array(xhr.response);
				// 	BandwidthManager.stop(fragment, arraybuffer.length);
				// 	fragment.bytes = arraybuffer;

				// 	resolve(fragment);


				// 	console.log(this + ' load ' + url);
				// };

				// var xhr = new XMLHttpRequest();
				// xhr.responseType = 'arraybuffer';
				// xhr.onload = onload;
				// xhr.open('GET', url, true);
				// xhr.send();
			});
		}

		/**
   * Method tries to delete worker from worker Set
   *
   * @private
   * @param {Worker} worker
   */

	}, {
		key: '_removeWorker',
		value: function _removeWorker(worker) {
			if (this._workersSet.has(worker)) {
				this._workersSet.delete(worker);
			} else {
				//reject("Can't delete worker");
			}
		}

		/**
   * Generic Error handler for the promises
   *
   * @prviate
   */

	}, {
		key: '_onError',
		value: function _onError(errorObject) {
			throw errorObject;
		}
	}]);

	return LoadManager;
}(__WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter___default.a);

LoadManager.STATUS_LOADED = 'loaded';
LoadManager.STATUS_ERROR = 'error';
LoadManager.STATUS_TIMEOUT = 'timeout';
LoadManager.STATUS_ABORT = 'abort';
LoadManager.XHR_TIMEOUT = 10000;


/* harmony default export */ __webpack_exports__["a"] = LoadManager.instance;

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stream__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__fragment__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }




var Manifest = function () {
	function Manifest(url, manifestString) {
		_classCallCheck(this, Manifest);

		this._duration = 0;
		this._url = "";
		this._streams = null;
		this._numberOfFragments = 0;
		this._fragmentDuration = 0;
		this._timescale = 0;
		this._mimeType = "";
		this._initialization = "";
		this._media = "";
		this._minBufferTime = 0;
		this._startNumber = 0;
		this._currentStreamIncrement = 0;


		this._url = url;

		this._parse(manifestString);
	}

	/*____________________________________________
 	Public
 _____________________________________________*/

	_createClass(Manifest, [{
		key: Symbol.iterator,
		value: function value() {
			return this;
		}
	}, {
		key: 'next',
		value: function next() {
			return this._next();
		}
	}, {
		key: 'getStream',
		value: function getStream(index) {
			return this._streams[index];
		}
	}, {
		key: 'getFragment',
		value: function getFragment(streamIndex, fragmentIndex) {
			return this._streams[streamIndex].getFragment(fragmentIndex);
		}
	}, {
		key: 'cacheFragmentBytes',
		value: function cacheFragmentBytes(arrayBuffer, streamIndex, fragmentIndex) {
			this._streams[streamIndex].cacheFragmentBytes(arrayBuffer, fragmentIndex);
		}
	}, {
		key: 'getFragmentIndex',
		value: function getFragmentIndex(time) {
			return Math.floor(time / this._fragmentDuration);
		}
	}, {
		key: 'getLoadedFragment',
		value: function getLoadedFragment(index) {
			return this._getFragmentWithStatus(index);
		}
	}, {
		key: 'getLoadingFragment',
		value: function getLoadingFragment(index) {
			return this._getFragmentWithStatus(index, __WEBPACK_IMPORTED_MODULE_1__fragment__["a" /* default */].status.LOADING);
		}

		/*____________________________________________
  	Private
  _____________________________________________*/

	}, {
		key: '_parse',
		value: function _parse(string) {
			var _this = this;

			var parser = new DOMParser();
			var xml = parser.parseFromString(string, 'text/xml').documentElement;

			var segmentNode = xml.querySelector('SegmentTemplate');

			this._fragmentDuration = parseInt(segmentNode.getAttribute('duration')) / parseInt(segmentNode.getAttribute('timescale'));
			this._initialization = segmentNode.getAttribute('initialization');
			this._media = segmentNode.getAttribute('media');
			this._startNumber = parseInt(segmentNode.getAttribute('startNumber'));
			this._timescale = parseInt(segmentNode.getAttribute('timescale'));

			segmentNode = xml.querySelector('AdaptationSet');

			this._mimeType = segmentNode.getAttribute('mimeType');

			var durationString = xml.getAttribute('mediaPresentationDuration');

			// https://stackoverflow.com/questions/14934089/convert-iso-8601-duration-with-javascript
			var iso8601DurationRegex = /(-)?P(?:([\.,\d]+)Y)?(?:([\.,\d]+)M)?(?:([\.,\d]+)W)?(?:([\.,\d]+)D)?T(?:([\.,\d]+)H)?(?:([\.,\d]+)M)?(?:([\.,\d]+)S)?/;

			var matches = durationString.match(iso8601DurationRegex);

			var seconds = matches[8] === undefined ? 0 : matches[8];
			var minutes = matches[7] === undefined ? 0 : matches[7];
			var hours = matches[6] === undefined ? 0 : matches[6];

			this._duration = parseInt(hours) * 60 * 60 + parseInt(minutes) * 60 + parseInt(seconds);
			this._numberOfFragments = Math.ceil(this._duration / this._fragmentDuration);

			this._streams = Array.from(xml.querySelectorAll('Representation')).map(function (node, index) {

				return new __WEBPACK_IMPORTED_MODULE_0__stream__["a" /* default */]({
					bandwidth: node.getAttribute('bandwidth'),
					codecs: node.getAttribute('codecs') || segmentNode.getAttribute('codecs'),
					frameRate: node.getAttribute('frameRate'),
					height: node.getAttribute('height'),
					id: node.getAttribute('id'),
					scanType: node.getAttribute('scanType'),
					width: node.getAttribute('width'),
					initialization: _this._initialization,
					startNumber: _this._startNumber,
					media: _this._media,
					mimeType: _this._mimeType,
					duration: _this._duration,
					numberOfFragments: _this._numberOfFragments,
					index: index,
					manifest: _this
				});
			});
		}
	}, {
		key: '_next',
		value: function _next() {
			var streamImcrement = this._currentStreamIncrement;

			this._currentStreamIncrement += 1;

			var done = this._currentStreamIncrement > this._streams.length;

			if (done) {
				this._currentStreamIncrement = 0;
				return { done: done };
			} else {
				return {
					value: this.getStream(streamImcrement)
				};
			}
		}
	}, {
		key: '_getFragmentWithStatus',
		value: function _getFragmentWithStatus(index) {
			var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : __WEBPACK_IMPORTED_MODULE_1__fragment__["a" /* default */].status.LOADED;

			var fragment = void 0;

			var cachedStream = this._streams.find(function (stream, streamIndex) {
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
	}, {
		key: 'duration',
		get: function get() {
			return this._duration;
		}
	}, {
		key: 'url',
		get: function get() {
			return this._url;
		}
	}, {
		key: 'numberOfStreams',
		get: function get() {
			return this._streams.length;
		}
	}, {
		key: 'fragmentDuration',
		get: function get() {
			return this._fragmentDuration;
		}
	}, {
		key: 'numberOfFragments',
		get: function get() {
			return this._numberOfFragments;
		}
	}]);

	return Manifest;
}();

/* harmony default export */ __webpack_exports__["a"] = Manifest;

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__managers_load__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__controllers_video_element__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controllers_source__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__managers_bandwidth__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__util_event_emitter__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_fragment__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/** 
 * Main controller class for the Minimal Dash Player.
 */








var DEFAULT_OPTIONS = {
	initialStreamIndex: undefined,
	debug: false
};

var Player = function (_EventEmitter) {
	_inherits(Player, _EventEmitter);

	// current stream index


	// controllor the video's related MediaSource and SourceBuffer
	function Player(videoElement, manifestURL, options) {
		_classCallCheck(this, Player);

		var _this = _possibleConstructorReturn(this, (Player.__proto__ || Object.getPrototypeOf(Player)).call(this));

		_this._videoController = null;
		_this._sourceController = null;
		_this._manifest = null;
		_this._streamIndex = null;
		_this._options = {};


		_this._videoElement = videoElement;

		_this._options = options || DEFAULT_OPTIONS;

		_this._initPlayer(manifestURL);
		return _this;
	}

	/*_______________________________________________
 	Public
 _______________________________________________*/

	// @TODO
	// get autoplay() {}
	// set autoplay() {}


	/**
  * Getter of video currentTime currently used in debugging
  *
  * @public
  * @returns {Number} the video current time
  */


	// player options


	// mainifest data object


	// controller of the video element


	_createClass(Player, [{
		key: 'play',


		/**
   * Instruct the video element to play
   *
   * @public
   */
		value: function play() {
			this._videoController.play();
		}

		/**
   * Instruct the video element to pause
   *
   * @public
   */

	}, {
		key: 'pause',
		value: function pause() {
			this._videoController.pause();
		}

		/*_______________________________________________
  	Private
  _______________________________________________*/

		/**
   * Initalisation
   *
   * @param {String} manifestURL
   * @private
   */

	}, {
		key: '_initPlayer',
		value: function _initPlayer(manifestURL) {
			var _this2 = this;

			document.addEventListener('visibilitychange', function () {
				if (_this2._options.debug) console.log('Document is now ' + (document.hidden ? 'hidden' : 'visible'));

				if (!document.hidden) {
					_this2._onDocumentShow();
				}
			});

			this._bind();

			this._loadManifest(manifestURL);
		}

		/**
   * Bind all bound methods here for clarity
   *
   * @private
   */

	}, {
		key: '_bind',
		value: function _bind() {
			this._onTimeUpdate = this._onTimeUpdate.bind(this);
			this._onDocumentShow = this._onDocumentShow.bind(this);
		}

		/**
   * Called to load the manifest before we do anything else
   *
   * @param {String} url
   * @private
   */

	}, {
		key: '_loadManifest',
		value: function _loadManifest(url) {
			var _this3 = this;

			// Get the manifest file and then kickstart our checkVideoBuffer method
			__WEBPACK_IMPORTED_MODULE_0__managers_load__["a" /* default */].getManifest(url, this._options.debug).then(function (manifest) {
				_this3._manifest = manifest;

				_this3._onManifestReady();
			}).catch(this._onError);
		}

		/**
   * Called when manifest is ready and we can proceed with instantiation
   *
   * @private
   */

	}, {
		key: '_onManifestReady',
		value: function _onManifestReady() {
			var bufferMinLength = 10;
			// Create VideoController that will listen to the video element
			this._videoController = new __WEBPACK_IMPORTED_MODULE_1__controllers_video_element__["a" /* default */](this._videoElement, this._manifest, bufferMinLength, this._options.debug);
			this._videoController.on(__WEBPACK_IMPORTED_MODULE_1__controllers_video_element__["a" /* default */].EVENT_TIME_UPDATE, this._onTimeUpdate);

			// Create SourceController that controls the MediaSource
			this._sourceController = new __WEBPACK_IMPORTED_MODULE_2__controllers_source__["a" /* default */](this._videoController, this._options.debug);

			// For public use
			this.dispatchEvent(Player.EVENT_MANIFEST_LOADED, this._manifest);

			// Begin
			this._checkVideoBuffer();
		}

		/**
   * Called to check on the state of the video buffer. Load another fragment data if we need to. 
   * Method is repeated called to check upon the state from video time updates and the callbacks
   * from async promises.
   *
   * @private
   */

	}, {
		key: '_checkVideoBuffer',
		value: function _checkVideoBuffer() {
			// check video element buffer
			var _videoController$chec = this._videoController.checkBuffer(),
			    shouldGetData = _videoController$chec.shouldGetData,
			    bufferEmptyAtTime = _videoController$chec.bufferEmptyAtTime;

			if (this._options.debug) console.log('_checkVideoBuffer ' + 'shouldGetData:' + shouldGetData + ' bufferEmptyAtTime:' + bufferEmptyAtTime);

			if (shouldGetData) {
				this._checkCachedData(bufferEmptyAtTime);
			}
		}

		/**
   * The checkCached data method is repeated called via checkVideoBuffer upon video time updates
   * and any update to the state in the controllers. This method drives all the initialisation and
   * loading of data for the video.
   *
   * The main logic for the checkCachedData method is as follows
   *
   *  // if find one 
   *		// check init fragment is there
   *			// if current stream index matches fragment index 
   *				// append cached buffer
   *			// else 
   *				// switch streams
   *		// load fragment init
   *			// if current stream index matches fragment index 
   *				// append cached buffer
   *			// else 
   *				// switch streams
   *	// else
   *		// check init fragment is there
   *			// load fragment
   *				// if current stream index matches fragment index 
   *					// append cached buffer
   *				// else 
   *					// switch streams
   *		// else
   *			// load fragment and init
   *				// if current stream index matches fragment index 
   *					// append cached buffer
   *				// else 
   *					// switch streams
   *
   *
   * @private
   * @param {Number} bufferEmptyAtTime
   */

	}, {
		key: '_checkCachedData',
		value: function _checkCachedData(bufferEmptyAtTime) {
			var _this4 = this;

			var state = {};
			state.readyState = this._videoElement.readyState;

			var fragmentIndex = this._manifest.getFragmentIndex(bufferEmptyAtTime);
			state.fragmentIndex = fragmentIndex;

			// check through all streams to find any cached fragment
			var loadedFragment = this._manifest.getLoadedFragment(fragmentIndex);
			var stream = void 0;

			// is there a fragment in the cache
			if (loadedFragment) {
				state.fragment = loadedFragment.constructor;
				stream = loadedFragment.stream;
				state.stream = stream.constructor;
				// Do we have the init fragment for the stream
				if (stream.isInitialised) {

					state.streamIsInitialised = stream.isInitialised;

					// The SourceControler is currently intialised once, this involves opening a MediaSource
					// @TODO we need to check this is ok
					if (this._sourceController.isInitialised === false) {
						state.sourceIsInitialised = this._sourceController.isInitialised;
						this._sourceController.initialise(stream).then(function () {
							_this4._checkVideoBuffer();
						}).catch(this._onError);

						// Does the current SourceController quality match incoming loadedFragment stream quality,
						// if so then we can add the loadedFragment data to the buffer
					} else if (this._sourceController.quality === loadedFragment.stream.index) {
						state.quality = loadedFragment.stream.index;
						state.switchStreams = false;
						this._sourceController.appendToBuffer(loadedFragment).then(function () {
							if (_this4._options.debug) console.log('_checkCachedData COMPLETE');

							_this4._checkVideoBuffer();
						}).catch(this._onError);

						// If the Fragment quality is different to that of the SourceController then we'll,
						// switch streams first before appending the loadedFragment data
					} else {
						//console.log('APPEND DIFFERENT STREAM');
						state.switchStreams = true;
						Promise.resolve().then(function () {
							return _this4._sourceController.appendToBuffer(stream.getFragmentInit());
						}).then(function () {
							return _this4._sourceController.appendToBuffer(loadedFragment);
						}).then(function () {
							if (_this4._options.debug) console.log('_checkCachedData COMPLETE');

							_this4._checkVideoBuffer();
						}).catch(this._onError);
					}

					// The SourceController is not initialised we need do this first, then re check
				} else {
					state.streamIsInitialised = stream.isInitialised;
					__WEBPACK_IMPORTED_MODULE_0__managers_load__["a" /* default */].getData(stream.getFragmentInit(), this._options.debug).then(function (fragment) {
						return _this4._checkVideoBuffer();
					}) // now data has loaded re check cached data 
					.catch(this._onError);
				}

				// No Fragment data, we need to download before continuing
			} else {

				// There maybe no cached fragment but there may one one loading
				var loadingFragment = this._manifest.getLoadingFragment(fragmentIndex);

				state.loadingFragment = loadingFragment ? true : false;

				// Check that the fragment is not loading
				if (loadingFragment == null) {
					var streamIndex = __WEBPACK_IMPORTED_MODULE_3__managers_bandwidth__["a" /* default */].getQuality(this._manifest);

					// override quality of initial stream it set
					if (fragmentIndex === 0 && this._options.initialStreamIndex !== undefined) {
						streamIndex = this._options.initialStreamIndex;
					}

					stream = this._manifest.getStream(streamIndex);
					var fragment = stream.getFragment(fragmentIndex);

					if (fragment.loadAttempts > Player.MAX_LOAD_ATTEMPTS) {
						throw new Error('Unable to load Fragment ' + fragment.url);
					} else {
						state.fragmentStatus = fragment.status;
						if (fragment.status === __WEBPACK_IMPORTED_MODULE_5__models_fragment__["a" /* default */].status.EMPTY) {
							var getDataPromises = [__WEBPACK_IMPORTED_MODULE_0__managers_load__["a" /* default */].getData(fragment, this._options.debug)];

							if (stream.isInitialised === false) {
								getDataPromises.push(__WEBPACK_IMPORTED_MODULE_0__managers_load__["a" /* default */].getData(stream.getFragmentInit(), this._options.debug));
							}

							Promise.all(getDataPromises).then(function (fragments) {
								return _this4._checkVideoBuffer();
							}) // now data has loaded re check cached data 
							.catch(this._onError);
						} else {
							throw new Error('Stream is not empty');
						}
					}
				}
			}

			if (this._options.debug) console.log("_checkCachedData " + JSON.stringify(state));
		}

		/**
   * Event handler called from VideoController when the video time updates. Here we 
   * want to check the buffer.
   * 
   * @private
   */

	}, {
		key: '_onTimeUpdate',
		value: function _onTimeUpdate() {
			this._checkVideoBuffer();

			this.dispatchEvent(Player.EVENT_TIME_UPDATE, this._manifest);
		}
	}, {
		key: '_onDocumentShow',
		value: function _onDocumentShow() {
			if (this._manifest !== null) {
				this._checkVideoBuffer();
			}
		}

		/**
   * Generic Error handling method
   * 
   * @private
   * @param {Error} errorObject
   */

	}, {
		key: '_onError',
		value: function _onError(errorObject) {
			throw errorObject;
		}
	}, {
		key: 'currentTime',
		get: function get() {
			return this._videoController.currentTime;
		}

		/**
   * Getter of video duration
   *
   * @public
   * @returns {Number} the video current duration
   */

	}, {
		key: 'duration',
		get: function get() {
			return this._videoController.duration;
		}

		// @TODO
		// set loop() {}
		// get loop() {}


		/**
   * Getter of video paused status
   *
   * @public
   * @returns {Boolean} the video paused status
   */

	}, {
		key: 'paused',
		get: function get() {
			return this._videoController.paused;
		}
	}]);

	return Player;
}(__WEBPACK_IMPORTED_MODULE_4__util_event_emitter__["a" /* default */]);

Player.EVENT_TIME_UPDATE = 'eventTimeUpdate';
Player.EVENT_MANIFEST_LOADED = 'eventManifestLoaded';
Player.MAX_LOAD_ATTEMPTS = 3;


/* harmony default export */ __webpack_exports__["default"] = Player;

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }



var Source = function (_EventEmitter) {
	_inherits(Source, _EventEmitter);

	function Source(videoController) {
		var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

		_classCallCheck(this, Source);

		var _this = _possibleConstructorReturn(this, (Source.__proto__ || Object.getPrototypeOf(Source)).call(this));

		_this._mediaSource = null;
		_this._sourceBuffer = null;
		_this._videoController = null;
		_this._quality = null;
		_this._isInitialised = false;
		_this._isUpdating = false;
		_this._currentFragmentIndex = null;
		_this._debug = false;


		_this._videoController = videoController;
		_this._debug = debug;

		_this._initSource();
		return _this;
	}

	/*_______________________________________________
 	Public
 _______________________________________________*/

	_createClass(Source, [{
		key: 'initialise',
		value: function initialise(stream) {
			return this._initialise(stream);
		}
	}, {
		key: 'appendToBuffer',
		value: function appendToBuffer(fragment) {
			return this._appendToBuffer(fragment);
		}
	}, {
		key: '_initSource',


		/*_______________________________________________
  	Private
  _______________________________________________*/

		value: function _initSource() {
			this._bind();

			this._mediaSource = new MediaSource();
		}
	}, {
		key: '_bind',
		value: function _bind() {
			this.initialise = this.initialise.bind(this);
			this._onInitialised = this._onInitialised.bind(this);
			this._onError = this._onError.bind(this);
			this._endStream = this._endStream.bind(this);
		}

		/**
   * Initialises the opening of the media source and once done calls Initialised
   *
   * @private
   * @param {Object} stream The stream data model object
   * @returns Promise
   */

	}, {
		key: '_initialise',
		value: function _initialise(stream) {
			return this._initialiseMediaSource(stream, this._videoController, this._mediaSource).then(this._onInitialised).catch(this._onError);
		}

		/**
   * Init method that opens our MediaSource within a promise and resolves when open, initiated from Player.
   *
   * @private
   * @param {Object} stream The stream data model object
   * @param {VideoController} videoController the video element controller, api to the HTML video element
   * @param {MediaSource} mediaSource our MediaSource
   * @returns Promise
   */

	}, {
		key: '_initialiseMediaSource',
		value: function _initialiseMediaSource(stream, videoController, mediaSource) {
			return new Promise(function (resolve, reject) {
				if (MediaSource.isTypeSupported(stream.bufferType) === false) {
					reject(new Error('Media type is not supported:', stream.bufferType));
				}

				// This caused an error on my macbook, omitting for now
				// videoController.src = null;

				mediaSource.addEventListener('sourceopen', onSourceOpen);

				var sourceURL = window.URL.createObjectURL(mediaSource);
				videoController.src = sourceURL;

				function onSourceOpen() {

					window.URL.revokeObjectURL(sourceURL);

					mediaSource.removeEventListener('sourceopen', onSourceOpen);

					var sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.64001E"');

					resolve({ mediaSource: mediaSource, sourceBuffer: sourceBuffer, stream: stream });
				}
			});
		}
	}, {
		key: '_onInitialised',
		value: function _onInitialised(_ref) {
			var mediaSource = _ref.mediaSource,
			    sourceBuffer = _ref.sourceBuffer,
			    stream = _ref.stream;

			if (this._debug) console.log('mediaSource readyState: ' + mediaSource.readyState);

			mediaSource.duration = stream.duration;

			mediaSource.addEventListener('error', this._onError);
			sourceBuffer.addEventListener('error', this._onError);
			// sourceBuffer.addEventListener('updateend', this._onUpdateEnd);

			this._sourceBuffer = sourceBuffer;

			this._isInitialised = true;
		}
	}, {
		key: '_appendToBuffer',
		value: function _appendToBuffer(fragment) {
			var _this2 = this;

			return new Promise(function (resolve, reject) {

				if (_this2._isUpdating === false) {
					var _onUpdateEnd = function _onUpdateEnd() {
						if (this._debug) console.log('_appendToBuffer onUpdateEnd');
						sourceBuffer.removeEventListener('updateend', _onUpdateEnd);

						self._isUpdating = false;

						resolve();
					};

					_this2._isUpdating = true;

					if (_this2._debug) console.log('_appendToBuffer arrayBuffer length: ' + fragment.size + ' ' + fragment.url);

					var sourceBuffer = _this2._sourceBuffer;
					var self = _this2;

					_this2._quality = fragment.streamIndex;
					_this2._currentFragmentIndex = fragment.index;

					sourceBuffer.appendBuffer(fragment.bytes);

					// if (this._videoElement.paused) {
					// 	this._videoElement.play(); // Start playing if paused
					// }

					if (fragment.isLast) {
						_this2._sourceBuffer.addEventListener('updateend', _this2._endStream);
					}

					sourceBuffer.addEventListener('updateend', _onUpdateEnd);
				}
				// } else {
				// 	reject(new Error(`Will not appendBuffer with fragment index ${fragment.index}, SourceBuffer is still being updated with fragment index ${this._currentFragmentIndex}, try later`));
				// }
			});
		}
	}, {
		key: '_endStream',
		value: function _endStream() {
			if (this._mediaSource.readyState !== 'open') {
				this._onError(new Error("MediaSource readyState is not open, can't end steam"));
			}

			this._mediaSource.endOfStream();
			if (this._debug) console.log('Source endOfStream()');
			this._sourceBuffer.removeEventListener('updateend', this._endStream);
		}
	}, {
		key: '_onError',
		value: function _onError(errorObject) {
			throw errorObject;
		}
	}, {
		key: 'quality',
		get: function get() {
			return this._quality;
		}
	}, {
		key: 'isInitialised',
		get: function get() {
			return this._isInitialised;
		}
	}, {
		key: 'isUpdating',
		get: function get() {
			return this._isUpdaing;
		}
	}]);

	return Source;
}(__WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter___default.a);

Source.EVENT_SOURCE_OPEN = 'eventSourceOpen';
/* harmony default export */ __webpack_exports__["a"] = Source;

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The VideoElement controller is minimalDash's API to the HTML Video Element, The controller also
 * monitors the video playback and dispatches time update events. This is then used to call
 * this.checkBuffer which provides confirmation if we need load more into the buffer and at
 * what time
 */



var RANGE_START_END_TOLERANCE = 0.05; // Safari and Firefox buffer ranges seem to be out by 0.03, use a tollerance for now, investingate further


var VideoElement = function (_EventEmitter) {
	_inherits(VideoElement, _EventEmitter);

	// flag to indentiy explicity user pausing via this classes public api


	// {Boolean} flag to determine loop logic


	// {Boolean} video element autoplay is always set to false, this property is used replace that


	// HTML Video Element
	function VideoElement(videoElement, manifest) {
		var bufferMinLength = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 8;
		var debug = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

		_classCallCheck(this, VideoElement);

		var _this = _possibleConstructorReturn(this, (VideoElement.__proto__ || Object.getPrototypeOf(VideoElement)).call(this));

		_this._videoElement = null;
		_this._bufferMinLength = null;
		_this._autoplay = false;
		_this._loop = false;
		_this._hasPlayed = false;
		_this._manifest = null;
		_this._userPaused = false;
		_this._debug = false;


		_this._videoElement = videoElement;
		_this._manifest = manifest;
		_this._bufferMinLength = bufferMinLength < manifest.fragmentDuration ? manifest.fragmentDuration : bufferMinLength;
		_this._debug = debug;

		_this._initVideoElement();
		return _this;
	}

	/*_______________________________________________
 	Public
 _______________________________________________*/

	/**
  * Public access to check buffer
  *
  * @public
  */


	// {Object} the manifest data model saved for internal use


	// {Boolean} video element loop is always set to false, this property is used replace that


	// Minimum fragment lengths that the we aim to keep full before loading another


	// Event dispatched on time update


	_createClass(VideoElement, [{
		key: 'checkBuffer',
		value: function checkBuffer() {
			return this._checkBuffer();
		}

		/**
   * Instruct the video element to play
   *
   * @public
   */

	}, {
		key: 'play',
		value: function play() {
			this._userPaused = false;
			this._videoElement.play();
		}

		/**
   * Instruct the video element to pause
   *
   * @public
   */

	}, {
		key: 'pause',
		value: function pause() {
			this._userPaused = true;
			this._videoElement.pause();
		}

		/**
   * Getter of video autoplay
   *
   * @public
   * @returns {Boolean} the status of the video's autoplay
   */

	}, {
		key: '_initVideoElement',


		/*_______________________________________________
  	Private
  _______________________________________________*/

		/**
   * Initialisation
   *
   * @private
   */
		value: function _initVideoElement() {
			this._bind();

			// Check explicit setting of video element to preload, typically we will not want this to be the default.
			var shouldPreload = this._videoElement.getAttribute('preload');
			this._videoElement.preload = shouldPreload !== null && shouldPreload !== "none" ? "auto" : "none";

			// the autoplay property of the video element must be set to false, we will use an internal property
			// to determine if we want to autoplay
			this._autoplay = this._videoElement.getAttribute('autoplay') !== null ? true : false;
			this._videoElement.autoplay = false;

			// the loop property of the video element must be set to false, we will use an internal property
			// to determine if we want to loop
			this._loop = this._videoElement.getAttribute('loop') !== null ? true : false;
			this._videoElement.loop = false;

			this._videoElement.addEventListener("loadstart", this._onVideoEvent);
			this._videoElement.addEventListener("abort", this._onVideoEvent);
			this._videoElement.addEventListener("canplay", this._onVideoEvent);
			this._videoElement.addEventListener("canplaythrough", this._onVideoEvent);
			this._videoElement.addEventListener("durationchange", this._onVideoEvent);
			this._videoElement.addEventListener("emptied", this._onVideoEvent);
			this._videoElement.addEventListener("ended", this._onVideoEvent);
			this._videoElement.addEventListener("error", this._onVideoEvent);
			this._videoElement.addEventListener("loadeddata", this._onVideoEvent);
			this._videoElement.addEventListener("loadedmetadata", this._onVideoEvent);
			this._videoElement.addEventListener("pause", this._onVideoEvent);
			this._videoElement.addEventListener("play", this._onVideoEvent);
			this._videoElement.addEventListener("playing", this._onVideoEvent);
			this._videoElement.addEventListener("progress", this._onVideoEvent);
			this._videoElement.addEventListener("ratechange", this._onVideoEvent);
			this._videoElement.addEventListener("resize", this._onVideoEvent);
			this._videoElement.addEventListener("seeked", this._onVideoEvent);
			this._videoElement.addEventListener("seeking", this._onVideoEvent);
			this._videoElement.addEventListener("stalled", this._onVideoEvent);
			this._videoElement.addEventListener("suspend", this._onVideoEvent);
			this._videoElement.addEventListener("timeupdate", this._onVideoEvent);
			this._videoElement.addEventListener("waiting", this._onVideoEvent);
		}

		/**
   * Bind here for clarity
   *
   * @private
   */

	}, {
		key: '_bind',
		value: function _bind() {
			this._onVideoEvent = this._onVideoEvent.bind(this);
		}

		/**
   * Video event handler currently used to monitor time updates, this then cues the player to periodically check the buffer
   *
   * @private
   * @param {Event} event browser video event
   */

	}, {
		key: '_onVideoEvent',
		value: function _onVideoEvent(event) {
			if (this._debug) console.log("VIDEO EVENT: " + event.type + " " + this._videoElement.currentTime);
			switch (event.type) {
				case 'ended':
					// reset _userPaused 
					this._userPaused = false;

					if (this._loop) {
						this._videoElement.play();
					}
					break;
				case 'play':
					this._userPaused = false;
					break;
				case 'pause':
					// pause is only dispatched when user presses pause, api is told to pause or video has ended
					this._userPaused = true;
					break;
				case 'progress':
					this._checkToAutoPlay();
					break;
				case 'timeupdate':
					this.emit(VideoElement.EVENT_TIME_UPDATE);
					break;
			}
		}

		/**
   * @TODO this currently does not work when user plays and pauses via the video controls
   * 
   * Method called on progress event to check if conditions are right to auto play the video element. Conditions are,
   * 1: AutoPlay is on video element is set
   * 2: The VideoElement is current not playing
   * 3: The user as not explicity paused player
   * 4: The VideoElement has not ended
   * 5: We have enough data in the buffer
   * 
   * @private
   */

	}, {
		key: '_checkToAutoPlay',
		value: function _checkToAutoPlay() {
			var _checkBuffer2 = this._checkBuffer(),
			    shouldGetData = _checkBuffer2.shouldGetData;

			if (this._autoplay && this._videoElement.paused && !this._userPaused && this._videoElement.ended === false && shouldGetData === false) {

				this._videoElement.play();
			}
		}

		/**
   * A Check of the video to determine if the buffer requires filling, and also at what time the video buffer will run out
   * called by the player
   *
   * @private
   * @returns {Object} containing a boolean flag to whether the buffer need topping up and also the time that the buffer is empty at
   */

	}, {
		key: '_checkBuffer',
		value: function _checkBuffer() {
			var _this2 = this;

			var shouldGetData = true;

			var currentTime = this._videoElement.currentTime;
			var bufferMinLength = this._videoElement.preload === "auto" ? this._manifest.duration : this._bufferMinLength;

			var bufferIndex = this._videoElement.buffered.length;
			var fragmentDuration = this._manifest.fragmentDuration;

			var bufferEmptyAtTime = null;
			var ranges = [];

			if (this._videoElement.buffered.length === 0 && bufferMinLength > 0) {
				shouldGetData = true;
				bufferEmptyAtTime = 0;
			}

			while (bufferIndex--) {
				ranges.push({
					start: this._videoElement.buffered.start(bufferIndex),
					end: this._videoElement.buffered.end(bufferIndex),
					index: bufferIndex
				});
			}

			// Here we attempt to determin if the playhead is within a currently buffered range
			ranges.forEach(function (range) {

				var equalOrGreaterThanStart = currentTime >= range.start - RANGE_START_END_TOLERANCE;
				var equalOrLessThanEnd = currentTime <= range.end + RANGE_START_END_TOLERANCE;

				// find the range that the currentTime is within
				if (equalOrGreaterThanStart && equalOrLessThanEnd) {

					// calculate the time at when the next fragment is needed in the buffer,
					// typically this will be at the end of a fragment, and so we will use the tollerance range
					// to snap this perfectly to the first ms of the next fragment. However we can't 
					// gaurantee that the browser has not flushed the cache or only part of the fragment was 
					// attached to the media source, in this case when outside of the tollerance we will
					// simply take this value at face value to handle these unforseen circumstances.
					var snappedRangeEnd = Math.round(range.end / fragmentDuration) * fragmentDuration;
					if (range.end >= snappedRangeEnd - RANGE_START_END_TOLERANCE && range.end <= snappedRangeEnd + RANGE_START_END_TOLERANCE) {
						bufferEmptyAtTime = snappedRangeEnd;
					} else {
						bufferEmptyAtTime = range.end;
					}

					// cancel getting more data if we have enough buffer infront of the playhead
					if (currentTime <= bufferEmptyAtTime - bufferMinLength) {
						shouldGetData = false;
					}

					// cancel only if buffer is within the last fragment
					// if (bufferEmptyAtTime > this._manifest.duration - fragmentDuration) {
					// 	shouldGetData = false;
					// }

					if (bufferEmptyAtTime >= _this2._manifest.duration) {
						shouldGetData = false;
					}
				}
			});

			// If there is no buffer surrounding currentTime, then set to currentTime
			if (bufferEmptyAtTime === null) {
				bufferEmptyAtTime = currentTime;
			}

			return {
				shouldGetData: shouldGetData,
				bufferEmptyAtTime: bufferEmptyAtTime
			};
		}
	}, {
		key: 'autoplay',
		get: function get() {
			return this._autoplay;
		}

		/**
   * Getter of video currentTime currently used in debugging
   *
   * @public
   * @returns {Number} the video current time
   */

	}, {
		key: 'currentTime',
		get: function get() {
			return this._videoElement.currentTime;
		}

		/**
   * Getter of video duration
   *
   * @public
   * @returns {Number} the video current duration
   */

	}, {
		key: 'duration',
		get: function get() {
			return this._videoElement.duration;
		}

		/**
   * Getter of video ended status
   *
   * @public
   * @returns {Boolean} the video has ended
   */

	}, {
		key: 'ended',
		get: function get() {
			return this._videoElement.ended;
		}

		/**
   * Getter of video element
   *
   * @public
   * @returns {HTMLVideoElement} the video element
   */

	}, {
		key: 'element',
		get: function get() {
			return this._videoElement;
		}

		/**
   * Getter of video autoplay
   *
   * @public
   * @returns {Boolean} the status of the video's autoplay
   */

	}, {
		key: 'loop',
		get: function get() {
			return this._loop;
		}

		/**
   * Getter of video paused status
   *
   * @public
   * @returns {Boolean} the video paused status
   */

	}, {
		key: 'paused',
		get: function get() {
			return this._videoElement.paused;
		}

		/**
   * Setter to set the source of the video element
   *
   * @public
   * @param {String} the url created by the MediaSource, established from the SourceController
   */

	}, {
		key: 'src',
		set: function set(source) {
			this._videoElement.src = source;
		}
	}]);

	return VideoElement;
}(__WEBPACK_IMPORTED_MODULE_0_wolfy87_eventemitter___default.a);

VideoElement.EVENT_TIME_UPDATE = 'eventTimeUpdate';
/* harmony default export */ __webpack_exports__["a"] = VideoElement;

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__fragment__ = __webpack_require__(0);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



var Stream = function () {
	function Stream(data) {
		_classCallCheck(this, Stream);

		this._bandwidth = null;
		this._height = null;
		this._id = null;
		this._width = null;
		this._initialization = null;
		this._duration = null;
		this._numberOfFragments = null;
		this._startNumber = 0;
		this._fragments = null;
		this._initFragment = null;
		this._isInitialised = false;
		this._index = null;
		this._currentFragmentIncrement = 0;
		this._hasBeenAppended = false;


		this._init(data);
	}

	/*____________________________________________
 	Public
 _____________________________________________*/

	_createClass(Stream, [{
		key: Symbol.iterator,
		value: function value() {
			return this;
		}
	}, {
		key: "next",
		value: function next() {
			return this._next();
		}
	}, {
		key: "getFragment",
		value: function getFragment(index) {
			return this._fragments[index];
		}
	}, {
		key: "getFragmentInit",
		value: function getFragmentInit() {
			return this._initFragment;
		}

		/*____________________________________________
  	Private
  _____________________________________________*/

	}, {
		key: "_init",
		value: function _init(data) {
			this._bandwidth = data.bandwidth;
			this._bufferType = data.mimeType + "; codecs=\"" + data.codecs + "\"";
			this._initialization = data.initialization.replace("$RepresentationID$", data.id);
			this._numberOfFragments = data.numberOfFragments;
			this._startNumber = parseInt(data.startNumber);
			this._duration = data.duration;
			this._media = data.media;
			this._index = data.index;
			this._manifest = data.manifest;

			this._fragments = [];

			var increment = 0;
			var isLast = false;

			while (increment < this._numberOfFragments) {
				var url = this._media.replace("$RepresentationID$", data.id);
				url = url.replace("$Number$", increment + this._startNumber);

				isLast = increment === this._numberOfFragments - 1;

				this._fragments.push(new __WEBPACK_IMPORTED_MODULE_0__fragment__["a" /* default */](increment, url, this._index, this, isLast));

				increment++;
			}

			this._initFragment = new __WEBPACK_IMPORTED_MODULE_0__fragment__["a" /* default */](-1, this._initialization, this._index, this, false);
		}
	}, {
		key: "_next",
		value: function _next() {

			var fragmentIncrement = this._currentFragmentIncrement;

			this._currentFragmentIncrement += 1;

			var done = this._currentFragmentIncrement > this._fragments.length;

			if (done) {
				this._currentFragmentIncrement = 0;
				return { done: done };
			} else {
				return {
					value: this.getFragment(fragmentIncrement)
				};
			}
		}
	}, {
		key: "initialization",
		get: function get() {
			return this._initialization;
		}
	}, {
		key: "bufferType",
		get: function get() {
			return this._bufferType;
		}
	}, {
		key: "bandwidth",
		get: function get() {
			return this._bandwidth;
		}
	}, {
		key: "numberOfFragment",
		get: function get() {
			return this._numberOfFragments;
		}
	}, {
		key: "duration",
		get: function get() {
			return this._duration;
		}
	}, {
		key: "isInitialised",
		get: function get() {
			return this._isInitialised;
		},
		set: function set(bool) {
			this._isInitialised = bool;
		}
	}, {
		key: "index",
		get: function get() {
			return this._index;
		}
	}, {
		key: "hasBeenAppendded",
		set: function set(bool) {
			this._hasBeenAppended = bool;
		},
		get: function get() {
			return this._hasBeenAppended;
		}
	}, {
		key: "manifest",
		get: function get() {
			return this._manifest;
		}
	}]);

	return Stream;
}();

/* harmony default export */ __webpack_exports__["a"] = Stream;

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventEmitter = function () {
	function EventEmitter() {
		_classCallCheck(this, EventEmitter);

		this._listeners = null;

		this._listeners = {};
	}

	/*_______________________________________________
 	Public
 _______________________________________________*/

	_createClass(EventEmitter, [{
		key: 'addEventListener',
		value: function addEventListener(type, callback) {
			if (!(type in this._listeners)) {
				this._listeners[type] = [];
			}

			this._listeners[type].push(callback);
		}
	}, {
		key: 'removeEventListener',
		value: function removeEventListener(type, callback) {
			if (!(type in this._listeners)) {
				return;
			}

			var stack = this._listeners[type];

			for (var i = 0, l = stack.length; i < l; i++) {
				if (stack[i] === callback) {
					stack.splice(i, 1);
					return this.removeEventListener(type, callback);
				}
			}
		}
	}, {
		key: 'dispatchEvent',
		value: function dispatchEvent(event) {
			if (typeof event == 'string') {
				event = {
					type: event
				};
			}

			var args = Array.from(arguments).slice(1);

			if (!(event.type in this._listeners)) {
				return;
			}

			var stack = this._listeners[event.type];
			event.target = this;

			for (var i = 0, l = stack.length; i < l; i++) {
				var _stack$i;

				(_stack$i = stack[i]).call.apply(_stack$i, [this, event].concat(_toConsumableArray(args)));
			}
		}
	}]);

	return EventEmitter;
}();

/* harmony default export */ __webpack_exports__["a"] = EventEmitter;

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FetchXHR2 = function () {
	function FetchXHR2() {
		_classCallCheck(this, FetchXHR2);
	}

	_createClass(FetchXHR2, null, [{
		key: "fetch",
		value: function fetch(url) {
			var responseType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'text';

			return new Promise(function (resolve, reject) {

				var xhr = FetchXHR2._createCORSRequest("GET", url);

				if (xhr == null) {
					reject(new Error("CORS not supported"));
				}

				//xhr.withCredentials = true;
				xhr.responseType = responseType;

				addEventListeners();

				xhr.send();

				function addEventListeners() {
					xhr.addEventListener("loadstart", handleEvent, false);
					xhr.addEventListener("progress", handleEvent, false);
					xhr.addEventListener("abort", handleEvent, false);
					xhr.addEventListener("error", handleEvent, false);
					xhr.addEventListener("timeout", handleEvent, false);
					xhr.addEventListener("load", handleEvent, false);
					xhr.addEventListener("readystatechange", handleEvent, false);
				}

				function removeEventListeners() {
					xhr.removeEventListener("loadstart", handleEvent, false);
					xhr.removeEventListener("progress", handleEvent, false);
					xhr.removeEventListener("abort", handleEvent, false);
					xhr.removeEventListener("error", handleEvent, false);
					xhr.removeEventListener("timeout", handleEvent, false);
					xhr.removeEventListener("load", handleEvent, false);
					xhr.removeEventListener("readystatechange", handleEvent, false);
				}

				function handleEvent(event) {
					switch (event.type) {
						case 'loadstart':
							break;
						case 'progress':
							break;
						case 'abort':
							break;
						case 'error':
							reject("" + event.type);
							break;
						case 'timeout':
							reject("" + event.type);
							break;
						case 'load':
							handleLoad(event);
							break;
						case 'readystatechange':
							if (xhr.readyState === 2 && xhr.status === 404) {
								var error = new Error("FetchXHR2:" + event.type + " - readyState:" + xhr.readyState + " status:" + xhr.status + " statusText:" + xhr.statusText + " url:" + url);
								reject(error);
							}
							if (xhr.readyState === 4 && xhr.status !== 200) {
								var _error = new Error("FetchXHR2:" + event.type + " - readyState:" + xhr.readyState + " status:" + xhr.status + " statusText:" + xhr.statusText + " url:" + url);
								reject(_error);
							}
							break;
					}

					// if (Globals.LOG) console.log(event.type);
				}

				function handleLoad(event) {
					removeEventListeners();

					switch (xhr.responseType) {
						case 'arraybuffer':
							handleArrayBufferLoad(event);
							break;
						case 'blob':
							handleImageLoad(event);
							break;
						case 'text':
							handleTextLoad(event);
							break;

					}
				}

				function handleArrayBufferLoad(event) {
					resolve(new Uint8Array(event.target.response));

					destroy();
				}

				function handleImageLoad(event) {
					var img = document.createElement('img');

					img.onload = function (event) {
						URL.revokeObjectURL(img.src); // Clean up after yourself.

						resolve(img, url, img.src);

						destroy();
					};

					img.src = URL.createObjectURL(xhr.response);
				}

				function handleTextLoad(event) {
					var text = xhr.response;
					resolve(text);
				}

				function destroy() {
					xhr = null;
				}
			});
		}
	}, {
		key: "_createCORSRequest",
		value: function _createCORSRequest(method, url) {

			var xhr = new XMLHttpRequest();
			if ("withCredentials" in xhr) {
				xhr.open(method, url, true);
			} else if (typeof XDomainRequest != "undefined") {
				xhr = new XDomainRequest();
				xhr.open(method, url);
			} else {
				xhr = null;
			}
			return xhr;
		}
	}]);

	return FetchXHR2;
}();

/* unused harmony default export */ var _unused_webpack_default_export = FetchXHR2;

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = removeSpikes;
/* unused harmony export getMedian */
/**
 * Takes an array of numbers and pucks out any odd spike values that don't
 * represent the typical varience within the typical range of values
 */
function removeSpikes(values) {
	var tolerance = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;


	// nothing to clip
	if (values.length < 2) {
		return values;
	}

	// Utility function to return the sum variance against a defined value within an array of values
	function getSumVariancesOfIndex(values, index) {
		var varianceSum = 0;

		for (var i = 0; i < values.length; i++) {
			if (i !== index) {
				varianceSum += Math.abs(values[index] - values[i]);
			}
		}

		return varianceSum;
	}

	// Utility function to return the value that varies the least relative to the other values
	function getValueOfLeastVariance(values) {
		var minSum = Number.POSITIVE_INFINITY;
		var currentSum = void 0;
		var minIndex = -1;

		for (var i = 0; i < values.length; i++) {
			currentSum = getSumVariancesOfIndex(values, i);
			if (currentSum < minSum) {
				minSum = currentSum;
				minIndex = i;
			}
		}

		return values[minIndex];
	}

	// Utility function to return the area of the variance against a possible max
	function getAreaPercentage(values) {

		var area = 0;
		var max = values.reduce(function (previous, next) {
			return Math.max(previous, next);
		});
		var min = values.reduce(function (previous, next) {
			return Math.min(previous, next);
		}, max);

		var difference = max - min;
		var maxArea = difference * (values.length - 1);

		for (var i = 0; i < values.length; i++) {
			area += values[i] - min;
		}

		return area / maxArea;
	}

	// first off remove nulls 
	values = values.filter(function (value) {
		return value !== null && value !== undefined && value !== Number.POSITIVE_INFINITY && isNaN(value) === false;
	});

	// initial sort to begin to analyse the variance between the values
	var sortedValues = values.sort(function (a, b) {
		return a - b;
	});
	// we attempt to find a value that is more similar to all the others, we used to use the median here
	var median = getValueOfLeastVariance(values);

	// now log all variances from median
	var variances = [];

	for (var i = 0; i < sortedValues.length; i++) {
		variances.push({
			index: i,
			value: Math.abs(median - sortedValues[i])
		});
	}

	// order the variances
	variances = variances.sort(function (a, b) {
		return a.value - b.value;
	});

	// calculate area of variance, imagine a graph where vairance is ploted against the number of variants
	// a 100% proportional line from bottom left to top right would signify a 100% distributed set of variences,
	// ergo 50% area would signify no spikes and all values equally distrubuted.
	// a large area signifies a wide range of variance across values, a small variance signifies a general
	// small variance across typical values.
	var area = 0;

	// calculate max amount of variance
	if (variances[variances.length - 1] === undefined) {
		debugger;
	}
	var maxValue = variances[variances.length - 1].value;
	var clipPercentage = getAreaPercentage(variances.map(function (variance) {
		return variance.value;
	}));
	var toleranceAdjustment = (1 - clipPercentage) * tolerance;
	var clipPercentageToleranceAdjusted = clipPercentage + toleranceAdjustment;
	var maxAmountOfVarianceAllowed = maxValue * clipPercentageToleranceAdjusted;

	// use only values that are within the max variance
	var clippedValues = [];
	var _iteratorNormalCompletion = true;
	var _didIteratorError = false;
	var _iteratorError = undefined;

	try {
		for (var _iterator = variances[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
			var variance = _step.value;

			if (variance.value <= maxAmountOfVarianceAllowed) {
				clippedValues.push(sortedValues[variance.index]);
			}
		}

		// if all values are clipped then return the median
	} catch (err) {
		_didIteratorError = true;
		_iteratorError = err;
	} finally {
		try {
			if (!_iteratorNormalCompletion && _iterator.return) {
				_iterator.return();
			}
		} finally {
			if (_didIteratorError) {
				throw _iteratorError;
			}
		}
	}

	if (clippedValues.length === 0) {
		return [median];
	}

	clippedValues = clippedValues.sort(function (a, b) {
		return a - b;
	});

	return clippedValues;
}

function getMedian(sortedValues) {
	var startIndex = Math.floor(sortedValues.length / 2) - 1;
	var endIndex = Math.ceil(sortedValues.length / 2) - 1;

	if (sortedValues.length === 0) {
		return null;
	}

	if (sortedValues.length === 1) {
		return sortedValues[0];
	}

	if (startIndex === endIndex) {
		return sortedValues[startIndex];
	}

	return sortedValues[startIndex] + (sortedValues[endIndex] - sortedValues[startIndex]) / 2;
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ })
/******/ ]);
});