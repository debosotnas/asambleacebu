// import Alert from 'react-bootstrap/Alert'
import { SHOW_GLOBAL_ALERT, HIDE_GLOBAL_ALERT } from "../actionTypes";

const initialState = {
    showGlobalAlert: false,
    msgAlert: null,
    typeAlert: null,
};

const alertManager = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_GLOBAL_ALERT: {
            const { msg, code, type } = action.payload;
            return {
                showGlobalAlert: true,
                msgAlert: `${msg} (code: ${code})`,
                typeAlert: type,
            };
        }
        case HIDE_GLOBAL_ALERT: {
            return {
                ...initialState,
            };
        }
        default: {
            return state;
        }
    }
};

export default alertManager;
