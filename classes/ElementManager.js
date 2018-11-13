const EventEmitter = require('events');
const Controller = require('./Controller');

module.exports = class Element extends EventEmitter{
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
        return newController;
    }
}

class Element extends EventEmitter {
    constructor(factory, id, state = {}) {
        this._id = id;
        this._state = state;
        this._factory = factory;
        this._controllers = {};
    }

    addController(controllerName, state={}) {
        if (this.hasController(controller)) return;
        this._controllers[controllerName] = factory.attachController(this, controllerName, state)
    }

    removeController(controllerName) {
        if (!this.hasController(controller)) return;
        this._controllers[controllerName].destroy()
        this._controllers[controllerName] = null
    }

    destroy() {
        for(let controllerIndex in this._controllers) {
            let controllerName = this._controllers[controllerIndex]
            this.removeController(controllerName)
        }
    }

    async getSnapshot(snapshot = {}) {
        for(let controller in this._state.controllers) {
            snapshot = await this._controllers[controller].getSnapshot(snapshot)
        }
        return snapshot
    }

    // handleEvent(eventData) {
    //     for(let controller in this._state.controllers) {
    //         this._controllers[controller].handleEvent(eventData)
    //     }
    // }
}
