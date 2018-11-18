const EventManagerInterface = require('./EventManagerInterface');
const EventEmitter = require('events');

class EventManagerInterface {
    constructor(eventManager) {
        this._emitter = new EventEmitter();
        this.attached = null;
        if (eventManager) this.attach(eventManager);
    }

    attach(eventManager) {
        if (this.attached === eventManager) return;

        this.detach();

        this.attached = eventManager;

        this._emitter.trigger('attached');
    }

    detach() {
        if (!this.attached) return;

        this.close();
        this.attached = null;

        this._emitter.trigger('dettached');
    }

    trigger() {
        if (!this.attached) return;
        this.attached.trigger.apply(this.attached, arguments);
    }

    hook(eventName, eventManager) {
        if (!this.attached) return;
        return this.on(eventName, eventManager.trigger, eventName)
    }

    _handleHook()

    on() {
        if (!this.attached) return;
        let eventHandler = this.attached.on.apply(this.attached, arguments);
        this._emitter.once('close', eventHandler.off);
        return eventHandler;
    }

    once() {
        if (!this.attached) return;
        let eventHandler = this.attached.once.apply(this.attached, arguments);
        this._emitter.once('close', eventHandler.off);
        return eventHandler;
    }

    close() {
        this._emitter.trigger('close');
    }
}

class EventHandler extends Promise {
    constructor(emitter, internalEmitter, eventName, callback, context, triggerLimit = false, args = []) {
        super(on);
        this._isOff = false;

        this._name = eventName;
        this._cb = callback;
        this._triggerLimit = triggerLimit === true ?
            1 : typeof triggerLimit === 'number' ?
            triggerLimit : false;

        assert(typeof this._name === 'string');
        assert(typeof this._cb === 'function');
        assert(typeof this._triggerLimit === 'number' || typeof this._triggerLimit === 'boolean');

        this._context = context;

        this._triggerCount = 0;
        
        this._managerEventInterface = new EventManagerInterface(emitter);
        this._managerInternalEventInterface = new EventManagerInterface(internalEmitter);

        this._managerEventInterface.on(eventName, this.trigger);
        this._managerInternalEventInterface.once(`close`, this.off);
        this._managerInternalEventInterface.once(`off`, this.off);
        this._managerInternalEventInterface.once(`off:${this._eventName}`, this.off);
    }

    trigger() {
        if (this._isOff) return;
        if (this._triggerLimit !== false && ++this._triggerCount >= this._triggerLimit) return this.off();
        return this._cb.apply(this._context, args.concat(arguments));
    }

    off() {
        if (this._isOff) return;
        this._isOff = true;

        this._managerEventInterface.close();
        this._managerInternalEventInterface.close();
    }
}

class EventManager {
    constructor() {
        this._isClosed = false;

        this._emitter = new EventEmitter();
        this._internalEmitter = new EventEmitter();
    }

    trigger(eventName) {
        if(this._isClosed) return;
        return this._emitter.emit(eventName);
    }

    on(eventName, callback) {
        if(this._isClosed) return;
        let eventHandler = new EventHandler(this._emitter, this._internalEmitter, eventName, callback, false, Array.prototype.slice.call(arguments, 2));
        return eventHandler;
    }

    once(eventName, callback) {
        if(this._isClosed) return;
        let eventHandler = new EventHandler(this._emitter, this._internalEmitter, eventName, callback, 1, Array.prototype.slice.call(arguments, 2));
        return eventHandler;
    }

    off(eventName) {
        if(this._isClosed) return;
        this._internalEmitter.emit(`off:${eventName}`);
    }

    close() {
        if(this._isClosed) return;
        this._isClosed = true;
        this._internalEmitter.emit('close');
    }
}

EventManager.Interface = EventManagerInterface;

module.exports = EventManager;