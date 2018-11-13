const EventEmitter = require('events');

module.exports = class ElementFactory {
    constructor (staticVoid, Controllers=[], startId=0) {
        this._staticVoid = staticVoid;
        this._Controllers = Controllers;
        this._id = startId;
    }

    buildElement(state={}, controllers=[]) {
        let newElement = new Element(this._Controllers, state, this._id++);
        for(controllerIndex in controllers) {
            let controllerName = controllers[controllerIndex];
            newElement.addController(controllerName)
        }
    }

    registerController(Controller) {
        this._Controllers[Controller.name] = Controller;
    }
}

class Element extends EventEmitter {
    constructor(Controllers, id, state = {}) {
        this._id = id;
        this._state = state;
        this._Controllers = {};
    }

    addController(controllerName) {
        this._controllers[controllerName] = this._controllers[controllerName] || new controllers[controllerName](this, state)
    }

    removeController(controllerName) {
        this._controllers[controllerName].destroy()
        this._controllers[controllerName] = null
    }

    destroy() {
        for(let controllerIndex in controllers) {
            let controllerName = controllers[controllerIndex]
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
