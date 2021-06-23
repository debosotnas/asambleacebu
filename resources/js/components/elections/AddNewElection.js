/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { connect } from "react-redux";

import { makeAddElection } from "../../state/actions";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

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
});

const AddNewElection = ({ makeAddElection, dispatch }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    const [isLoading, setIsLoading] = useState(false);

    const handleAddChurch = async () => {
        const title = document.querySelector("#electionTitle").value;
        const description = document.querySelector(
            "#electionDescription"
        ).value;

        console.log("title: ", title, " - description: ", description);
        if (!title || !description) {
            return;
        }

        const payload = {
            title,
            description,
        };

        try {
            setIsLoading(true);
            await makeAddElection({ payload, dispatch });
            document.querySelector("#electionTitle").value = "";
            document.querySelector("#electionDescription").value = "";
        } catch (e) {
            console.log("Error after add election! - Err: ", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div css={styles.addChurchBlock}>
            <div css={styles.titleChurch}>Agregar elección</div>

            <div>
                <div>Título:</div>
                <div>
                    <input
                        name="electionTitle"
                        type="text"
                        id="electionTitle"
                        autoComplete="off"
                    />
                </div>
                <div>Descripción:</div>
                <div>
                    <input
                        name="electionDescription"
                        type="text"
                        id="electionDescription"
                        autoComplete="off"
                    />
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
        return {};
    },
    (dispatch) => {
        return { dispatch, makeAddElection };
    }
)(AddNewElection);

export default AddNewElectionConnected;
