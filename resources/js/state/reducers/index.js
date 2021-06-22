import { combineReducers } from "redux";
import userSession from "./userSession";
import alertManager from "./alertManager";
import churchesInfo from "./churchesInfo";
import votesInfo from "./votesInfo";

export default combineReducers({
    userSession,
    alertManager,
    churchesInfo,
    votesInfo,
});
