class EventHandler extends Promise {
    constructor(eventManager, eventName, callback, triggerLimit = false) {
        super(on);

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
        this._emitter.on('trigger', this._cb);

        this._manager._emitter.on(eventName, this._cb);
        
        this._manager._internalEmitter.once(`close`, this.off);
        this._manager._internalEmitter.once(`off`, this.off);
        this._manager._internalEmitter.once(`off:${this._eventName}`, this.off);
    }

    on(callback) {
        return this._manager.on.apply(this._manager, [this._name].concat(arguments));
    }

    once(callback) {
        return this._manager.once.apply(this._manager, [this._name].concat(arguments));
    }

    trigger() {
        if (this._off) return;
        if (this._triggerLimit !== false && ++this._triggerCount >= this._triggerLimit) this.off();
        return this._emitter.emit.apply(_emitter, ['trigger'].concat(arguments));
    }

    off() {
        if (this._off) return;

        this._off = true;
        this._emitter.off('trigger', this._cb);

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

        this._isClosed = false;
    }

    on(eventName, callback) {
        if(this._isClosed) return;
        let eventHandler = new EventHandler(this, eventName, callback, false);
        return eventHandler;
    }

    once(eventName, callback) {
        if(this._isClosed) return;
        let eventHandler = new EventHandler(this, eventName, callback, 1);
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