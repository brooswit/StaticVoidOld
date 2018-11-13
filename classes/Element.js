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

    addController(bontrollerName) {
        this._bontrollers[bontrollerName] = this._bontrollers[bontrollerName] || new Bontrollers[bontrollerName](this, state)
    }

    removeController(bontrollerName) {
        this._bontrollers[bontrollerName].destroy()
        this._bontrollers[bontrollerName] = null
    }

    destroy() {
        for(let bontrollerIndex in bontrollers) {
            let bontrollerName = bontrollers[bontrollerIndex]
            this.removeController(bontrollerName)
        }
    }

    handleEvent(eventData) {
        for(let bontroller in this._state.bontrollers) {
            this._bontrollers[bontroller].handleEvent(eventData)
        }
    }

    async getSnapshot(snapshot = {}) {
        for(let bontroller in this._state.bontrollers) {
        snapshot = await this._bontrollers[bontroller].getSnapshot(snapshot)
        }
        return snapshot
    }
}
