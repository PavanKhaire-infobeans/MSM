export enum GetMindPopStatus {
    RequestStarted = "GetMindPopRequestStarted",
    RequestFailed = "GetMindPopRequestFailed",
    RequestSuccess = "GetMindPopRequestSuccess",
    RequestEnded = "GetMindPopRequestEnded"
}

export const MindPopListSelectionState = "SelectionState"
export const MindPopListCount = "MindPopListCount"
export const MindPopSelectedItemCount = "MindPopSelectedItemCount"

type Value = { [x: string]: any } | boolean | number
type ResultType = { data: any, completed: boolean, success: boolean } | object;
type Payload = { type: string, payload: Value };

export const getMindPop = (state: ResultType = {}, action: Payload): ResultType => {
    switch (action.type) {
        case GetMindPopStatus.RequestStarted:
            return { completed: false, success: false, data: null }
        case GetMindPopStatus.RequestFailed:
            return { completed: true, success: false, data: action.payload }
        case GetMindPopStatus.RequestSuccess:
            return { completed: true, success: true, data: action.payload }
        case GetMindPopStatus.RequestEnded:
            return { completed: false, success: false, data: null }
        default:
            return { ...state };
    }
}


export const listState = (state: boolean = false, action: Payload): boolean => {
    if (action.type == MindPopListSelectionState) {
        return action.payload as boolean
    }
    return state
}

export const listCount = (state: number = 0, action: Payload): number => {
    if (action.type == MindPopListCount) {
        return action.payload as number
    }
    return state
}

export const selectedItemCount = (state: number = 0, action: Payload): number => {
    if (action.type == MindPopSelectedItemCount) {
        return action.payload as number
    }
    return state
}