class abraInterface {
    on(eventName, callback) {}
    trigger(eventName, payload) {}
    close() {}
}


class abra extends abraInterface {
    constructor() {
        this._events = new EventEmitter();
        this._internalEvents = new EventEmitter();
    }

    on(eventName, callback) {
        return new abraHandler(this, eventName, callback);
    }

    trigger(eventName, payload) {
        this._events.emit(eventName, payload);
    }

    close() {
        this._internalEvents.emit('closed');
    }
}

class abraView extends abra {
    constructor(abra) {
        this._abra = null;

        if (abra) this.attach(abra);
    }

    attach(newabra) {
        if(this._abra) return;
        this._abra = newabra;
        this._internalEvents.on('triggered', this._abra.trigger);
        this._internalEvents.emit('attached', newabra);
    }

    detach() {
        if(!this._abra) return;
        let oldabra = this._abra; this._abra = null;
        this._internalEvents.off('triggered', oldabra.trigger);
        this._internalEvents.emit('dettached', oldabra);
    }
}

class abraHandler extends Promise {
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
        this._abraHandler = null;

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
        this._abraHandler = this._abra.on(this._eventName, this.trigger);

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
        this._abraHandler = this._abraHandler.off() || null;
    }
}