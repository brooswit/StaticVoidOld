const AsyncKlazz = require('../common/AsyncKlazz')
const EventEmitter = require('events')
const QueryRequester = require('../common/QueryRequester')
const ElementView = require('./ElementView')
const ElementQueryHook = require('./ElementQueryHook')
const ElementEventHook = require('./ElementEventHook')

let _nextElementId = 0
class Element extends AsyncKlazz {
  constructor (initialParent) {
    super()
    this._id = _nextElementId++

    this._queries = new QueryRequester()
    this._events = new EventEmitter()

    this._isDestroyed = false

    this._parentView = new ElementView(initialParent)
    this._rootView = new ElementView(this.root())

    this.parentView().hook('destroyed', this.destroy)

    this.rootView().listen(`${this.name.toLowerCase()}:get_all`, this.view)
    this.rootView().listen(`element:get_all`, this.view)

    this.parentView().listen(`child_${this.name.toLowerCase()}:get_all`, this.view)
    this.parentView().listen('child:get_all', this.view)
  }

  async asyncConstructor () {
    super.asyncConstructor(false)
    const rootView = await this.rootView()
    const parentView = await this.parentView()
    await rootView.trigger(`${this.name.toLowerCase()}/created`, this)
    await rootView.trigger(`element/created`, this)
    await parentView.trigger(`child_${this.name.toLowerCase()}/created`, this)
    await parentView.trigger(`child/created`, this)
    this.ready()
  }

  async parentView () {
    this._parentView.change(this.parent())
    return this._parentView
  }

  async rootView () {
    this._rootView.change(this.root())
    return this._rootView
  }

  async view () {
    if (this._isDestroyed) return null
    return new ElementView(this)
  }

  async hook (eventName, callback) {
    if (this._isDestroyed) return null
    return new ElementEventHook(this, eventName, callback)
  }

  async trigger (eventName, payload) {
    await this.untilReady()
    if (this._isDestroyed) return
    return this._events.emit(eventName, payload)
  }

  async listen (queryName, callback) {
    if (this._isDestroyed) return null
    return new ElementQueryHook(this, queryName, callback)
  }

  async request (queryName, payload) {
    await this.untilReady()
    if (this._isDestroyed) return null
    let result = await this._queries.request(queryName, payload)
    return result
  }

  async element () {
    if (this._isDestroyed) return null
    return this
  }

  async parent () {
    if (this._isDestroyed) return null
    return this.parentView().element()
  }

  async children (optionalType) {
    let type = optionalType !== undefined ? (typeof optionalType === 'string' ? optionalType : optionalType.name) : null
    if (this._isDestroyed) return []
    return this.trigger(`get_children${type ? `_${type}` : ''}`)
  }

  async root () {
    if (this._isDestroyed) return null
    let element = this
    while (element.parent()) {
      element = element.parent()
    }
    return element
  }

  async changeParent (newParent) {
    if (this._isDestroyed) return
    if (this.parentView().element() === newParent) return

    this.parentView().change(newParent)

    this.trigger('parent_changed', newParent)
  }

  async destroy () {
    await this.untilReady()
    if (this._isDestroyed) return
    this.parent.close()
    this._isDestroyed = true
    this.trigger('destroyed')
    this._events.emit('closed')
    this.deconstruct()
  }
}

module.exports = Element
