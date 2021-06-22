/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { connect } from "react-redux";

import { makeAddChurch } from "../../state/actions";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";

const makeStyles = ({ isMobile }) => ({
    titleChurch: css`
        font-size: 16px;
        color: #995555;
        margin-bottom: 10px;
        text-align: center;
    `,
    addChurchesBtnCnt: css`
        text-align: center;
    `,
    addChurchBlock: css`
        background-color: aliceblue;
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

const AddNewChurch = ({ churches, makeAddChurch, dispatch }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    const [isLoading, setIsLoading] = useState(false);

    const [selectedDropD, setSelectedDropD] = useState("--");
    const [selectedDropDChurch, setSelectedDropDChurch] = useState(null);

    const handleAddChurch = async () => {
        const name = document.querySelector("#churchName").value;
        const members = document.querySelector("#churchMembers").value;

        if (!name) {
            return;
        }

        if (isNaN(members) || !members) {
            return;
        }

        const payload = {
            name,
            members,
        };

        try {
            setIsLoading(true);
            await makeAddChurch({ payload, dispatch });
            document.querySelector("#churchName").value = "";
            document.querySelector("#churchMembers").value = "";
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
                    <input type="text" id="ci" />
                </div>
                <div>Nombre:</div>
                <div>
                    <input type="text" id="churchName" />
                </div>
                <div>Teléfono:</div>
                <div>
                    <input type="text" id="phone" />
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
                                <Dropdown.Item eventKey={c.id}>
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
        return { dispatch, makeAddChurch };
    }
)(AddNewChurch);

export default AddNewChurchConnected;
