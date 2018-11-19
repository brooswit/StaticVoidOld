class EventHandler {
    constructor(abra, eventName, callback) {
        this._abra = abra;
        this._eventName = eventName;
        this._callback = callback;

        this._events = new EventEmitter();

        this._abra._eve.on(this._eventName, this.trigger);
        this._abra._emitter.on(this._eventName, this.trigger);
        this._events.on('triggered', this._callback);
    }

    trigger(payload) {
        this.emit('triggered', payload);
    }

    off() {
        this._abra._emitter.off(this._eventName, this.trigger);
        this._events.off('triggered', this._callback);
    }
}

class View extends Abra {
    constructor(abra) {
        super();
        this._source = abra;
        this._source._events.once('closed', this.close);
        this._emitter = this._source._emitter;
    }

    on(eventName, callback) {
        let eventHandler = super.on(eventName, callback);
        this._events.once('closed', eventHandler.off);
        return eventHandler;
    }
}

class Abra {
    constructor() {
        this._emitter = new EventEmitter();
        this._events = new EventEmitter();
    }
    on(eventName, callback) {
        return new EventHandler(this, eventName, callback);
    }
    trigger(eventName, payload) {
        this._emitter.emit('eventName', payload);
    }
    close() {
        this._events.emit('closed')
    }
}

Abra.View = View;

module.exports = Abra;

