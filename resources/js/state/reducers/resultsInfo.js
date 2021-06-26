import {
    UPDATE_GENERAL_RESULTS,
    UPDATE_BY_CHURCHES_RESULTS,
} from "../actionTypes";

const initialState = {
    general: [],
    byChurches: [],
};

const optionsInfo = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_GENERAL_RESULTS: {
            return {
                general: [...action.payload.totals],
                byChurches: [...action.payload.churches],
            };
        }
        // case UPDATE_BY_CHURCHES_RESULTS: {
        //     return {
        //         general: [...action.payload],
        //         byChurches: [
        //             ...state.byChurches
        //         ]
        //     };
        // }
        default: {
            return state;
        }
    }
};

export default optionsInfo;
