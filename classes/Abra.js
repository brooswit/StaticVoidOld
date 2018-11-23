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

// class ElementInterface {
//     changeParent(newParent) {
//         throw(arguments.callee.name + " not defined");
//     }
//     destroy() {
//         throw(arguments.callee.name + " not defined");
//     }
//     parent() {
//         throw(arguments.callee.name + " not defined");
//     }
//     root() {
//         throw(arguments.callee.name + " not defined");
//     }
//     hook(eventName, promise) {
//         throw(arguments.callee.name + " not defined");
//     }
//     async trigger(eventName, payload) {
//         throw(arguments.callee.name + " not defined");
//     }
// }

class View {
    constructor(Class, newSource) {
        this._eventEmitter = new EventEmitter();
        this._wrappedMethods = {};
        this._open = true;
        this.source = null;
        this.change(newSource);

        let methods = Object.getOwnPropertyNames(Class.prototype);
        for (methodIndex in methods) {
            this[methodName] = this[methodName] || this.wrap(methods[methodIndex])
        }
    }

    wrap(methodName) {
        if(this._wrappedMethods[methodName]) return this._wrappedMethods[methodName];
        this._wrappedMethods[methodName] = function () {
            if (!this.exists()) return null;
            this.source[methodName].call(this.source, arguments);
        }
        this._wrappedMethods[methodName].name = methodName
        return this._wrappedMethods[methodName];
    }

    isOpen() {
        return this._open;
    }

    exists() {
        return this.isOpen() && !!this.source;
    }

    change(newSource = null) {
        if (!this.isOpen() || this.source === newSource) return;
        this.source = newSource;
        this._eventEmitter.emit('source_changed');
    }

    close() {
        if(!this.isOpen()) return;
        change(null);
        this._open = false;
        this._eventEmitter.emit('closed');
    }
}

class ElementEventHook extends View {
    // _capturePromiseResolution(resolve, reject) {
    //     this._resolve = resolve;
    //     this._reject = reject;
    // }

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

class ElementEventHook {
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

class ElementQueryHook {
    constructor(element, eventName, callback) {
        let queryEmitter =
        element.element()._queryEmitter.when(eventName, callback);
        element._internalEvents.on('closed', ()=>{
            
        })
        element._internalEvents.on('source_changed', ()=>{
            
        })
    }
}

class ElementView extends View {
    constructor(sourceElement) {
        super(Element, sourceElement);
        this.hook('destroyed', this.close);
    }

    hook(eventName, callback) {
        return new ElementEvenElementQueryHooktHook(this, eventName, callback);
    }
}

let _nextElementId = 0;
class Element {
    constructor(initialParent) {
        this._id = _nextElementId++;

        this._queryEmitter = new QueryEmitter();
        this._internalEvents = new EventEmitter();
        this._callbackRegistry = new CallbackRegistry();
        this._data = {};

        this._isDestroyed = false;

        this._parent = new ElementView(initialParent);
        this._parent.hook('destroyed', this.destroy);
        this._parent.hook('get_children', this._getThis);
    }

    async _getThis() {
        return this;
    }

    view() {
        return new ElementView(this.element());
    }

    hook(eventName, callback) {
        return new ElementQueryHook(this, eventName, callback);
    }

    async trigger(eventName, payload) {
        return await this._queryEmitter.query(eventName, payload);
    }

    element() {
        return this;
    }

    parent() {
        if (this._isDestroyed) return null;
        return this._parent.element();
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
        if (this._parent.element() === newParent) return;

        let oldParent = this._parent.element();
        this._parent.change(newParent);

        this.trigger('parent_changed', newParent, oldParent);
    }

    destroy() {
        if (this._isDestroyed) return;
        this.close();
        this._isDestroyed = true;
        this.trigger('destroyed');
    }
}

Element.View = ElementView;
