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


class ElementInterface {
    setParent(newParent) {}
    destroy() {}
    parent() {}
    root() {}
    hook(eventName, promise) {}
    async trigger(eventName, payload) {}
}

class ElementView extends ElementInterface {
    constructor(sourceElement) {
        super();
        this._eventEmitter = new EventEmitter();
        this._sourceElement = sourceElement;
        this.hook('destroyed', this.setSource);
    }

    hook(eventName, promise) {
        let eventHandler = null;
        if (this._sourceElement) {
            eventHandler = rehook(null, this._sourceElement)
        }
        this._eventEmitter.on('sourceChanged', rehook);
        function rehook(oldSource, newSource)
    }
}

let _nextElementId = 0;
class ElementState extends ElementInterface {
    constructor() {
        this._id = _nextElementId++;
        this,_isDestroyed = false;
        this._data = {};

        this._parentView = new ElementView();
        this._parentView.hook('destroyed', this.destroy);
        this._parentView.hook('getChildren', this._getSelf);

        this._queryEmitter = new QueryEmitter();
        this._callbackRegistry = new EventEmitter();
    }

    async _getSelf() {
        return this;
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

    setParent(newParent) {
        if (this._isDestroyed) return;
        if (this._parentView._sourceElement === newParent) return;
        if (this._hasLoopWithParent(newParent)) return;

        let oldParent = this._parent;
        this._parent = newParent;
        this.parentView.setSource(this._parent);

        this.trigger('newParent', newParent, oldParent);
    }

    destroy() {
        if (this._isDestroyed) return;
        this.setParent(null);
        this._isDestroyed = true;
        this.trigger('destroyed');
    }

    hook(eventName, callback) {
        return new EventHandler(this, eventName, callback);
    }

    async trigger(eventName, payload) {
        return await this._queryEmitter.query(eventName, payload);
    }
}

class Element extends ElementView {
    constructor(parent) {
        super(new ElementState(parent));
    }
}

Element.View = ElementView;
