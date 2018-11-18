const EventManager = require('./EventManager');

module.exports = class Element extends EventManager {
    constructor() {
        this.state = {};
        this.world = null;
    }

    attach(world) {
        if (this._world) return;
        this.world = world;
        this.world = new EventInterface(world);
        this.trigger('attached', world)
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
