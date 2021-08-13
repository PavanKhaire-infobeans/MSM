const initialState: {list: object[], error: any} = {list: [], error: null};
export enum GetInstances {
    GetCall = "GetInstanceCall",
    GetFailed = "GetInstanceCallFailed",
    GetSuccess = "GetInstanceCallSuccess",
    GetEnd = "GetInstanceCallEnd",
    ListClean = "GetInstanceRemove"
} 
export const requestInstances = (state = {}, action: {type: GetInstances, payload: object}) => {
	switch (action.type) {
		case GetInstances.GetCall:
			return { completed: false, success: false };
		case GetInstances.GetFailed:
			return { completed: true, success: false };
		case GetInstances.GetSuccess:
			return { completed: true, success: true };
		case GetInstances.GetEnd:
			return { completed: false, success: false };
		default:
			return {...state};
	}
};

export const intanceList = (state = initialState, action: {type: GetInstances, payload: object[] | any}) => {
    switch (action.type) {
        case GetInstances.GetSuccess:
            return {list: action.payload, error: null}
        case GetInstances.GetFailed:
            return {list: [], error: action.payload}
        case GetInstances.ListClean:
            return {list: [], error: null}
        default:
            return JSON.parse(JSON.stringify(state))
    }
}