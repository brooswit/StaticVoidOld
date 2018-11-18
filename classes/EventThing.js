class Interface {
    constructor(parent) {
        this._parent;
    }
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