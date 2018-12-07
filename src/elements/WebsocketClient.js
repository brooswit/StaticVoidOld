const Client = require('../common/Client')
const Resolver = require('../common/Resolver')
const JSONparseSafe = require('../common/JSONparseSafe')

module.exports = class WebsocketClient extends Client {
  constructor (parent, ws) {
    super(parent)
    this._websocket = ws

    this.hook('destroy', this._websocket.close)

    this._websocket.on('message', this._receiveMessage)
    this._websocket.on('close', this.destroy)

    this.session.hook('message', this._sendMessage)
    this.session.hook('destroy', this.destroy)
  }

  async _sendMessage (payload) {
    const promise = new Resolver()
    this._websocket.send(JSON.stringify(payload), promise.resolve)
    await promise
  }

  async _receiveMessage (msg) {
    const payloads = JSONparseSafe(msg, [])
    let responses = null
    this.session.request(`client:message`, msg)
    for (let payloadIndex in payloads) {
      const request = payloads[payloadIndex]
      this.session.request(`client:data`, request)
      if (request.op) {
        this.session.request(`client:op`, request)
        responses.push({
          request: request,
          response: await this.session.request(`client:op:${request.op}`)
        })
      }
      this._sendMessage(responses)
    }
    return responses
  }
}
