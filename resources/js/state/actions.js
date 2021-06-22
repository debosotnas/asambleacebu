import {
    SET_LOGGED_IN,
    SET_LOGOUT,
    SHOW_GLOBAL_ALERT,
    HIDE_GLOBAL_ALERT,
    UPDATE_CHURCHES_LIST,
    UPDATE_USER_FROM_CHURCH,
} from "./actionTypes";
import { GLOBAL_ALERT_TYPES } from "./constants";

const BASE_API_PATH = window.location.origin + "/api/";
const USERS_API_PATH = "users";
const CHURCHES_API_PATH = "churches";

const baseFetch = ({ method, url, payload }) => {
    return method === "GET"
        ? fetch(url, {
              method,
              cache: "no-cache",
              headers: {
                  "Content-Type": "application/json",
              },
          })
        : fetch(url, {
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

const callFetchAddChurch = (payload) => {
    return baseFetch({
        url: BASE_API_PATH + CHURCHES_API_PATH,
        method: "POST",
        payload,
    });
};

const callFetchDelChurch = (payload) => {
    return baseFetch({
        url: BASE_API_PATH + CHURCHES_API_PATH + "/del/" + payload.id,
        method: "PUT",
        payload,
    });
};

const callFetchUpdateChurch = (payload) => {
    return baseFetch({
        url: BASE_API_PATH + CHURCHES_API_PATH + "/" + payload.id,
        method: "PUT",
        payload,
    });
};

const callFetchGetUsersByChurch = (payload) => {
    console.log(">>> !!");
    return baseFetch({
        url: BASE_API_PATH + USERS_API_PATH + "/from/" + payload.id,
        method: "GET",
    });
};

//==========================

export const updateChurchesReducer = ({ churches, dispatch }) => {
    dispatch({
        type: UPDATE_CHURCHES_LIST,
        payload: [...(churches && churches.length ? churches : [])],
    });
};

export const loadUsersByChurch = async ({ payload, dispatch }) => {
    const response = await callFetchGetUsersByChurch(payload);
    if (response.status === 200 && response.redirected) {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al validar los datos enviados. Por favor verifica la información e intenta nuevamente",
                code: response.status,
                type: GLOBAL_ALERT_TYPES.ERROR,
            },
        });
    } else if (response.status === 200) {
        try {
            const result = await response.json();
            console.log(">>> RESULT - get users from church: ", result);
            // updateChurchesReducer({ dispatch, churches: result.churches });
            dispatch({ type: UPDATE_USER_FROM_CHURCH, payload: result });
            dispatch({ type: HIDE_GLOBAL_ALERT });
        } catch (e) {
            dispatch({
                type: SHOW_GLOBAL_ALERT,
                payload: {
                    msg: "Ocurrió un error al procesar la información",
                    code: "559",
                    type: GLOBAL_ALERT_TYPES.ERROR,
                },
            });
            console.log("Error after try getUsersFromChurch! - Err: ", e);
        }
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al actualizar la iglesia. Por favor reintenta nuevamente",
                code: response.status,
                type: GLOBAL_ALERT_TYPES.ERROR,
            },
        });
    }
};

export const makeUpdateChurch = async ({ payload, dispatch }) => {
    const response = await callFetchUpdateChurch(payload);
    if (response.status === 200 && response.redirected) {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al validar los datos enviados. Por favor verifica la información e intenta nuevamente",
                code: response.status,
                type: GLOBAL_ALERT_TYPES.ERROR,
            },
        });
    } else if (response.status === 200) {
        try {
            const result = await response.json();
            console.log(">>> RESULT - update Church: ", result);
            updateChurchesReducer({ dispatch, churches: result.churches });
            dispatch({ type: HIDE_GLOBAL_ALERT });
        } catch (e) {
            dispatch({
                type: SHOW_GLOBAL_ALERT,
                payload: {
                    msg: "Ocurrió un error al procesar la información",
                    code: "459",
                    type: GLOBAL_ALERT_TYPES.ERROR,
                },
            });
            console.log("Error after try makeUpdateChurck! - Err: ", e);
        }
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al actualizar la iglesia. Por favor reintenta nuevamente",
                code: response.status,
                type: GLOBAL_ALERT_TYPES.ERROR,
            },
        });
    }
};

export const makeDelChurch = async ({ payload, dispatch }) => {
    const response = await callFetchDelChurch(payload);
    if (response.status === 200 && response.redirected) {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al validar los datos enviados. Por favor verifica la información e intenta nuevamente",
                code: response.status,
                type: GLOBAL_ALERT_TYPES.ERROR,
            },
        });
    } else if (response.status === 200) {
        try {
            const result = await response.json();
            console.log(">>> RESULT - delete Church: ", result);
            updateChurchesReducer({ dispatch, churches: result.churches });
            dispatch({ type: HIDE_GLOBAL_ALERT });
        } catch (e) {
            dispatch({
                type: SHOW_GLOBAL_ALERT,
                payload: {
                    msg: "Ocurrió un error al procesar la información",
                    code: "359",
                    type: GLOBAL_ALERT_TYPES.ERROR,
                },
            });
            console.log("Error after try makeDelChurck! - Err: ", e);
        }
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al eliminar la iglesia. Por favor reintenta nuevamente",
                code: response.status,
                type: GLOBAL_ALERT_TYPES.ERROR,
            },
        });
    }
};

export const makeAddChurch = async ({ payload, dispatch }) => {
    const response = await callFetchAddChurch(payload);
    if (response.status === 200 && response.redirected) {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al validar los datos de entrada. Por favor verifica la información e intenta nuevamente",
                code: response.status,
                type: GLOBAL_ALERT_TYPES.ERROR,
            },
        });
    } else if (response.status === 200) {
        try {
            const result = await response.json();
            console.log(">>> RESULT - add Church: ", result);
            updateChurchesReducer({ dispatch, churches: result.churches });
            dispatch({ type: HIDE_GLOBAL_ALERT });
        } catch (e) {
            dispatch({
                type: SHOW_GLOBAL_ALERT,
                payload: {
                    msg: "Ocurrió un error al procesar la información",
                    code: "259",
                    type: GLOBAL_ALERT_TYPES.ERROR,
                },
            });
            console.log("Error after try makeAddChurck! - Err: ", e);
        }
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al agregar la iglesia. Por favor reintenta nuevamente",
                code: response.status,
                type: GLOBAL_ALERT_TYPES.ERROR,
            },
        });
    }
};

export const makeLogout = async (dispatch) => {
    return dispatch({ type: SET_LOGOUT });
};

export const makeLogin = async (payload, dispatch) => {
    const response = await callFetchLogin(payload);
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
            const result = await response.json();
            // console.log(">>>>>>>>>>>>>>> result: ", result);
            if (result && result.id && result.cid) {
                console.log(">>> RESULT: ", result);
                dispatch({ type: HIDE_GLOBAL_ALERT });
                dispatch({ type: SET_LOGGED_IN, payload: { ...result } });
                updateChurchesReducer({ dispatch, churches: result.churches });
            } else {
                dispatch({
                    type: SHOW_GLOBAL_ALERT,
                    payload: {
                        msg: "Datos no encontrados en el sistema. Intenta nuevamente, esta vez ingresando solo tu C.I y Código de Acceso Personal. Si el problema persiste verifica que tu iglesia haya enviado tus datos correctamente a la CEBU.",
                        code: "157",
                        type: GLOBAL_ALERT_TYPES.INFO,
                        withTime: false,
                    },
                });
            }
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
