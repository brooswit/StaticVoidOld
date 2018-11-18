class EventEmitter {
    constructor() {
        
    }

    on(eventName, callback) {
        return new Promise((resolve, reject) => {

        }
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