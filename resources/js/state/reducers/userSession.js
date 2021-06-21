import { SET_LOGGED_IN, SET_LOGOUT } from "../actionTypes";

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
        case SET_LOGOUT: {
            return {
                ...initialState,
                info: {
                    ...initialState.info,
                },
            };
        }
        default: {
            return state;
        }
    }
};

export default userSession;
