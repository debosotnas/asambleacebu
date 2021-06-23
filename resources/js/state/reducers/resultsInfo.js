import { UPDATE_GENERAL_RESULTS } from "../actionTypes";

const initialState = {
    general: [],
};

const optionsInfo = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_GENERAL_RESULTS: {
            return {
                general: [...action.payload],
            };
        }
        default: {
            return state;
        }
    }
};

export default optionsInfo;
