import { combineReducers } from "redux";
import userSession from "./userSession";
import alertManager from "./alertManager";

export default combineReducers({ userSession, alertManager });
