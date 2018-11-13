module.exports = class Controller {
    constructor(parent, state = {}) {
        this._parent = parent;
        this,_parent.on('destroy', this.destroy);

        this._state = state;
    }

    destroy() {}

    async getSnapshot(snapshot = {}) {
        return snapshot
    }
}
