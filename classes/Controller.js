const EventManager = require('./EventManager');

module.exports = class Controller extends EventManager.Interface {
    constructor(element) {
        super(element);
        this._element = element;
        this.globalEvents = new EventManager.Interface(this._element.globalEvents);
        this.state = this._element.state;

        this._isRemoved = false;

        this.on('destroy', this.remove);
        this.on('snapshot', this.snapshot);

        this._state = state;
    }

    getElement() {
        return this._isRemoved ? null : this._element;
    }

    remove() {
        if(!this.getElement()) return;
        this._isRemoved = true;
        this.globalEvents.close();
        this.close();
    }

    snapshot(snapshot) {}

    addController() {
        if(!this.getElement()) return;
        return this._element.addController.apply(this._element, arguments);
    }
    removeController() {
        if(!this.getElement()) return;
        return this._element.removeController.apply(this._element, arguments);
    }
    destroy() {
        if(!this.getElement()) return;
        return this._element.destroy.apply(this._element, arguments);
    }
    on() {
        if(!this.getElement()) return;
        return this._elementEventInterface.on.apply(this._elementEventInterface, arguments);
    }
    off() {
        if(!this.getElement()) return;
        return this._elementEventInterface.off.apply(this._elementEventInterface, arguments);
    }
    trigger() {
        if(!this.getElement()) return;
        return this._elementEventInterface.trigger.apply(this._elementEventInterface, arguments);
    }
}
