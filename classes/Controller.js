const EventManager = require('./EventManager');

module.exports = class Controller extends EventManager {
    constructor(manager, element, state = {}) {
        this._isRemoved = false;

        this._manager = manager;
        this._element = element;
        this._elementEventInterface = new EventManager.Interface(element);
        this,_elementEventInterface.on('destroy', this.remove);
        this,_elementEventInterface.on('snapshot', this.snapshot);

        this._state = state;
    }

    getElement() {
        return this._isRemoved ? null : this._element;
    }

    remove() {
        if(!this.getElement()) return;
        this._elementEventInterface.close();
        this._isRemoved = true;
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
