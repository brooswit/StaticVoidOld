module.exports = class ElementEventHook {
  constructor (elementView, eventName, callback) {
    this._elementView = elementView
    this._eventName = eventName
    this._callback = callback

    this._source = null

    this._elementView._internalEvents.on('source_changed', this._onElementViewSourceChanged)
    this._elementView._internalEvents.on('closed', this._onElementViewClosed)

    this._onElementViewSourceChanged(null, elementView)
  }

  _isClosed () {
    return !this._elementView
  }

  _onElementViewSourceChanged (newSource) {
    if (this._source) {
      this._source.element()._events.off(this._eventName, this._callback)
    }
    if (newSource) {
      newSource.element()._events.on(this._eventName, this._callback)
    }
    this._source = newSource
  }

  _onElementViewClosed () {
    this._elementView._internalEvents.off('source_changed', this._onElementViewSourceChanged)
    this._elementView._internalEvents.off('closed', this._onElementViewClosed)
    this._elementView = null
    this._onElementViewSourceChanged(null)
  }

  off () {
    if (this._isClosed()) return
    this._onElementViewClosed()
  }
}
