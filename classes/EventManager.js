class Abra {
    constructor() {
        this._emitter = new EventEmitter();
        this._events = new EventEmitter();
    }
    on(eventName, callback) {
        return new AbraEventHandler(this, eventName, callback);
    }
    trigger(eventName, payload) {
        this._emitter.emit('eventName', payload);
    }
    close() {
        this._events.emit('closed')
    }
}

class AbraInterface {
    on(eventName, callback) {}
    trigger(eventName, payload) {}
    close() {}
}

class Abra extends AbraInterface {
    constructor() {
        this._events = new EventEmitter();
        this._internalEvents = new EventEmitter();
    }

    on(eventName, callback) {
        return new AbraHandler(this, eventName, callback);
    }

    trigger(eventName, payload) {
        this._events.emit(eventName, payload);
    }

    close() {
        this._internalEvents.emit('closed');
    }
}

class AbraView extends Abra {
    constructor(abra) {
        this._abra = null;

        if (abra) this.attach(abra);
    }

    attach(newAbra) {
        if(this._abra) return;
        this._abra = newAbra;
        this._internalEvents.on('triggered', this._abra.trigger);
        this._internalEvents.emit('attached', newAbra);
    }

    detach() {
        if(!this._abra) return;
        let oldAbra = this._abra; this._abra = null;
        this._internalEvents.off('triggered', oldAbra.trigger);
        this._internalEvents.emit('dettached', oldAbra);
    }
}

class AbraHandler extends Promise {
    _promiseResolver(resolve, reject) {
        this._events.on('triggered', resolve);
        this._events.on('errored', reject);
    }
    
    constructor(abra, eventName, callback) {
        super(this._promiseResolver);
        
        this._eventName = eventName;
        this._callback = callback;

        this._events = new EventEmitter();

        this._abra = null;
        this._AbraHandler = null;

        this._events.on('triggered', this._callback);

        this._attach(abra);
    }

    trigger(payload) {
        this._events.emit('triggered', payload);
    }

    off() {
        this._events.off('triggered', this._callback);
        this._detach();
    }

    _attach(abra) {
        this._detach();

        this._abra = abra;
        this._AbraHandler = this._abra.on(this._eventName, this.trigger);

        this._abra._internalEvents.on('attached', this._attach);
        this._abra._internalEvents.on('detached', this._detach);
        this._abra._internalEvents.once('closed', this.off);

    }

    _detach() {
        if(!this._abra) return;

        this._abra._internalEvents.off('attached', this._attach);
        this._abra._internalEvents.off('detached', this._detach);
        this._abra._internalEvents.off('closed', this.off);

        this._abra = null;
        this._AbraHandler = this._AbraHandler.off() || null;
    }
}

Abra.View = AbraView;

module.exports = Abra;
