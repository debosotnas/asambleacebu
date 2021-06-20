import Alert from "react-bootstrap/Alert";
import { GLOBAL_ALERT_TYPES } from "../state/constants";
import { HIDE_GLOBAL_ALERT } from "../state/actionTypes";

const GlobalAlert = ({ globalAlert, dispatch }) => {
    if (!globalAlert.showGlobalAlert) {
        return null;
    }

    setTimeout(() => {
        handleOnClose();
    }, 6000);

    const handleOnClose = () => {
        dispatch({ type: HIDE_GLOBAL_ALERT });
    };

    const variant =
        globalAlert.typeAlert === GLOBAL_ALERT_TYPES.SUCCESS
            ? "success"
            : globalAlert.typeAlert === GLOBAL_ALERT_TYPES.INFO
            ? "info"
            : "danger";
    return (
        <div class="alert-parent">
            <Alert
                show={globalAlert.showGlobalAlert}
                variant={variant}
                onClose={() => handleOnClose()}
                dismissible
            >
                {globalAlert.msgAlert}
            </Alert>
        </div>
    );
};

export default GlobalAlert;
