class EventHandler extends Promise {
    constructor(eventManager, eventName, callback, triggerLimit) {
        super()

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

        this._off = false;
        this._triggerCount = 0;

        this._triggerPromise = null;

        // Requires Cleanup \/
        this._manager._eventEmitter[once ? 'once' : 'on']('eventName', this._cb);
        
        this._manager._internalEventEmitter.once(`close`, this.off);
        this._manager._internalEventEmitter.once(`off`, this.off);
        this._manager._internalEventEmitter.once(`off:${this._eventName}`, this.off);
    }

    async on() {
        return this._triggerPromise = this._triggerPromise || new Promise((resolve, reject) {
            this.on('trigger', resolve);
        });
    }
    
    async on() {
        return this._triggerPromise = this._triggerPromise || new Promise((resolve, reject) {
            this.on('trigger', resolve);
        });
    }

    
    _resolve() {

    }

    trigger() {
        if (this._off) return;
        if (this._triggerLimit !== false && ++this._triggerCount >= this._triggerLimit) this.off();
        let result = this._cb.apply(null, arguments);
        this._resolve(result);
        return result;
    }

    off() {
        if (this._off) return;
        this._off = true;

        this._manager._eventEmitter.off('eventName', callback);
        this._manager._internalEventEmitter.once(`close`, this.off);
        this._manager._internalEventEmitter.once(`off`, this.off);
        this._manager._internalEventEmitter.once(`off:${this._eventName}`, this.off);
    }
}

class EventManager {
    constructor() {
        this._eventEmitter = new EventEmitter();
        this._internalEventEmitter = new EventEmitter();
    }

    on(eventName, callback, triggerLimit) {
        if(this._isClosed) return;
        return new EventHandler(this, eventName, callback, triggerLimit);
    }

    off(eventName) {
        if(this._isClosed) return;
        this._internalEventEmitter.emit(`off:${eventName}`);
    }

    close() {
        if(this._isClosed) return;
        this._isClosed = true;
        this._internalEventEmitter.emit('close')
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