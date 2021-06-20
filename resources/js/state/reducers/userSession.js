import { SET_LOGGED_IN } from "../actionTypes";

const initialState = {
    loggedIn: false,
    userId: null,
    role: null,
    info: {
        ci: null,
        name: null,
        email: null,
        phone: null,
        church: null,
        churchId: null,
    },
};

const userSession = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOGGED_IN: {
            const { userId, role, info } = action.payload;
            return {
                loggedIn: true,
                userId,
                role,
                info: {
                    ...info,
                },
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
