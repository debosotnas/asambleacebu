import { combineReducers } from "redux";
import userSession from "./userSession";
import alertManager from "./alertManager";
import churchesInfo from "./churchesInfo";

export default combineReducers({ userSession, alertManager, churchesInfo });
