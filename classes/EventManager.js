class EventyInterface {
    on(eventName, callback, payload) {}
    trigger(eventName, payload) {}
    close() {}
}


class Eventy extends EventyInterface {
    constructor() {
        this._events = new EventEmitter();
        this._internalEvents = new EventEmitter();
    }

    on(eventName, callback, payload) {
        return new EventyHandler(this._events, this._internalEvents, eventName, callback, payload);
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


class EventyHandler extends Promise, EventyInterface {
    _promiseResolver(resolve, reject) {
        this._events.on('triggered', resolve);
        this._events.on('errored', reject);
    }
    constructor(source, internalEvents, eventName, callback) {
        super(this._promiseResolver);
        
        this._eventName = eventName;
        this._callback = callback;

        this._events = new EventEmitter();
        this._events.on('triggered', this._callback);

        if(source) this._onAttach(source);

        this._internalEvents = internalEvents;
        this._internalEvents.on('attached', this._onAttach);
        this._internalEvents.on('detached', this._onDetach);
        this._internalEvents.once('closed', this.off);
    }

    on(callback) {
        return new EventyHandler(this._events, this._internalEvents, this._eventName, callback);
    }

    trigger(payload) {
        this._events.emit('triggered', payload);
    }

    off() {
        this._onDetach();
        this._internalEvents.off('attached', this._onAttach);
        this._internalEvents.off('detached', this._onDetach);
        this._events.off('triggered', this._callback);
    }
    _onAttach(source) {
        this._onDetach();
        this.eventyHandler = source.on(this._eventName, this.trigger, this._payload);
    }
    _onDetach() {
        if(!this.eventyHandler) return;
        this.eventyHandler.off();
    }
}