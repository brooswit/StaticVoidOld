const EventManagerInterface = require('./EventManagerInterface');
const EventHandler = require('./EventHandler');
const EventEmitter = require('events');
class EventyHandler extends Promise {
    constructor(source, internalEvents, eventName, callback, payload) {
        super(on);
        
        this._source = source;
        this._events = internalEvents;
        this._eventName = eventName;
        this._callback = callback;
        this._payload = payload;
        this._events.on('attached', )
    }
    _onAttached
    on()
    off() {

    }
}
class EventyView {
    constructor(eventySource) {
        this._events = new EventEmitter();
        this._internalEvents = new EventEmitter();
        this._source = null;
        if (eventySource) this.attach(eventySource);
    }

    attach(eventy) {
        this.detach();
        this._source = eventy;
        this._internalEvents.emit('attached', eventy);
    }

    detach() {
        this._source = null;
        this._internalEvents.emit('dettached');
    }

    on(eventName, callback, payload) {
        return new EventyHandler(this._source, this._internalEvents, eventName, callback, payload);
    }

    trigger() { return this._source && this._source[arguments.callee.name].apply(this._source, arguments); }

}
class EventyInternal {

}
class Eventy extends EventyView {
    constructor() {
        super(new EventyInternal);
    }
}
class EventManager {
    constructor() {
        this._isClosed = false;

        this._emitter = new EventEmitter();
        this._internalEmitter = new EventEmitter();
    }

    trigger(eventName) {
        if(this._isClosed) return;
        return this._emitter.emit(eventName);
    }

    on(eventName, callback) {
        if(this._isClosed) return;
        let eventHandler = new EventHandler(this._emitter, this._internalEmitter, eventName, callback, false, Array.prototype.slice.call(arguments, 2));
        return eventHandler;
    }

    once(eventName, callback) {
        if(this._isClosed) return;
        let eventHandler = new EventHandler(this._emitter, this._internalEmitter, eventName, callback, 1, Array.prototype.slice.call(arguments, 2));
        return eventHandler;
    }

    off(eventName) {
        if(this._isClosed) return;
        this._internalEmitter.emit(`off:${eventName}`);
    }

    close() {
        if(this._isClosed) return;
        this._isClosed = true;
        this._internalEmitter.emit('close');
    }
}

EventManager.Interface = EventManagerInterface;

module.exports = EventManager;