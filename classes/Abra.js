class CallbackRegistry {
    constructor() {
        this._callbacks = {};
    }

    register(callbackName, callback) {
        if (!callback) {
            unregister(callbackName);
            return;
        }
        this._callbacks[callbackName] = callback;
    }

    unregister(callbackName) {
        delete this._callbacks[callbackName];
    }

    fire(callbackName, payload) {
        if (this._callbacks[callbackName]) {
            this._callbacks[callbackName](payload);
        }
    }
}

class QueryEmitter {
    constructor() {
        this._emitter = new EventEmitter();
        this._lookupHandlerByPromise = {};
    }

    stop(event, promise) {
        const handleResult = this._lookupHandlerByPromise[promise];
        this._emitter.off(event, handleResult);
        delete this._lookupHandlerByPromise[promise];
    }

    when(event, promise) {
        const handleResult = this._lookupHandlerByPromise[promise] = async (provisionIndex, handleResult, payload) => {
            let index = provisionIndex();
            let result, error;
            try {
                result = await promise(payload);
            } catch(err) {
                error = err;
            }
            handleResult(index, error, result);
        };
        this._emitter.on(event, handleResult);
    }

    query(eventName, payload) {
        return new Promise((resolve, reject) => {
            let results = [];
            let errors = [];
            let errored = false;

            function provisionIndex() {
                let index = results.length-1;
                results.push(undefined);
                errors.push(undefined);
                return index;
            }

            function handleResult(index, error, result) {
                errored = errored || !!error;
                results[index] = result;
                errors[index] = error;
                for(resultIndex in results) {
                    if(!results[resultIndex]) return;
                }
                errors = errored ? errors : null;
                resolve(errors, results);
            }

            this._emitter.emit(eventName, provisionIndex, handleResult, payload);
        });
    }
}
class EventHandler extends promise {
    _capturePromiseResolution(resolve, reject) {
        this._resolve = resolve;
        this._reject = reject;
    }

    constructor(abra, eventName, callback) {
        super(this._capturePromiseResolution);
        this._abra = abra;
        this._eventName = eventName;
        this._callback = callback;

        this._callbackRegistry = new CallbackRegistry();

        this._abra._queryEmitter.when(this._eventName, this.trigger);
        this._abra._callbackRegistry.register('closed', this.off);
        this._callbackRegistry.register('triggered', this._callback);
        this._callbackRegistry.register('triggered', this._resolve);
        this._callbackRegistry.register('errored',  this._reject);
    }

    async trigger(payload) {
        return await this._callbackRegistry.fire('triggered', payload);
    }

    off() {
        this._abra._queryEmitter.stop(this._eventName, this.trigger);
        this._abra._callbackRegistry.unregister('closed', this.off);
        this._callbackRegistry.unregister('triggered');
        this._callbackRegistry.unregister('triggered');
        this._callbackRegistry.unregister('errored');
    }
}

class View extends Abra {
    constructor(abra) {
        super();
        this._abra = abra;
        this._abra._callbackRegistry.register('closed', this.close);
        this._queryEmitter = this._abra._queryEmitter;
    }
    close() {
        super.close();
        this._abra._callbackRegistry.unregister('closed', this.close);
    }
}

class Abra {
    constructor() {
        this._queryEmitter = new QueryEmitter();
        this._callbackRegistry = new EventEmitter();
    }
    hook(eventName, callback) {
        return new EventHandler(this, eventName, callback);
    }
    async trigger(eventName, payload) {
        return await this._queryEmitter.query(eventName, payload);
    }
    close() {
        this._callbackRegistry.fire('closed');
    }
}

Abra.View = View;

module.exports = Abra;

const Abra = require('./Abra');
let nextId = 0;

module.exports = class Element extends Abra {
    constructor(parent) {
        super();
        this.id = nextId++;
        this.parentView = new Abra.View(parent);
        this.state = {};
        this._parent = null;
        this._isDestroyed = false;ß

        if (parent) this.attach(parent);
    }

    parent() {
        return this._parent;
    }

    root() {
        let element = this;
        while (element.parent()) {
            element = element.parent();
        }
        return element;
    }

    _detectLoopWith(newParent) {
        let hasLoop = false;
        let oldParent = this._parent;
        let elementA, elementB = this;

        this._parent = newParent;
        
        while (elementB) {
            elementA = elementA.parent();
            elementB = elementB && elementB.parent() && elementB.parent().parent();
            if (elementA === elementB) {
                hasLoop = true;
                break;
            }
        }
        this._parent = oldParent;
        return hasLoop;
    }

    attach(newParent) {
        if (this._isDestroyed) return;
        if (this._parent === newParent) return;
        if (this._detectLoopWith(newParent)) return;
        this.detach();

        this._parent = newParent;
        this.parentView.attach(this._parent);

        this.trigger('attached');
    }

    detach() {
        if (this._isDestroyed) return;
        if (!this._parent) return;

        this._parent = null;
        this.parentView.detach();

        this.trigger('dettached');
    }

    destroy() {
        if (this._isDestroyed) return;
        this.detach();
        this._isDestroyed = true;
        this.trigger('destroyed');
        this.close();
    }

    snapshot(snapshot) {
        if (this._isDestroyed) return;
        this.trigger('snapshot', snapshot);
    }
}
