const EventManager = require('./EventManager');
const Controller = require('./Controller');
const Element = require('./Element');

module.exports = class ControllerManager extends EventManager {
    constructor (Controllers = []) {
        this._Controllers = Controllers;
    }

    registerController(Controller, optionalName) {
        this._Controllers[optionalName || Controller.name] = Controller;
    }

    attachController(element, controllerName, state) {
        let newController = new (this._Controllers[controllerName] || Controller)(this, element, this._id++, state);
        this.trigger('newController', newController);
        this.trigger(`new${controllerName}`, newController);
        return newController;
    }
}
