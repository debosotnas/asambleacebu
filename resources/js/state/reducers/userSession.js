import { SET_LOGGED_IN } from "../actionTypes";
// import { VISIBILITY_FILTERS } from "../../constants";

const initialState = {
    loggedIn: false,
    userId: null,
    role: null,
};

const userSession = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOGGED_IN: {
            const { userId, role } = action.payload;
            return {
                loggedIn: true,
                userId,
                role,
            };
        }
        case "TEST_TEST": {
            console.log(">>> Internal: ", action.payload);
            return {
                loggedIn: true,
                lalala: 1,
            };
        }
        default: {
            return state;
        }
    }
};

export default userSession;
