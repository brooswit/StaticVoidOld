class EventHandler {
    constructor(eventEmitter) {
        this._eventEmitter = eventEmitter;
        this._callbackIndex = this._eventEmitter._nextCallbackIndex ++;
        this._callbackLookup[this._callbackIndex] = this
    }
}

class EventEmitter {
    constructor() {
        this._nextCallbackIndex = 0;
        this._callbackLookup = {};
        this._eventLookup = {}
    }

    on(eventName, callback) {
        return new Promise((resolve, reject) => {
            this._events[eventName]
        });
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