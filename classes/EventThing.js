class EventHandler {
    constructor(eventEmitter, eventName, callback) {
        this._eventEmitter = eventEmitter;
        this._ceventHandlerIndex = this._eventEmitter._nextCeventHandlerIndex ++;
        this._ceventHandlerLookup[this._ceventHandlerIndex] = this;
        this._eventLookup[eventName]
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