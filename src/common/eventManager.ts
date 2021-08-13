type Props = {
    id: string,
    onComplete: Function
}
export default class EventManager {
    static eventListners: {[id: string]: Function} = {}
    id?: string;
    constructor(props: Props) {
        EventManager.eventListners = {...EventManager.eventListners, [props.id]: props.onComplete};
        this.id = props.id;
    }

    removeListener = () => {
        delete EventManager.eventListners[this.id]
    }

    static addListener(identifier: string, onComplete: Function) {
        return new EventManager({id: identifier, onComplete})
    }

    static callBack(identifier: string, ...args: any[]) {
        let onComplete = EventManager.eventListners[identifier]
        if (typeof onComplete == "function") {
            onComplete(...args);
        }
    }
}