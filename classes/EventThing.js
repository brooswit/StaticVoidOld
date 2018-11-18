class EventHandler {
    constructor(eventEmitter, eventName, callback) {
        this._eventEmitter = eventEmitter;
        this._eventHandlerIndex = this._eventEmitter._nextEventHandlerIndex ++;
        this._eventHandlerIndexLookup[this._eventHandlerIndex] = this;
        this._eventLookup[eventName]
    }
}

class EventEmitter {
    constructor() {
        this._nextEventHandlerIndex = 0;
        this._eventHandlerLookup = {};
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