export const todoState = {
    sessionId: Date.now(),
    data: []
};

export const todoReducer = (state, action) => {
    switch (action.type) {
        case "ADD_TASK":
            return {
                ...state,
                data: [...state.data, action.payload]
            };
        case "UNDO_DELETE":
            action.payload.deleted = false;
            const newArray = state.data.filter(item => item.id !== action.payload.id);
            newArray.push(action.payload);
            return {
                ...state,
                data: newArray
            };
        case "UPDATE_TASK":
            return {
                ...state,
                data: action.payload
                // 
            };
        default:
            return {
                ...state
            };
    };
};