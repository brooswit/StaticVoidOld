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

class View {
    constructor(Class, newSource) {
        this._eventEmitter = new EventEmitter();
        this._open = true;
        this._source = null;
        this.change(newSource);

        let methods = Object.getOwnPropertyNames(Class.prototype);
        for (methodIndex in methods) {
            this[methodName] = this[methodName] || this.wrap(methods[methodIndex])
        }
    }

    wrap(methodName) {
        if(this._wrappedMethod[methodName]) return this._wrappedMethod[methodName];
        this._wrappedMethod = function () {
            if (!this.exists()) return;
            this._source[methodName].call(this._source, arguments);
        }
        wrappedMethod.name = methodName
        return wrappedMethod;
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
        this._eventEmitter.emit('source_changed');
    }

    close() {
        if(!this.isOpen()) return;
        change(null);
        this._open = false;
        this._eventEmitter.emit('closed');
    }
}

class ElementView extends View, ElementInterface {
    constructor(sourceElement) {
        super(ElementInterface, sourceElement);
        this.hook('destroyed', this.close);
        if(sourceElement) {
            this.change(sourceElement);
        }
    }

    hook(eventName, promise) {
        let eventHook = new EventHook(eventName, promise, this._sourceElement);
        this._eventEmitter.on('source_changed', eventHook.change)
        this._eventEmitter.on('view_closed', eventHook.off)
    }
}

let _nextElementId = 0;
class ElementState extends ElementInterface {
    constructor(parent) {
        this._id = _nextElementId++;
        this,_isDestroyed = false;
        this._data = {};

        this._queryEmitter = new QueryEmitter();
        this._callbackRegistry = new EventEmitter();

        this.parent = new ElementView(parent);
        this.parent.hook('destroyed', this.destroy);
        this.parent.hook('getChildren', this._getSelf);
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
