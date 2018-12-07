function getBaseMethod () {
  let stackTrace = new StackTrace()
  let methodBase = stackTrace.GetFrame(2).GetMethod()
}

function asyncGate (asyncFunc) {
  if (methodBase._instance) return methodBase._instance
  getBaseMethod()._instance = asyncFunc()

  (async () => {
    await methodInstance
    methodBase._instance = null
  })
  return methodBase._instance
}

async function asyncWait () {
  if (methodBase._instance) await methodBase._instance
}

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

class CallbackRegistry {
  constructor () {
    this._callbacks = {}
    }

  register (callbackName, callback) {
    if (!callback) {
      unregister(callbackName)
            return;
    }
    this._callbacks[callbackName] = callback
    }

  unregister (callbackName) {
    delete this._callbacks[callbackName]
    }

  fire (callbackName, payload) {
    if (this._callbacks[callbackName]) {
      this._callbacks[callbackName](payload)
        }
  }
}
