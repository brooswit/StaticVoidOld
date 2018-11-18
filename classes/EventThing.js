class EventHandler extends Promise {
    constructor(eventManager, eventName, callback = false, triggerLimit = false) {
        super(on);

        if (typeof callback !== 'function') {
            triggerLimit = callback;
            callback = null;
        }

        this._manager = eventManager;
        this._name = eventName;
        this._cb = callback;
        this._triggerLimit = triggerLimit === true ?
            1 : typeof triggerLimit === 'number' ?
            triggerLimit : false;

        assert(this._manager instanceof EventManager);
        assert(typeof this._name === 'string');
        assert(typeof this._cb === 'function');
        assert(typeof this._triggerLimit === 'number' || typeof this._triggerLimit === 'boolean');

        this._emitter = new EventEmitter();
        this._off = false;
        this._triggerCount = 0;

        // Requires Cleanup \/
        this._manager._emitter.on(eventName, this._cb);
        
        this._manager._internalEmitter.once(`close`, this.off);
        this._manager._internalEmitter.once(`off`, this.off);
        this._manager._internalEmitter.once(`off:${this._eventName}`, this.off);
    }

    on(cb) {
        return this._manager.on(this._name, cb);
    }

    once(cb) {
        return this._manager.once(this._name, cb);
    }

    trigger() {
        if (this._off) return;
        if (this._triggerLimit !== false && ++this._triggerCount >= this._triggerLimit) this.off();
        this._emitter.emit.apply(_emitter, ['trigger', );
        let result = this._cb.apply(null, arguments);
        this._resolve(result);
        return result;
    }

    off() {
        if (this._off) return;
        this._off = true;

        this._manager._emitter.off('eventName', callback);
        this._manager._internalEmitter.once(`close`, this.off);
        this._manager._internalEmitter.once(`off`, this.off);
        this._manager._internalEmitter.once(`off:${this._eventName}`, this.off);
    }
}

class EventManager {
    constructor() {
        this._emitter = new EventEmitter();
        this._internalEmitter = new EventEmitter();
    }

    get(eventName) {
        if(this._isClosed) return;
        let eventHandlers = this._internalEmitter.query(`getEventHandlers:${eventName}`);
        return this._eventH[eventName] = this._events[eventName] || new EventHandler(this, eventName);
    }

    on(eventName, callback) {
        if(this._isClosed) return;
        let eventHandler = new Event(this, eventName, callback);
        return eventHandler;
    }

    off(eventName) {
        if(this._isClosed) return;
        this._internalEmitter.emit(`off:${eventName}`);
        this._events[eventName] = null;
        this._events[eventName] = new EventHandler(this, eventName);
    }

    close() {
        if(this._isClosed) return;
        this._isClosed = true;
        this._internalEmitter.emit('close')
    }
}
class EventInterface {
    constructor(parent) {
        this._parent = parent;
    }


    close() {

    }
}
class EventInterfaceFactory {
    constructor() {

    }

    newInterface() {
        return new EventInterface(this);
    }
}
class EventManager extends EventInterfaceFactory {
    constructor() {

    }


}