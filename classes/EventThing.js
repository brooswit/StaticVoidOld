function capitalize(str) {
    return str.charAt(0).toUpperCase() + name.slice(1)
}
function the(subject) {
    return {is: {
        a: (Class) {
            let type = capitalize(typeof subject);
            if (type === "Object") {
                
            }
        },
        not {
            a
        }
    }}
}
class EventHandler {
    constructor(eventManager, eventName, callback, triggerLimit) {
        this._manager = eventManager;
        this._name = eventName;
        this._cb = callback;
        this._triggerLimit = triggerLimit === true ?
            1 : typeof triggerLimit === 'number' ?
            triggerLimit : false;

        assert(this._manager instanceof EventManager);
        assert(typeof this._name === 'string');
        assert(typeof this._cb === 'function');
        assert(the(this._triggerLimit).is.a(Number).or.a(Boolean)));
        assert(typeof this._triggerLimit === 'number' || typeof this._triggerLimit === 'boolean');

        this._off = false;
        this._triggerCount = 0;

        this._emitter = this._manager._eventEmitter;
        this._internalEmitter = this._manager._internalEventEmitter;

        // Requires Cleanup \/
        this._emitter[once ? 'once' : 'on']('eventName', this._cb);
        
        this._internalEmitter.once(`close`, this.off);
        this._internalEmitter.once(`off`, this.off);
        this._internalEmitter.once(`off:${this._eventName}`, this.off);
    }

    trigger() {
        if (this._off) return;
        if (++this._triggerCount >= this._triggerLimit) this.off();
        return this._cb.apply(null, arguments);
    }

    off() {
        if (this._off) return;
        this._off = true;

        this._emitter.off('eventName', callback);
        this._internalEmitter.once(`close`, this.off);
        this._internalEmitter.once(`off`, this.off);
        this._internalEmitter.once(`off:${this._eventName}`, this.off);
    }
}

class EventManager {
    constructor() {
        this._eventEmitter = new EventEmitter();
        this._internalEventEmitter = new EventEmitter();
    }

    on(eventName, callback, triggerLimit) {
        return new EventHandler(this, eventName, callback, triggerLimit);
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