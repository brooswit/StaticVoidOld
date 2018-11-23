// class CallbackRegistry {
//     constructor() {
//         this._callbacks = {};
//     }

//     register(callbackName, callback) {
//         if (!callback) {
//             unregister(callbackName);
//             return;
//         }
//         this._callbacks[callbackName] = callback;
//     }

//     unregister(callbackName) {
//         delete this._callbacks[callbackName];
//     }

//     fire(callbackName, payload) {
//         if (this._callbacks[callbackName]) {
//             this._callbacks[callbackName](payload);
//         }
//     }
// }

class QueryRequester {
    constructor() {
        this._events = new EventEmitter();
        this._lookupHandlerByPromise = {};
    }

    stop(event, promise) {
        const handleResult = this._lookupHandlerByPromise[promise];
        this._events.off(event, handleResult);
        delete this._lookupHandlerByPromise[promise];
    }

    when(requestName, promise) {
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
        this._events.on(requestName, handleResult);
    }

    request(requestName, payload) {
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

            this._events.emit(requestName, provisionIndex, handleResult, payload);
        });
    }
}

class ElementQueryHook {
    constructor(elementView, eventName, promise) {
        this._elementView = elementView;
        this._eventName = eventName;
        this._promise = promise;
        
        this._source = null;

        this._elementView._internalEvents.on('source_changed', this._onElementViewSourceChanged);
        this._elementView._internalEvents.on('closed', this._onElementViewClosed);

        this._onElementViewSourceChanged(null, source);
    }

    _isClosed() {
        return !this._elementView;
    }

    _onElementViewSourceChanged(newSource) {
        if(this._source) {
            this._source.element()._queryRequester.stop(this._eventName, this._promise);
        }
        if(newSource) {
            newSource.element()._queryRequester.when(this._eventName, this._promise);
        }
        this._source = newSource;
    }

    _onElementViewClosed() {
        this._elementView._internalEvents.off('source_changed', this._onElementViewSourceChanged);
        this._elementView._internalEvents.off('closed', this._onElementViewClosed);
        this._elementView = null;
        _onElementViewSourceChanged(null);
    }

    off() {
        if(_isClosed()) return;
        this._onElementViewClosed();
    }
}

class View {
    constructor(Class, newSource) {
        this._internalEvents = new EventEmitter();
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
        }.bind(this);
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
        let oldSource = this.source;
        this.source = newSource;
        this._internalEvents.emit('source_changed', {newSource, oldSource});
    }

    close() {
        if(!this.isOpen()) return;
        change(null);
        this._open = false;
        this._internalEvents.emit('closed');
    }
}

class ElementView extends View {
    constructor(sourceElement) {
        super(Element, sourceElement);
        this.hook('destroyed', this.close);
    }

    hook(eventName, callback) {
        return new ElementQueryHook(this, eventName, callback);
    }
}

let _nextElementId = 0;
class Element {
    constructor(initialParent) {
        this._id = _nextElementId++;

        this._queryRequester = new QueryRequester();
        this._internalEvents = new EventEmitter();
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
        return await this._queryRequester.request(eventName, payload);
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

        this.trigger('parent_changed', {newParent, oldParent});
    }

    destroy() {
        if (this._isDestroyed) return;
        this.parent.close();
        this._isDestroyed = true;
        this.trigger('destroyed');
        this._internalEvents.emit('closed');
    }
}

Element.View = ElementView;
