import { LIST_ALL_ELECTIONS } from "../actionTypes";

const initialState = {
    elections: [],
};

const electionsInfo = (state = initialState, action) => {
    switch (action.type) {
        case LIST_ALL_ELECTIONS: {
            return {
                elections: [...action.payload],
            };
        }
        default: {
            return state;
        }
    }
};

export default electionsInfo;
