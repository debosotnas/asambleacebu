import {
    SET_LOGGED_IN,
    SET_LOGOUT,
    SHOW_GLOBAL_ALERT,
    HIDE_GLOBAL_ALERT,
    UPDATE_CHURCHES_LIST,
    UPDATE_USER_FROM_CHURCH,
    UPDATE_READY_TO_VOTE,
    RESET_READY_TO_VOTE,
    LIST_ALL_ELECTIONS,
    LIST_ALL_OPTIONS,
    UPDATE_GENERAL_RESULTS,
} from "./actionTypes";
import { GLOBAL_ALERT_TYPES } from "./constants";

const BASE_API_PATH = window.location.origin + "/api/";
const USERS_API_PATH = "users";
const CHURCHES_API_PATH = "churches";
const ELECTIONS_API_PATH = "elections";
const OPTIONS_API_PATH = "options";
const VOTES_API_PATH = "votes";

const baseFetch = ({ method, url, payload = {} }) => {
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
    return baseFetch({
        url: BASE_API_PATH + USERS_API_PATH + "/from/" + payload.id,
        method: "GET",
    });
};

//===========================

const preBaseFetch = async (dispatch, params = {}) => {
    const response = await baseFetch(params);
    if (response.status === 200 && response.redirected) {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al obtener los datos. Por favor intenta nuevamente",
                code: response.status,
                type: GLOBAL_ALERT_TYPES.ERROR,
            },
        });
    } else if (response.status === 200) {
        try {
            return response.json();
            // return await response.json();
        } catch (e) {
            dispatch({
                type: SHOW_GLOBAL_ALERT,
                payload: {
                    msg: "Ocurrió un error al procesar la info, por favor reintenta nuevamente. Si el problema persiste, consulta con el administrador",
                    code: "X59",
                    type: GLOBAL_ALERT_TYPES.ERROR,
                },
            });
            console.log("Error after try process json! - Err: ", e);
        }
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al intentar obtener la info. Por favor reintenta nuevamente",
                code: response.status,
                type: GLOBAL_ALERT_TYPES.ERROR,
            },
        });
    }
};

const callFetchSomethingToVote = async (dispatch) => {
    dispatch({ type: RESET_READY_TO_VOTE });
    dispatch({ type: HIDE_GLOBAL_ALERT });
    const data = await preBaseFetch(dispatch, {
        url: BASE_API_PATH + ELECTIONS_API_PATH + "/ready",
        method: "GET",
    });
    if (data && data.length) {
        const obj = data[0];
        if (obj && obj.alreadyVote) {
            dispatch({
                type: SHOW_GLOBAL_ALERT,
                payload: {
                    msg: "Parece que ya has enviado tu voto para la elección en curso. Por favor espera hasta que el moderador lo indique.",
                    type: GLOBAL_ALERT_TYPES.INFO,
                    withTime: false,
                },
            });
            return;
        }
        dispatch({ type: HIDE_GLOBAL_ALERT });
        dispatch({ type: UPDATE_READY_TO_VOTE, payload: { ...data[0] } });
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "No existen votaciones activas. Por favor espera hasta que el moderador lo indique.",
                // code: "057",
                type: GLOBAL_ALERT_TYPES.INFO,
                withTime: false,
            },
        });
    }
};

/* ********************************************************************** */
// MAKE VOTE!!
const callFetchSendVote = async (dispatch, payload) => {
    const data = await preBaseFetch(dispatch, {
        url: BASE_API_PATH + VOTES_API_PATH,
        method: "POST",
        payload,
    });
    if (data && data.length) {
        // dispatch({ type: HIDE_GLOBAL_ALERT });
        dispatch({ type: UPDATE_READY_TO_VOTE, payload: { ...data[0] } });
        // dispatch({ type: HIDE_GLOBAL_ALERT });
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Voto registrado con éxito.",
                type: GLOBAL_ALERT_TYPES.SUCCESS,
                withTime: 7000,
            },
        });
    } else {
        if (data && data.error) {
            dispatch({
                type: SHOW_GLOBAL_ALERT,
                payload: {
                    msg: data.error,
                    code: "001",
                    type: GLOBAL_ALERT_TYPES.ERROR,
                    withTime: false,
                },
            });
        } else {
            dispatch({
                type: SHOW_GLOBAL_ALERT,
                payload: {
                    msg: "El voto fue registrado. Sin embargo ha ocurrido un error al traer la última información.",
                    code: "057",
                    type: GLOBAL_ALERT_TYPES.INFO,
                    withTime: false,
                },
            });
        }
    }
};

//==========================

export const updateChurchesReducer = ({ churches, dispatch }) => {
    dispatch({
        type: UPDATE_CHURCHES_LIST,
        payload: [...(churches && churches.length ? churches : [])],
    });
};

export const updateOptionsReducer = ({ options, dispatch }) => {
    dispatch({
        type: LIST_ALL_OPTIONS,
        payload: [...(options && options.length ? options : [])],
    });
};

export const updateElectionsReducer = ({ elections, dispatch }) => {
    dispatch({
        type: LIST_ALL_ELECTIONS,
        payload: [...(elections && elections.length ? elections : [])],
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

            if (result && result.id && result.cid) {
                console.log(">>> RESULT: ", result);
                dispatch({ type: HIDE_GLOBAL_ALERT });
                dispatch({ type: SET_LOGGED_IN, payload: { ...result } });
                updateChurchesReducer({ dispatch, churches: result.churches });
                updateOptionsReducer({ dispatch, options: result.options });
                updateElectionsReducer({
                    dispatch,
                    elections: result.elections,
                });
            } else {
                dispatch({
                    type: SHOW_GLOBAL_ALERT,
                    payload: {
                        msg: "Datos no encontrados en el sistema, intenta nuevamente. Si el problema persiste verifica que tu iglesia haya enviado tus datos correctamente a la CEBU.",
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

export const checkSomethingToVote = async ({ dispatch }) => {
    const response = await callFetchSomethingToVote(dispatch);
};

export const makeSendVote = async ({ dispatch, payload }) => {
    const response = await callFetchSendVote(dispatch, payload);
};

export const makeDelElection = async ({ dispatch, payload }) => {
    const data = await preBaseFetch(dispatch, {
        url: BASE_API_PATH + ELECTIONS_API_PATH + "/del/" + payload.id,
        method: "PUT",
        payload,
    });
    if (data) {
        dispatch({
            type: LIST_ALL_ELECTIONS,
            payload: [...data],
        });
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al intentar eliminar la elección y sus opciones. Recargue e intente nuevamente.",
                code: "57",
                type: GLOBAL_ALERT_TYPES.INFO,
                withTime: false,
            },
        });
    }
};

export const makeDelOption = async ({ dispatch, payload }) => {
    const data = await preBaseFetch(dispatch, {
        url: BASE_API_PATH + OPTIONS_API_PATH + "/del/" + payload.id,
        method: "PUT",
        payload,
    });
    if (data) {
        dispatch({
            type: LIST_ALL_OPTIONS,
            payload: [...data],
        });
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al intentar eliminar la opción. Recargue e intente nuevamente.",
                code: "97",
                type: GLOBAL_ALERT_TYPES.INFO,
                withTime: false,
            },
        });
    }
};

export const makeElectionActive = async ({ dispatch, payload }) => {
    const data = await preBaseFetch(dispatch, {
        url: BASE_API_PATH + ELECTIONS_API_PATH + "/activate/" + payload.id,
        method: "PUT",
        payload,
    });
    if (data && data.length) {
        dispatch({
            type: LIST_ALL_ELECTIONS,
            payload: [...data],
        });
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al intentar activar/desactivar la elección. Recargue e intente nuevamente.",
                code: "57",
                type: GLOBAL_ALERT_TYPES.INFO,
                withTime: false,
            },
        });
    }
};

export const makeUpdateUser = async ({ dispatch, payload }) => {
    const data = await preBaseFetch(dispatch, {
        url: BASE_API_PATH + USERS_API_PATH + "/" + payload.id,
        method: "PUT",
        payload,
    });
    if (data && data.church_id && data.users && data.users.length) {
        dispatch({ type: UPDATE_USER_FROM_CHURCH, payload: data });
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al intentar actualizar los datos del usuario. Recargue e intente nuevamente.",
                code: "X57",
                type: GLOBAL_ALERT_TYPES.INFO,
                withTime: false,
            },
        });
    }
};

export const makeDelUser = async ({ dispatch, payload }) => {
    const data = await preBaseFetch(dispatch, {
        url: BASE_API_PATH + USERS_API_PATH + "/del/" + payload.id,
        method: "PUT",
        payload,
    });
    if (data && data.church_id && data.users && data.users.length) {
        dispatch({ type: UPDATE_USER_FROM_CHURCH, payload: data });
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al intentar eliminar un usuario. Recargue e intente nuevamente.",
                code: "X58",
                type: GLOBAL_ALERT_TYPES.INFO,
                withTime: false,
            },
        });
    }
};

export const makeAddUser = async ({ dispatch, payload }) => {
    const data = await preBaseFetch(dispatch, {
        url: BASE_API_PATH + USERS_API_PATH,
        method: "POST",
        payload,
    });
    if (data && data.church_id && data.users && data.users.length) {
        dispatch({ type: UPDATE_USER_FROM_CHURCH, payload: data });
        // dispatch({
        //     type: LIST_ALL_ELECTIONS,
        //     payload: [...data],
        // });
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al intentar crear un Titular. Por favor intente nuevamente.",
                code: "021",
                type: GLOBAL_ALERT_TYPES.ERROR,
                withTime: false,
            },
        });
    }
};

export const makeAddElection = async ({ dispatch, payload }) => {
    const data = await preBaseFetch(dispatch, {
        url: BASE_API_PATH + ELECTIONS_API_PATH,
        method: "POST",
        payload,
    });
    if (data && data.length) {
        dispatch({
            type: LIST_ALL_ELECTIONS,
            payload: [...data],
        });
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al intentar crear una elección. Recargue e intente nuevamente.",
                code: "017",
                type: GLOBAL_ALERT_TYPES.INFO,
                withTime: false,
            },
        });
    }
};

export const makeAddOption = async ({ dispatch, payload }) => {
    const data = await preBaseFetch(dispatch, {
        url: BASE_API_PATH + OPTIONS_API_PATH,
        method: "POST",
        payload,
    });
    if (data && data.length) {
        dispatch({ type: HIDE_GLOBAL_ALERT });
        dispatch({
            type: LIST_ALL_OPTIONS,
            payload: [...data],
        });
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "Ocurrió un error al intentar crear una elección. Recargue e intente nuevamente.",
                code: "087",
                type: GLOBAL_ALERT_TYPES.INFO,
                withTime: false,
            },
        });
    }
};

export const getGeneralResults = async ({ payload, dispatch }) => {
    // dispatch({ type: RESET_READY_TO_VOTE });
    dispatch({ type: HIDE_GLOBAL_ALERT });
    const data = await preBaseFetch(dispatch, {
        url: BASE_API_PATH + ELECTIONS_API_PATH + "/general/" + payload.id,
        method: "GET",
    });
    if (data && data.totals) {
        dispatch({ type: HIDE_GLOBAL_ALERT });
        dispatch({ type: UPDATE_GENERAL_RESULTS, payload: [...data.totals] });
        // dispatch({ type: UPDATE_READY_TO_VOTE, payload: { ...data[0] } });
    } else {
        dispatch({
            type: SHOW_GLOBAL_ALERT,
            payload: {
                msg: "No existen votaciones activas. Por favor espera hasta que el moderador lo indique.",
                // code: "057",
                type: GLOBAL_ALERT_TYPES.INFO,
                withTime: false,
            },
        });
    }
};
