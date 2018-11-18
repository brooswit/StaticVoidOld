class EventHandler {
    constructor(eventManager, eventName, callback, once = false) {
        this._manager = eventManager;
        this._name = eventName;
        this._cb = callback;
        this._once = once;
        this._off = false;
        this.internalEmitter = 
        this._manager._eventEmitter[once ? 'once' : 'on']('eventName', this._cb);
        this._manager._internalEventEmitter.once(`close`, this.off);
        this._manager._internalEventEmitter.once(`off`, this.off);
        this._manager._internalEventEmitter.once(`off:${this._eventName}`, this.off);
    }

    trigger() {
        if (this._off) return;
        if (this._once) this.off();
        return this._cb.apply(null, arguments);
    }

    off() {
        if (this._off) return;
        this._off = true;

        this._manager._eventEmitter.off('eventName', callback);
    }
}

class EventManager {
    constructor() {
        this._eventEmitter = new EventEmitter();
        this._internalEventEmitter = new EventEmitter();
    }

    on(eventName, callback) {
        return new EventHandler(this, eventName, callback);
    }

    close() {
        this.
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