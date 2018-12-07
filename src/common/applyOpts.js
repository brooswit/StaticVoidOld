const argsFromOpts = require('argsFromOpts')

module.exports = function applyOpts (func, opts, context) {
  let args = argsFromOpts(opts, func)
  func.apply(context, args)
}
