class EventyHandler extends Promise {
    _promiseResolver(resolve, reject) {
        this._events.on('triggered', resolve);
        this._events.on('errored', reject);
    }
    constructor(source, internalEvents, eventName, callback, payload) {
        super(this._promiseResolver);
        
        this._eventName = eventName;
        this._callback = callback;
        this._payload = payload;

        this._events = new EventEmitter();
        this._events.on('triggered', this._callback);

        if(source) this._onAttach(source);

        this._internalEvents = internalEvents;
        this._internalEvents.on('attached', this._onAttach);
        this._internalEvents.on('detached', this._onDetach);
        this._internalEvents.once('closed', this.off);
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

class EventyView extends Eventy {
    constructor(source) {
        this._events = new EventEmitter();
        this._source = null;
        if (source) this.attach(source);
    }

    on(eventName, callback, payload) {
        return new EventyHandler(this._source, this._events, eventName, callback, payload);
    }

    trigger(payload) { 
        this._events.emit('triggered', payload);
    }

    close() {
        this._events.emit('closed');
    }

    attach(newSource) {
        if(this._source) return;
        this._source = newSource;
        this._events.on('triggered', this._source.trigger);
        this._events.emit('attached', newSource);
    }

    detach() {
        if(!this._source) return;
        let oldSource = this._source; this._source = null;
        this._events.off('triggered', oldSource.trigger);
        this._events.emit('dettached', oldSource);
    }
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
        this._events.trigger(eventName, payload);
    }

    close() {
        this._internalEvents.emit('closed');
    }
}

class EventyInterface {
    on(eventName, callback, payload) {}
    trigger(eventName, payload) {}
    close() {}
}