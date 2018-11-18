class EventManagerInterface {
    constructor(targetEventManager) {
        this._targetEventManager = targetEventManager;
        this._emitter = new EventEmitter();
    }

    on(eventName, callback) {
        let eventHandler = this._targetEventManager.on(eventName, callback);
        this._emitter.once('close', eventHandler.off);
        return eventHandler;
    }

    once(eventName, callback) {
        let eventHandler = this._targetEventManager.once(eventName, callback);
        this._emitter.once('close', eventHandler.off);
        return eventHandler;
    }

    close() {
        this._emitter.trigger('close');
    }
}

class EventHandler extends Promise {
    constructor(emitter, internalEmitter, eventName, callback, context, triggerLimit = false) {
        super(on);
        this._isOff = false;

        this._name = eventName;
        this._cb = callback;
        this._triggerLimit = triggerLimit === true ?
            1 : typeof triggerLimit === 'number' ?
            triggerLimit : false;

        assert(typeof this._name === 'string');
        assert(typeof this._cb === 'function');
        assert(typeof this._triggerLimit === 'number' || typeof this._triggerLimit === 'boolean');

        this._context = context;

        this._triggerCount = 0;
        
        this._managerEventInterface = new EventManagerInterface(emitter);
        this._managerInternalEventInterface = new EventManagerInterface(internalEmitter);

        this._managerEventInterface.on(eventName, this.trigger);
        this._managerInternalEventInterface.once(`close`, this.off);
        this._managerInternalEventInterface.once(`off`, this.off);
        this._managerInternalEventInterface.once(`off:${this._eventName}`, this.off);
    }

    trigger() {
        if (this._isOff) return;
        if (this._triggerLimit !== false && ++this._triggerCount >= this._triggerLimit) return this.off();
        return this._cb.apply(this._context, arguments);
    }

    on(callback) {
        return this._managerEventInterface.on(this._name, callback);
    }

    once(callback) {
        return this._managerEventInterface.once(this._name, callback);
    }

    off() {
        if (this._isOff) return;
        this._isOff = true;

        this._managerEventInterface.close();
        this._managerInternalEventInterface.close();
    }
}

class EventManager {
    constructor() {
        this._isClosed = false;

        this._emitter = new EventEmitter();
        this._internalEmitter = new EventEmitter();
    }

    on(eventName, callback) {
        if(this._isClosed) return;
        let eventHandler = new EventHandler(this._emitter, this._internalEmitter, eventName, callback, false);
        return eventHandler;
    }

    once(eventName, callback) {
        if(this._isClosed) return;
        let eventHandler = new EventHandler(this._emitter, this._internalEmitter, eventName, callback, 1);
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