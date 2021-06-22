/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { connect } from "react-redux";

import { makeAddChurch } from "../../state/actions";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

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
});

const AddNewChurch = ({ makeAddChurch, dispatch }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    const [isLoading, setIsLoading] = useState(false);

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

    return (
        <div css={styles.addChurchBlock}>
            <div css={styles.titleChurch}>Agregar iglesia</div>

            <div>
                <div>Nombre:</div>
                <div>
                    <input type="text" id="churchName" />
                </div>
                <div>Número de Titulares:</div>
                <div>
                    <input type="text" id="churchMembers" />
                </div>
                <div css={styles.addChurchesBtnCnt}>
                    <Button
                        disabled={isLoading}
                        onClick={() => {
                            handleAddChurch();
                        }}
                    >
                        Agregar Iglesia
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
