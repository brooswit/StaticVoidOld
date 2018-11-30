const Element = require('./Element')

function getArgumentNames (func) {
  let argumentNames = null
  try {
    argumentNames = func.toString().split('(')[1].split(')')[0].replace(/\s/g, '').split(',')
  } catch (e) {}
  return argumentNames
}

function extractArguments (args) {
  let options = {}
  let argNames = getArgumentNames(args.callee)
  let unpack = true
  for (let argIndex in argNames) {
    let argName = argNames[argIndex]
    let arg = args[argIndex]
    options[argName] = args[argIndex]
    if (argIndex === 0 && (typeof arg !== 'object' || arg === null)) unpack = false
    if (argIndex > 0 && arg !== undefined) unpack = false
  }
  if (unpack) options = args[0]
}
function applyOptions (context, options, func) {
  let args = optionsToFuncArgs()
  func.apply()
}
module.exports = class BaseStore extends Element {
  constructor (parent, state) {
    super(parent, state)
    this.rootView().hook('save', this._onSave)
    this.rootView().hook('load', this._onLoad)
  }

  _onSave (options) {
    applyOptions(this, this.save, options)
  }

  save (collection, key, value) {}

  _onLoad ({ collection, key, defaultValue = null }) {
    this.load(collection, key, defaultValue)
  }
}
