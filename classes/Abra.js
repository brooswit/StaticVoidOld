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
        this._abra._callbackRegistry.register('destroyed', this.off);
        this._callbackRegistry.register('triggered', this._callback);
        this._callbackRegistry.register('triggered', this._resolve);
        this._callbackRegistry.register('errored',  this._reject);
    }

    async trigger(payload) {
        return await this._callbackRegistry.fire('triggered', payload);
    }

    off() {
        this._abra._queryEmitter.stop(this._eventName, this.trigger);
        this._abra._callbackRegistry.unregister('destroyed', this.off);
        this._callbackRegistry.unregister('triggered');
        this._callbackRegistry.unregister('triggered');
        this._callbackRegistry.unregister('errored');
    }
}

class View extends Abra {
    constructor(abra) {
        super();
        this._abra = abra;
        this._abra._callbackRegistry.register('destroyed', this.destroy);
        this._queryEmitter = this._abra._queryEmitter;
    }
    destroy() {
        super.destroy();
        this._abra._callbackRegistry.unregister('destroyed', this.destroy);
    }
}

let _nextElementId = 0;
class Element {
    constructor(parent) {
        this._id = _nextElementId++;
        this._parent = null;
        this,_isDestroyed = false;

        this._queryEmitter = new QueryEmitter();
        this._callbackRegistry = new EventEmitter();

        this.parentView = new ElementView();
        this.parentView.hook('destroyed', this.destroy);
        this.parentView.hook('getChildren', this._getSelf);

        this.attach(parent);
    }
    async _getSelf() {
        return this;
    }
    attach(newParent) {
        if (this._isDestroyed) return;
        if (this._parent === newParent) return;
        if (this._detectLoopWith(newParent)) return;

        if (this._parent) this.detach();

        this._parent = newParent;
        this.parentView.trigger('childRe')
        this.parentView.setTarget(this._parent);

        this.trigger('attached');
    }
    hook(eventName, callback) {
        return new EventHandler(this, eventName, callback);
    }
    async trigger(eventName, payload) {
        return await this._queryEmitter.query(eventName, payload);
    }
    destroy() {
        this,_isDestroyed = true;
        this._callbackRegistry.fire('destroyed');
    }
}

Abra.View = View;
