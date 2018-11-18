class EventyHandler extends Promise {
    _promiseResolver(resolve, reject) {
        this._events.on('triggered', resolve);
        this._events.on('errored', reject);
    }
    constructor(source, internalEvents, eventName, callback, payload) {
        super(this._promiseResolver);
        
        this._eventName = eventName;
        this._callback = callback;
        this._payload = payload;

        this._events = new EventEmitter();
        this._events.on('triggered', this._callback);

        if(source) this._attach(source);

        this._internalEvents = internalEvents;
        this._internalEvents.on('attached', this._attach);
        this._internalEvents.on('detached', this._detach);
        this._internalEvents.once('closed', this.off);
    }
    trigger(payload) {
        this._events.emit('triggered', payload);
    }
    off() {
        this._detach();
        this._internalEvents.off('attached', this._attach);
        this._internalEvents.off('detached', this._detach);
        this._events.off('triggered', this._callback);
    }
    _attach(source) {
        this._detach();
        this.eventyHandler = source.on(this._eventName, this.trigger, this._payload);
    }
    _detach() {
        if(!this.eventyHandler) return;
        this.eventyHandler.off();
    }
}

class EventyView {
    constructor(eventySource) {
        this._events = new EventEmitter();
        this._isAttached = false;
        if (eventySource) this.attach(eventySource);
    }

    attach(eventy) {
        if(this._isAttached) return;
        this._source = eventy;
        this._events.on('triggered', this._source.trigger);
        this._events.emit('attached', eventy);
    }

    detach() {
        if(!this._isAttached) return;
        this._events.off('triggered', this._source.trigger);
        let oldSource = this._source;
        this._source = null;
        this._events.emit('dettached');
    }

    on(eventName, callback, payload) {
        return new EventyHandler(this._source, this._events, eventName, callback, payload);
    }

    close() {
        this._events.emit('closed');
    }

    trigger(payload) { 
        this._events.emit('triggered', payload);
        // return this._source && this._source[arguments.callee.name].apply(this._source, arguments); }

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