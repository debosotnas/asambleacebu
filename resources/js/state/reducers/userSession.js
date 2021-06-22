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
            const {
                ci,
                cid: churchId,
                cname: church,
                email,
                id: userId,
                name,
                phone,
                role,
            } = action.payload;

            return {
                loggedIn: true,
                userId,
                role,
                info: {
                    ci,
                    name,
                    email,
                    phone,
                    church,
                    churchId,
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
