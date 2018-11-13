const EventEmitter = require('events');

module.exports = class ElementFactory {
    constructor (staticVoid, Controllers=[], startId=0) {
        this._staticVoid = staticVoid;
        this._Controllers = Controllers;
        this._id = startId;
    }

    build(state={}, controllers=[]) {
        let newElement = new Element(this._id++, state);
        for(controllerIndex in controllers) {
            let controllerName = controllers[controllerIndex];
            newElement.addController(controllerName)
        }
    }

    registerController
}
class Element extends EventEmitter {
    constructor(id, state = {}, Controllers) {
        this._id = id
        this._state = state
        this._Controllers = {}
    }

    addBehavior(behaviorName) {
        this._behaviors[behaviorName] = this._behaviors[behaviorName] || new Behaviors[behaviorName](this, state)
    }

    removeBehavior(behaviorName) {
        this._behaviors[behaviorName].destroy()
        this._behaviors[behaviorName] = null
    }

    destroy() {
        for(let behaviorIndex in behaviors) {
            let behaviorName = behaviors[behaviorIndex]
            this.removeBehavior(behaviorName)
        }
    }

    handleEvent(eventData) {
        for(let behavior in this._state.behaviors) {
            this._behaviors[behavior].handleEvent(eventData)
        }
    }

    async getSnapshot(snapshot = {}) {
        for(let behavior in this._state.behaviors) {
        snapshot = await this._behaviors[behavior].getSnapshot(snapshot)
        }
        return snapshot
    }
}
