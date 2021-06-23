import { combineReducers } from "redux";
import userSession from "./userSession";
import alertManager from "./alertManager";
import churchesInfo from "./churchesInfo";
import votesInfo from "./votesInfo";
import electionsInfo from "./electionsInfo";
import optionsInfo from "./optionsInfo";
import resultsInfo from "./resultsInfo";

export default combineReducers({
    userSession,
    alertManager,
    churchesInfo,
    votesInfo,
    electionsInfo,
    optionsInfo,
    resultsInfo,
});
