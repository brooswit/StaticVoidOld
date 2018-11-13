const EventEmitter = require('events');

module.exports = class Controller extends EventEmitter {
    constructor(parent, state = {}) {
        this.parent = parent;
        this,parent.on('destroy', this.destroy);
        this,parent.on('destroy', this.destroy);

        this._state = state;
    }

    destroy() {}

    getSnapshot(snapshot = {}) {
        return snapshot
    }
}
