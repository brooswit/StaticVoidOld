function getBaseMethod() {
    let stackTrace = new StackTrace()
    let methodBase = stackTrace.GetFrame(2).GetMethod()
}

function asyncGate(asyncFunc) {
    if (methodBase._instance) return methodBase._instance
    getBaseMethod()._instance = asyncFunc()

    (async()=>{
        await methodInstance
        methodBase._instance = null
    })
    return methodBase._instance
}

async function asyncWait() {
    if (methodBase._instance) await methodBase._instance
}
