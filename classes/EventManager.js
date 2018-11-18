const EventManagerInterface = require('./EventManagerInterface');
const EventHandler = require('./EventHandler');
const EventEmitter = require('events');
class EventyHandler {

}
class EventyInternal {

}
class EventyView {
    constructor(eventySource, static) {
        this._emitter = new EventEmitter();
        this._static = static;
        this._source = null;
        if (eventySource) this.attach(eventySource);
    }
    attach(eventy) {
        this.detach();
        this._source = eventy;
        this._emitter.emit('attached', eventy);
    }
    detach() {
        this._source = null;
        this._emitter.emit('dettached');
    }
    trigger() { return this._source && this._source[arguments.callee.name].apply(this._source, arguments); }
    on() { return this._source && this._source[arguments.callee.name].apply(this._source, arguments); }
    close() { return this._source && this._source[arguments.callee.name].apply(this._source, arguments); }

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