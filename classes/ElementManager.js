const EventManager = require('./EventManager');
const Controller = require('./Controller');
const Element = require('./Element');

module.exports = class WorldManager extends EventManager {
    constructor (Controllers = [], startId = 0) {
        this._Controllers = Controllers;
        this._nextId = startId;
    }

    newElement() {
        let newElement = new Element(this, this._nextId++);
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
        let newController = new (this._Controllers[controllerName] || Controller)(this, element, this._id++, state);
        this.trigger('newController', newController);
        this.trigger(`new${controllerName}`, newController);
        return newController;
    }
}
