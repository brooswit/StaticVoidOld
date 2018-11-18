class EventHandler {
    constructor(eventManager, eventName, callback, once = false) {
        this._manager = eventManager;
        this._once = once;
        this._off = false;
        this._manager._eventEmitter[once ? 'once' : 'on']('eventName', callback);
    }

    trigger() {

        return callback.apply(null, arguments);
    }

    off() {
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