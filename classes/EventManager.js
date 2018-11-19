class EventyInterface {
    on(eventName, callback) {}
    trigger(eventName, payload) {}
    close() {}
}


class Eventy extends EventyInterface {
    constructor() {
        this._events = new EventEmitter();
        this._internalEvents = new EventEmitter();
    }

    on(eventName, callback) {
        return new EventyHandler(this, eventName, callback);
    }

    trigger(eventName, payload) {
        this._events.emit(eventName, payload);
    }

    close() {
        this._internalEvents.emit('closed');
    }
}

class EventyView extends Eventy {
    constructor(eventy) {
        this._eventy = null;

        if (eventy) this.attach(eventy);
    }

    attach(newEventy) {
        if(this._eventy) return;
        this._eventy = newEventy;
        this._internalEvents.on('triggered', this._eventy.trigger);
        this._internalEvents.emit('attached', newEventy);
    }

    detach() {
        if(!this._eventy) return;
        let oldEventy = this._eventy; this._eventy = null;
        this._internalEvents.off('triggered', oldEventy.trigger);
        this._internalEvents.emit('dettached', oldEventy);
    }
}

class EventyHandler extends Promise {
    _promiseResolver(resolve, reject) {
        this._events.on('triggered', resolve);
        this._events.on('errored', reject);
    }
    
    constructor(eventy, eventName, callback) {
        super(this._promiseResolver);
        
        this._eventy = null;
        this._eventName = eventName;
        this._callback = callback;

        this._events = new EventEmitter();
        this._events.on('triggered', this._callback);

        this._attach(eventy);

        this._eventyHandler = null;
    }

    trigger(payload) {
        this._events.emit('triggered', payload);
    }

    off() {
        this._events.off('triggered', this._callback);
        this._detach();
    }

    _attach(eventy) {
        this._detach();

        this._eventy = eventy;
        this._eventyHandler = this._eventy.on(this._eventName, this.trigger);

        this._eventy._internalEvents.on('attached', this._attach);
        this._eventy._internalEvents.on('detached', this._detach);
        this._eventy._internalEvents.once('closed', this.off);

    }

    _detach() {
        if(!this._eventy) return;

        this._eventy._internalEvents.off('attached', this._attach);
        this._eventy._internalEvents.off('detached', this._detach);
        this._eventy._internalEvents.off('closed', this.off);

        this._eventyHandler.off();

        this._eventyHandler = null;
        this._eventy = null;
    }
}