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

class ElementInterface {
    changeParent(newParent) {
        throw(arguments.callee.name + " not defined");
    }
    destroy() {
        throw(arguments.callee.name + " not defined");
    }
    parent() {
        throw(arguments.callee.name + " not defined");
    }
    root() {
        throw(arguments.callee.name + " not defined");
    }
    hook(eventName, promise) {
        throw(arguments.callee.name + " not defined");
    }
    async trigger(eventName, payload) {
        throw(arguments.callee.name + " not defined");
    }
}

class View extends EventEmitter {
    constructor(Class, newSource) {
        this._wrappedMethods = {};
        this._open = true;
        this._source = null;
        this.change(newSource);

        let methods = Object.getOwnPropertyNames(Class.prototype);
        for (methodIndex in methods) {
            this[methodName] = this[methodName] || this.wrap(methods[methodIndex])
        }
    }

    wrap(methodName) {
        if(this._wrappedMethods[methodName]) return this._wrappedMethods[methodName];
        this._wrappedMethods[methodName] = function () {
            if (!this.exists()) return;
            this._source[methodName].call(this._source, arguments);
        }
        this._wrappedMethods[methodName].name = methodName
        return this._wrappedMethods[methodName];
    }

    isOpen() {
        return this._open;
    }

    exists() {
        return this.isOpen() && !!this._source;
    }

    change(newSource = null) {
        if (!this.isOpen() || newSource === this._sourceElement) return;
        this._sourceElement = newSource;
        this.emit('source_changed');
    }

    close() {
        if(!this.isOpen()) return;
        change(null);
        this._open = false;
        this.emit('closed');
    }
}

class ElementViewHook extends View, CallbackRegistry, Promise {
    _capturePromiseResolution(resolve, reject) {
        this._resolve = resolve;
        this._reject = reject;
    }

    constructor(initialElementView, eventName, promise) {
        super(this._capturePromiseResolution);
        this._elementView = null;
        this._eventName = eventName;
        this._promise = promise;

        this._elementView.when(this._eventName, this.trigger);
        this._elementView.register('destroyed', this.off);
        this.register('triggered', this._promise);
        this.register('triggered', this._resolve);
        this.register('errored',  this._reject);
    }

    async trigger(payload) {
        return await this.fire('triggered', payload);
    }

    off() {
        this._abra._queryEmitter.stop(this._eventName, this.trigger);
        this._abra._callbackRegistry.unregister('destroyed', this.off);
        this.unregister('triggered');
        this.unregister('triggered');
        this.unregister('errored');
    }
}

class ElementViewHook {
    constructor(initialElementView, eventName, promise) {
        this._elementView = null;
        this._change(initialElementView);
        this._elementView.hook(eventName, promise);
        function change(newElementView) {
        }
    }

    _change(newElementView) {
        this.off();
        this._elementView = newElementView;
        this._elementView.on('source_changed', _change)
        this._elementView.on('view_closed', this.off);
    }

    off() {
        if(!this._elementView) return;
        this._elementView.off('source_changed', change)
        this._elementView.off('view_closed', this.off);
    }
}

class ElementView extends View, ElementInterface {
    constructor(sourceElement) {
        super(ElementState, sourceElement);
        this.hook('destroyed', this.close);
    }

    hook(eventName, promise) {
        new ElementViewHook(this, eventName, promise);
    }
}

let _nextElementId = 0;
class ElementState extends ElementInterface {
    constructor(initialParent) {
        this._id = _nextElementId++;

        this._queryEmitter = new QueryEmitter();
        this._callbackRegistry = new CallbackRegistry();
        this._data = {};

        this,_isDestroyed = false;

        this.parent = new ElementView(initialParent);
        this.parent.hook('destroyed', this.destroy);
        this.parent.hook('get_children', this._getThis);
    }

    async _getThis() {
        return this;
    }

    _detectLoopWith(newParent) {
        let hasLoop = false;
        let oldParent = this._parent.source;
        let elementA, elementB = this;

        this.parent 
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

    root() {
        let element = this;
        while (element.parent()) {
            element = element.parent();
        }
        return element;
    }

    changeParent(newParent) {
        if (this._isDestroyed) return;
        if (this.parent._sourceElement === newParent) return;
        if (this._hasLoopWithParent(newParent)) return;

        let oldParent = this._parent;
        this._parent = newParent;
        this.parent.change(this._parent);

        this.trigger('newParent', newParent, oldParent);
    }

    destroy() {
        if (this._isDestroyed) return;
        this.parent.close();
        this._isDestroyed = true;
        this.trigger('destroyed');
    }

    hook(eventName, callback) {
        return new ElementEventHook(this, eventName, callback);
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
