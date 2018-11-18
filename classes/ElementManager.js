const EventManager = require('./EventManager');
const Controller = require('./Controller');

module.exports = class ElementManager extends EventManager {
    constructor (Controllers=[], startId=0) {
        this._Controllers = Controllers;
        this._id = startId;
    }

    buildElement(controllerNames=[], state={}) {
        let newElement = new Element(this, state);
        for(controllerIndex in controllerNames) {
            let controllerName = controllerNames[controllerIndex];
            newElement.addController(controllerName);
        }
        this.trigger('newElement', newElement);
        return newElement;
    }

    registerController(Controller) {
        this._Controllers[Controller.name] = Controller;
    }

    attachController(element, controllerName, state) {
        let newController = new (this._Controllers[controllerName] || Controller)(element, this._id++, state);
        this.trigger('newController', newController);
        this.trigger(`new${controllerName}`, newController);
        return newController;
    }
}

class Element extends EventEmitter {
    constructor(manager, id, state = {}) {
        this._id = id;
        this._state = state;
        this._manager = manager;
        this._controllers = {};
    }

    addController(controllerName, state={}) {
        if (this.hasController(controller)) return;
        this._controllers[controllerName] = manager.attachController(this, controllerName, state)
    }

    removeController(controllerName) {
        if (!this.hasController(controller)) return;
        this._controllers[controllerName].destroy()
        this._controllers[controllerName] = null
    }

    destroy() {
        this.emit('destroy');
    }

    async getSnapshot(snapshot = {}) {
        this.emit('snapshot', snapshot);
        return snapshot;
    }
}
