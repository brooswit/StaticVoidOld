class EventHandler {
    constructor(eventManager, eventName, callback) {

        this._eventEmitter = eventEmitter;
        this._eventHandlerIndex = this._eventEmitter._nextEventHandlerIndex ++;
        this._eventEmitter._eventHandlerIndexLookup[this._eventHandlerIndex] = this;
        this._eventEmitter._eventLookup[eventName]
    }

    off() {

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