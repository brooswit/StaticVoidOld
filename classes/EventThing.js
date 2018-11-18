class Interface {
    constructor(parent) {
        this._parent = parent;
    }
    close =
}
class InterfaceFactory {
    constructor() {

    }

    newInterface() {
        return new Interface(this);
    }
}
class EventManager {
    constructor() {

    }


}