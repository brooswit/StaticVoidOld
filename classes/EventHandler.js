
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
