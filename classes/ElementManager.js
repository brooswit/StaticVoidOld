const Controller = require('./Controller');
const Element = require('./Element');

module.exports = class ElementFactory {
    constructor (Controllers = [], startId = 0) {
        this._Controllers = Controllers;
        this._id = startId;
    }

    buildElement(controllerNames = [], state = {}) {
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
        let newController = new (this._Controllers[controllerName] || Controller)(this, element, this._id++, state);
        this.trigger('newController', newController);
        this.trigger(`new${controllerName}`, newController);
        return newController;
    }
}
