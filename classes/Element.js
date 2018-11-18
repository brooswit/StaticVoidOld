const EventManager = require('./EventManager');

module.exports = class Element extends EventManager {
    constructor(manager) {
        this._id = id;
        this._state = state;
        this._manager = manager;
        this._controllers = {};
    }

    addController(controllerName, state={}) {
        if (this.hasController(controller)) return;
        this._controllers[controllerName] = this._manager.attachController(this, controllerName, state)
    }

    removeController(controllerName) {
        if (!this.hasController(controller)) return;
        this._controllers[controllerName].destroy()
        this._controllers[controllerName] = null
    }

    destroy() {
        this.trigger('destroy');
    }

    async getSnapshot(snapshot = {}) {
        this.trigger('snapshot', snapshot);
        return snapshot;
    }
}
