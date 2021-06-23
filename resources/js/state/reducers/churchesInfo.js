import { UPDATE_CHURCHES_LIST, UPDATE_USER_FROM_CHURCH } from "../actionTypes";

const initialState = {
    churches: [],
    usersByChurch: null,
};

const userSession = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_CHURCHES_LIST: {
            return {
                churches: [
                    ...(action.payload && action.payload.length
                        ? action.payload
                        : []),
                ],
                usersByChurch: { ...(state.usersByChurch || {}) },
            };
        }
        case UPDATE_USER_FROM_CHURCH: {
            return {
                churches: [...state.churches],
                usersByChurch: {
                    churchId: action.payload && action.payload.church_id,
                    users: [
                        ...(action.payload &&
                        action.payload.users &&
                        action.payload.users.length
                            ? action.payload.users
                            : []),
                    ],
                },
            };
        }
        default: {
            return state;
        }
    }
};

export default userSession;
