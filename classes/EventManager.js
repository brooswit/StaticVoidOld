class EventManagerInterface {
    constructor(targetEmitter) {
        this._targetEmitter = targetEmitter;
        this._emitter = new EventEmitter();
    }

    on(eventName, callback) {
        let eventHandler = this._targetEmitter.on(eventName, callback);
        this._emitter.once('close', eventHandler.off);
        return eventHandler;
    }

    once(eventName, callback) {
        let eventHandler = this._targetEmitter.once(eventName, callback);
        this._emitter.once('close', eventHandler.off);
        return eventHandler;
    }

    close() {
        this._emitter.trigger('close');
    }
}

class EventHandler extends Promise {
    constructor(eventManager, eventName, callback, context, triggerLimit = false) {
        super(on);

        this._manager = eventManager;
        this._name = eventName;
        this._cb = callback;
        this._triggerLimit = triggerLimit === true ?
            1 : typeof triggerLimit === 'number' ?
            triggerLimit : false;

        assert(this._manager instanceof EventManager);
        assert(typeof this._name === 'string');
        assert(typeof this._cb === 'function');
        assert(typeof this._triggerLimit === 'number' || typeof this._triggerLimit === 'boolean');

        this._emitter = new EventEmitter();
        this._emitterInterface = new EventManagerInterface(this._emitter);
        this._isOff = false;
        this._triggerCount = 0;

        this._eventInterface.on(
            this._emitter, 'trigger', this._handleEvent
        );
        this._eventInterface.once(
            this._emitter, `off`, this._eventInterface.close
        );

        this._eventInterface.on(
            this._manager._emitter, eventName, this.trigger
        );

        this._eventInterface.once(
            this._manager._internalEmitter, `close`, this.off
        );
        this._eventInterface.once(
            this._manager._internalEmitter, `off`, this.off
        );
        this._eventInterface.once(
            this._manager._internalEmitter, `off:${this._eventName}`, this.off
        );
    }

    _handleEvent() {
        this._cb.apply(context, arguments);
    }

    trigger() {
        if (this._isOff) return;
        if (this._triggerLimit !== false && ++this._triggerCount >= this._triggerLimit) this.off();
        return this._emitter.emit.apply(_emitter, ['trigger'].concat(arguments));
    }

    on(callback) {
        return this._manager.on.apply(this._manager, [this._name].concat(arguments));
    }

    once(callback) {
        return this._manager.once.apply(this._manager, [this._name].concat(arguments));
    }

    off() {
        if (this._isOff) return;
        this._isOff = true;
        this._emitter.on('off');
    }
}

class EventManager {
    constructor() {
        this._emitter = new EventEmitter();
        this._internalEmitter = new EventEmitter();

        this._isClosed = false;
    }

    on(eventName, callback) {
        if(this._isClosed) return;
        let eventHandler = new EventHandler(this, eventName, callback, false);
        return eventHandler;
    }

    once(eventName, callback) {
        if(this._isClosed) return;
        let eventHandler = new EventHandler(this, eventName, callback, 1);
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

EventManager.Interface = EventInterface;

module.exports = EventManager;