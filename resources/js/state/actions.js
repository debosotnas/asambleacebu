import { SET_LOGGED_IN, SET_LOGOUT, SHOW_GLOBAL_ALERT } from "./actionTypes";
import { GLOBAL_ALERT_TYPES } from "./constants";

const BASE_API_PATH = window.location.origin + "/api/";
const USERS_API_PATH = "users";

const baseFetch = ({ method, url, payload }) => {
    return fetch(url, {
        method,
        cache: "no-cache",
        headers: {
            // Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
};

const callFetchLogin = (payload) => {
    return baseFetch({
        url: BASE_API_PATH + USERS_API_PATH + "/signin",
        method: "POST",
        payload,
    });
};

/*
function callFetchLogin(payload) {
    return get(Routes.fetchBankAccounts(payload));

    fetch(url, options).then(response => {
        
    });
}

const fetchLogin = (payload) => async (dispatch, getState) => {
    const cards = await callFetchLogin(payload)
        .then(result => {
            if (result.status === 401) {
                dispatch(setUnauthorizedError());
            }
            return result.status === 200 ? result.json() : Promise.reject();
        })
        .then(resultJson => resultJson.data)
        .catch(() => []);

    // dispatch(fetchCardsComplete(cards));
};
*/

export const makeLogout = async (dispatch) => {
    return dispatch({ type: SET_LOGOUT });
};

export const makeLogin = async (payload, dispatch) => {
    const response = await callFetchLogin(payload);
    let result;
    if (response.status === 200 && response.redirected) {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al validar los datos de entrada (C.I/Celular/Email/Código). Por favor verifica tus datos e intenta nuevamente",
                code: response.status,
                type: GLOBAL_ALERT_TYPES.ERROR,
            },
        });
    } else if (response.status === 200) {
        try {
            result = await response.json();
            dispatch({ type: SET_LOGGED_IN, payload });
        } catch (e) {
            dispatch({
                type: SHOW_GLOBAL_ALERT,
                payload: {
                    msg: "Ocurrió un error al procesar la info de Login, por favor reintenta nuevamente. Si el problema persiste, consulta con el administrador",
                    code: "159",
                    type: GLOBAL_ALERT_TYPES.ERROR,
                },
            });
            console.log("Error after try makeLogin! - Err: ", e);
        }
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al ingresar con este usuario. Por favor reintenta nuevamente",
                code: response.status,
                type: GLOBAL_ALERT_TYPES.ERROR,
            },
        });
    }
};
