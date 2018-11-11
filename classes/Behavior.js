module.exports = class Behavior {
    constructor(parent, state = {}) {
        this._parent = parent
        this._state = state
    }

    destroy() {}

    async getSnapshot(snapshot = {}) {
        return snapshot
    }
}
