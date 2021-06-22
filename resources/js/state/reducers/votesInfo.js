import { UPDATE_READY_TO_VOTE, RESET_READY_TO_VOTE } from "../actionTypes";

const initialState = {
    readyToVote: null,
};

const votesInfo = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_READY_TO_VOTE: {
            return {
                readyToVote: {
                    ...action.payload,
                },
            };
        }
        case RESET_READY_TO_VOTE: {
            return { ...initialState };
        }
        default: {
            return state;
        }
    }
};

export default votesInfo;
