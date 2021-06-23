/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { connect } from "react-redux";

import { makeAddOption } from "../../state/actions";

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
});

const AddNewElection = ({ elections, makeAddOption, dispatch }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    const [isLoading, setIsLoading] = useState(false);
    const [selectedDropD, setSelectedDropD] = useState("--");
    const [selectedDropDChurch, setSelectedDropDChurch] = useState(null);

    const handleAddChurch = async () => {
        const name = document.querySelector("#optionName").value;
        const election_id = selectedDropDChurch && selectedDropDChurch.id;

        if (!name || !election_id) {
            return;
        }

        const payload = {
            name,
            election_id,
        };

        try {
            setIsLoading(true);
            await makeAddOption({ payload, dispatch });
            document.querySelector("#optionName").value = "";
            // document.querySelector("#electionDescription").value = "";
            setSelectedDropD("--");
            setSelectedDropDChurch(null);
        } catch (e) {
            console.log("Error after add election! - Err: ", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateSelectDropD = async (id) => {
        const ff = elections.find((c) => {
            return c.id === +id;
        });
        if (ff) {
            const ttt =
                String(ff.title).length > 17
                    ? String(ff.title).substr(0, 17) + "..."
                    : ff.title;
            setSelectedDropD(ttt);
            setSelectedDropDChurch(ff);
        }
    };

    if (elections && !elections.length) {
        return null;
    }

    return (
        <div css={styles.addChurchBlock}>
            <div css={styles.titleChurch}>Agregar Opción</div>

            <div>
                <div>Nombre:</div>
                <div>
                    <input
                        name="optionName"
                        type="text"
                        id="optionName"
                        autoComplete="off"
                    />
                </div>
                <div>Elección:</div>
                <div>
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
                        {elections.map((c) => {
                            return (
                                <Dropdown.Item eventKey={c.id}>
                                    {c.title}
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
                        Agregar Elección
                    </Button>
                </div>
            </div>
        </div>
    );
};

const AddNewElectionConnected = connect(
    (state) => {
        return {
            elections: state.electionsInfo.elections,
        };
    },
    (dispatch) => {
        return { dispatch, makeAddOption };
    }
)(AddNewElection);

export default AddNewElectionConnected;
