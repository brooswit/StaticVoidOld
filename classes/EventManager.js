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
    constructor(Abra) {
        this._Abra = null;

        if (Abra) this.attach(Abra);
    }

    attach(newAbra) {
        if(this._Abra) return;
        this._Abra = newAbra;
        this._internalEvents.on('triggered', this._Abra.trigger);
        this._internalEvents.emit('attached', newAbra);
    }

    detach() {
        if(!this._Abra) return;
        let oldAbra = this._Abra; this._Abra = null;
        this._internalEvents.off('triggered', oldAbra.trigger);
        this._internalEvents.emit('dettached', oldAbra);
    }
}

class AbraHandler extends Promise {
    _promiseResolver(resolve, reject) {
        this._events.on('triggered', resolve);
        this._events.on('errored', reject);
    }
    
    constructor(Abra, eventName, callback) {
        super(this._promiseResolver);
        
        this._eventName = eventName;
        this._callback = callback;

        this._events = new EventEmitter();

        this._Abra = null;
        this._AbraHandler = null;

        this._events.on('triggered', this._callback);

        this._attach(Abra);
    }

    trigger(payload) {
        this._events.emit('triggered', payload);
    }

    off() {
        this._events.off('triggered', this._callback);
        this._detach();
    }

    _attach(Abra) {
        this._detach();

        this._Abra = Abra;
        this._AbraHandler = this._Abra.on(this._eventName, this.trigger);

        this._Abra._internalEvents.on('attached', this._attach);
        this._Abra._internalEvents.on('detached', this._detach);
        this._Abra._internalEvents.once('closed', this.off);

    }

    _detach() {
        if(!this._Abra) return;

        this._Abra._internalEvents.off('attached', this._attach);
        this._Abra._internalEvents.off('detached', this._detach);
        this._Abra._internalEvents.off('closed', this.off);

        this._Abra = null;
        this._AbraHandler = this._AbraHandler.off() || null;
    }
}