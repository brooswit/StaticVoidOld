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

        if(source) this._onAttach(source);

        this._internalEvents = internalEvents;
        this._internalEvents.on('attached', this._onAttach);
        this._internalEvents.on('detached', this._onDetach);
        this._internalEvents.once('closed', this.off);
    }
    trigger(payload) {
        this._events.emit('triggered', payload);
    }
    off() {
        this._onDetach();
        this._internalEvents.off('attached', this._onAttach);
        this._internalEvents.off('detached', this._onDetach);
        this._events.off('triggered', this._callback);
    }
    _onAttach(source) {
        this._onDetach();
        this.eventyHandler = source.on(this._eventName, this.trigger, this._payload);
    }
    _onDetach() {
        if(!this.eventyHandler) return;
        this.eventyHandler.off();
    }
}

class EventyInternal {
    constructor() {
        this._events = new EventEmitter();
        this._internalEvents = new EventEmitter();
    }
    trigger(eventName, payload) {
        this._events.trigger(eventName, payload);
    }
    on(eventName, callback, payload) {
        return new EventyHandler(this._events, this._internalEvents, eventName, callback, payload);
    }
    close() {
        this._internalEvents.emit('closed');
    }
}

class Eventy extends EventyView {
    constructor() {
        super(new EventyInternal());
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