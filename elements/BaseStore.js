const Element = require('./Element')

function getArgNames (func) {
  let argNames = null
  try {
    argNames = func.toString().split('(')[1].split(')')[0].replace(/\s/g, '').split(',')
  } catch (e) {}
  return argNames
}

function optsToFuncArgs (opts, func) {
  let args = []
  let argNames = getArgNames(func)
  for (let argIndex in argNames) {
    if (argIndex === 0 && (typeof arg !== 'object' || arg === null)) unpack = false
    if (argIndex > 0 && arg !== undefined) unpack = false
  }
  if (unpack) opts = args[0]
  if un
    let argName = argNames[argIndex]
    let arg = opts[argName]
    args[argName] = opts[argIndex]
  }
}



function applyOpts (context, opts, func) {
  let args = optsToFuncArgs(opts, func)
  func.apply(context, args)
}

module.exports = class BaseStore extends Element {
  constructor (parent, state) {
    super(parent, state)
    this.rootView().hook('save', this._onSave)
    this.rootView().hook('load', this._onLoad)
  }

  _onSave (opts) {
    applyOpts(this, this.save, opts)
  }

  _onLoad (opts) {
    applyOpts(this, this.load, opts)
  }

  async save (collection, key, value) {}
  async load (collection, key, defaultValue = null) {}
  async has (collection, key) {}
}
