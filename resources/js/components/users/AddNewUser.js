/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { connect } from "react-redux";

import { makeAddUser } from "../../state/actions";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";

const makeStyles = ({ isMobile }) => ({
    titleChurch: css`
        font-size: 16px;
        color: #1c37f7;
        margin-bottom: 10px;
        text-align: center;
    `,
    addChurchesBtnCnt: css`
        text-align: center;
    `,
    addChurchBlock: css`
        background-color: #9ccdf7;
        margin: 20px 0;
        padding: 10px;

        input {
            width: 100%;
            margin-bottom: 20px;
        }
    `,
    ddrop: css`
        display: inline-block;
        margin: 5px 0 10px 0;
    `,
    ddWrap: css`
        /* width: 100%; */
        // overflow-x: hidden;
    `,
});

const AddNewChurch = ({ churches, makeAddUser, dispatch }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    const [isLoading, setIsLoading] = useState(false);

    const [selectedDropD, setSelectedDropD] = useState("--");
    const [selectedDropDChurch, setSelectedDropDChurch] = useState(null);

    const handleAddChurch = async () => {
        const ci = document.querySelector("#ci").value;
        const name = document.querySelector("#username").value;
        const phone = document.querySelector("#phone").value;

        if (
            !selectedDropDChurch ||
            (selectedDropDChurch && !selectedDropDChurch.id)
        ) {
            return;
        }

        const church_id = selectedDropDChurch.id;

        if (!name || !ci || !phone) {
            return;
        }

        const payload = {
            ci,
            name,
            phone,
            church_id,
        };

        try {
            setIsLoading(true);
            await makeAddUser({ payload, dispatch });
            console.log(">> payload: ", payload);
            document.querySelector("#ci").value = "";
            document.querySelector("#username").value = "";
            document.querySelector("#phone").value = "";
            // setSelectedDropD("--");
            // setSelectedDropDChurch(null);
        } catch (e) {
            console.log("Error after add church! - Err: ", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateSelectDropD = async (id) => {
        const ff = churches.find((c) => {
            return c.id === +id;
        });
        if (ff) {
            const ttt =
                String(ff.name).length > 17
                    ? String(ff.name).substr(0, 17) + "..."
                    : ff.name;
            setSelectedDropD(ttt);
            setSelectedDropDChurch(ff);
        }
    };

    return (
        <div css={styles.addChurchBlock}>
            <div css={styles.titleChurch}>Agregar Titular</div>

            <div>
                <div>C.I.:</div>
                <div>
                    <input
                        type="text"
                        id="ci"
                        autoComplete="off"
                        maxLength="8"
                    />
                </div>
                <div>Nombre:</div>
                <div>
                    <input type="text" id="username" autoComplete="off" />
                </div>
                <div>Celular (09x xxx xxx):</div>
                <div>
                    <input
                        type="text"
                        id="phone"
                        maxLength="9"
                        autoComplete="off"
                    />
                </div>
                <div>Iglesia:</div>
                <div css={styles.ddWrap}>
                    <DropdownButton
                        id={`dropdown-button-drop-down`}
                        drop={`down`}
                        variant="secondary"
                        title={selectedDropD}
                        css={styles.ddrop}
                        onSelect={(e) => {
                            handleUpdateSelectDropD(e);
                        }}
                    >
                        {churches.map((c) => {
                            return (
                                <Dropdown.Item key={c.id} eventKey={c.id}>
                                    {c.name}
                                </Dropdown.Item>
                            );
                        })}
                    </DropdownButton>
                </div>
                <div css={styles.addChurchesBtnCnt}>
                    <Button
                        disabled={isLoading}
                        onClick={() => {
                            handleAddChurch();
                        }}
                    >
                        Agregar Titular
                    </Button>
                </div>
            </div>
        </div>
    );
};

const AddNewChurchConnected = connect(
    (state) => {
        return {};
    },
    (dispatch) => {
        return { dispatch, makeAddUser };
    }
)(AddNewChurch);

export default AddNewChurchConnected;
