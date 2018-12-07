const Element = require('../../shared/Element')
const ClientSession = require('../ClientSession')

module.exports = class WebsocketClientManager extends Element {
  constructor (parent) {
    super(parent)
    this.rootView().hook('client:created', this._onClientCreated)
  }

  _onClientCreated (newClient) {
    return new ClientSession(newClient)
  }
}
