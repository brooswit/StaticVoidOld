const EventManager = require('./EventManager');

module.exports = class Element extends EventManager {
    constructor() {
        this.state = {};
        this.world = null;
    }

    attach(world) {
        if (this.world) return;
        this.world = new EventInterface(world);
        this.trigger('attached', world)
    }

    destroy() {
        this.trigger('destroy');
    }

    async getSnapshot(snapshot = {}) {
        this.trigger('snapshot', snapshot);
        return snapshot;
    }
}
