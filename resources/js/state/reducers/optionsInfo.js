import { LIST_ALL_OPTIONS } from "../actionTypes";

const initialState = {
    opts: [],
};

const optionsInfo = (state = initialState, action) => {
    switch (action.type) {
        case LIST_ALL_OPTIONS: {
            return {
                opts: [...action.payload],
            };
        }
        default: {
            return state;
        }
    }
};

export default optionsInfo;
