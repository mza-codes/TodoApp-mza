import { ACTION } from "./actionTypes";

export const INITIAL_STATE = {
    loading: false,
    data: {},
    error: false,
    message: "",
    errorMessage: "",
};

export const dataReducer = (state, action) => {
    console.log(state,action);
    switch (action.type) {
        case ACTION.FETCH_START:
            return {
                ...state,
                loading:true,
                error:false,
                message:"Loading..."
            };
        case ACTION.FETCH_SUCCESS:
            return {
                ...state,
                loading: false,
                message: "Fetch Complete",
                data:action.payload
            };
        case ACTION.FETCH_ERROR:
            return {
                ...state,
                loading: false,
                error:true,
                errorMessage:"Error Occured While Fetching Data"
            };

        default:
            return {
                state
            };
    };
};