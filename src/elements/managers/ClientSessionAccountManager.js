const Element = require('../../shared/Element')
const ClientSessionAuthentication = require('../ClientSessionAuthentication')

module.exports = class ClientSessionAuthenticationManager extends Element {
  constructor (parent) {
    super(parent)
    this.rootView().hook('clientsession:created', this._onSessionCreated)
  }

  _onSessionCreated (newSession) {
    return new ClientSessionAuthentication(newSession)
  }
}
