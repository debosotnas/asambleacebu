import React from "react";
import ReactDOM from "react-dom";

import { Provider } from "react-redux";
import store from "./state/store";

import App from "./components/App";

// Importing the Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);
