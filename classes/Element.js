const EventEmitter = require('events');

module.exports = class ElementFactory {
    constructor (staticVoid, Controllers=[], startId=0) {
        this._staticVoid = staticVoid;
        this._Controllers = Controllers;
        this._id = startId;
    }

    buildElement(state={}, controllers=[]) {
        let newElement = new Element(this._Controllers, state);
        for(controllerIndex in controllers) {
            let controllerName = controllers[controllerIndex];
            newElement.addController(controllerName)
        }
    }

    buildController(element)

    registerController(Controller) {
        this._Controllers[Controller.name] = Controller;
    }

    provisionId() {
        return this._id++;
    }
}

class Element extends EventEmitter {
    constructor(factory, state = {}) {
        this._id = factory.provisionId();
        this._state = state;
        this._factory = factory;
        this._controllers = {};
    }

    addController(controllerName, state={}) {
        this._controllers[controllerName] = this._controllers[controllerName] || factory.buildController(this, controllerName, state)
    }

    removeController(controllerName) {
        this._controllers[controllerName].destroy()
        this._controllers[controllerName] = null
    }

    destroy() {
        this.emit('destroy');
        for(let controllerIndex in this._controllers) {
            let controllerName = this._controllers[controllerIndex]
            this.removeController(controllerName)
        }
    }

    handleEvent(eventData) {
        for(let controller in this._state.controllers) {
            this._controllers[controller].handleEvent(eventData)
        }
    }

    async getSnapshot(snapshot = {}) {
        for(let controller in this._state.controllers) {
            snapshot = await this._controllers[controller].getSnapshot(snapshot)
        }
        return snapshot
    }
}
