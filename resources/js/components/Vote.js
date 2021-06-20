/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { connect } from "react-redux";
import { makeLogout } from "../state/actions";

import Modal from "react-bootstrap/Modal";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

import { validateAccess } from "./helpers";

const makeStyles = ({ isMobile }) => ({
    nextVotationBlock: css`
        /* margin-top: 10px; */
    `,
    voteSection: css`
        position: relative;
        .in-curse {
            font-size: 20px;
            color: #00a;
            display: ${isMobile ? "block" : "inline"};
            text-align: center;
        }
        .type {
            font-size: 20px;
            color: #00f;
            display: ${isMobile ? "block" : "inline"};
            text-align: center;
        }
        .time-curse {
            font-size: 17px;
            color: #00a;
        }
        .global-time {
            ${!isMobile
                ? "display: block; position: absolute; top: 0; right: 0;"
                : "text-align: center; margin-bottom: 15px;"}
        }
        .time {
            font-size: 17px;
            color: #0aa;
            font-weight: bold;
        }
    `,
    actionVoteSection: css`
        text-align: center;
        button {
            margin-top: 40px;
        }
    `,
    buttonGroupOpts: css`
        button {
            margin: 5px 0;
            border-radius: 5px;
        }
        .btn-secondary.focus,
        .btn-secondary:focus,
        .curr-selected {
            background-color: #955 !important;
        }
    `,
    formCheck: css`
        border: 1px solid #aaa;
    `,
    sendVoteBtn: css`
        width: 160px;
    `,
    selName: css`
        color: #955;
    `,
});

const Vote = ({ opts, dispatch }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    const [selectedOption, setSelectedOption] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedName, setSelectedName] = useState("");

    const [fakeVoteScreen, setFakeVoteScreen] = useState(false);

    let [countClock, setClockCount] = useState(59);

    const makeMoveClock = (sec) => {
        console.log("MoveClock!!");
        setClockCount(sec);
        setTimeout(() => {
            makeMoveClock(sec - 1);
        }, 1000);
    };

    const handleEnterToVote = () => {
        setTimeout(() => {
            makeMoveClock(59);
        }, 1000);
        setFakeVoteScreen(true);
    };
    const handleConfirmAndVote = () => {
        if (isLoading) {
            console.log("isLoading!!");
            return;
        } else if (selectedOption === "abs") {
            setShowConfirm(true);
        } else {
            const option = opts.find((i) => i.id === selectedOption);
            console.log(opts, option);
            if (option && option.id && option.value) {
                setShowConfirm(true);
            }
        }
    };
    const handleSelectOption = (id) => {
        console.log("seleccion > ", id);
        setSelectedOption(id);
        if (id !== "abs") {
            const abc = opts.find((i) => i.id === id) || {};
            setSelectedName(abc.value ? abc.value : "");
        } else {
            setSelectedName("abs");
        }
    };
    const handleCloseConfirm = () => {
        setShowConfirm(false);
    };
    const handleSendVote = () => {
        setShowConfirm(false);
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setSelectedName("");
            setSelectedOption(0);
            setFakeVoteScreen(false);
        }, 2000);
    };

    return (
        <>
            {!fakeVoteScreen ? (
                <Container css={styles.nextVotationBlock}>
                    <Row>
                        <Col sm={12}>
                            <Button
                                onClick={() => {
                                    handleEnterToVote();
                                }}
                                variant="primary"
                            >
                                Haga click aquí para ver la votación que está
                                disponible
                            </Button>
                        </Col>
                    </Row>
                </Container>
            ) : (
                <div css={styles.voteSection}>
                    <Container css={styles.nextVotationBlock}>
                        <Row>
                            <Col sm={12}>
                                <span class="in-curse">Elección en curso:</span>{" "}
                                <span class="type">Presidente</span>
                                <br />
                                <div class="global-time">
                                    <span class="time-in-curse">
                                        Tiempo restante:
                                    </span>{" "}
                                    <span class="time">00:{countClock}</span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12} md={6}>
                                <ButtonGroup
                                    vertical
                                    css={styles.buttonGroupOpts}
                                >
                                    {opts.map(({ id, value }) => {
                                        return (
                                            <Button
                                                key={`${id}-${value}`}
                                                onClick={() => {
                                                    handleSelectOption(id);
                                                }}
                                                variant="secondary"
                                                class={
                                                    selectedOption === id
                                                        ? "curr-selected btn btn-secondary"
                                                        : "btn btn-secondary"
                                                }
                                            >
                                                {value}
                                            </Button>
                                        );
                                    })}
                                    <Button
                                        onClick={() => {
                                            handleSelectOption("abs");
                                        }}
                                        class={
                                            selectedOption === "abs"
                                                ? "curr-selected btn btn-secondary"
                                                : "btn btn-secondary"
                                        }
                                        variant="secondary"
                                    >
                                        Abstención
                                    </Button>
                                </ButtonGroup>
                            </Col>
                            <Col sm={12} md={6} css={styles.actionVoteSection}>
                                <Button
                                    onClick={() => {
                                        handleConfirmAndVote();
                                    }}
                                    disabled={isLoading}
                                    variant="info"
                                    css={styles.sendVoteBtn}
                                >
                                    {isLoading
                                        ? "Enviando voto..."
                                        : `Confirmar selección
                                    y enviar voto`}
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </div>
            )}
            <Modal show={showConfirm} centered onHide={handleCloseConfirm}>
                <Modal.Header closeButton>
                    <Modal.Title>Enviar voto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedName !== "abs" ? (
                        <div>
                            ¿Enviar voto por{" "}
                            <span css={styles.selName}>{selectedName}</span>?
                        </div>
                    ) : (
                        <div>¿Enviar abstención?</div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseConfirm}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSendVote}>
                        Enviar voto
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};
const VoteConnected = connect(
    (state) => {
        //Todo: uncomment later
        // const { name, ci, email, phone, church } =
        //     (state.userSession && state.userSession.info) || {};

        const opts = [
            { id: 1, value: "Nombre1 Apellido1 (Opción #1)" },
            { id: 2, value: "Nombre2 Apellido2 (Opción #2)" },
            { id: 3, value: "Nombre3 Apellido3 (Opción #3)" },
        ];

        return {
            opts,
        };
    },
    (dispatch) => {
        return { makeLogout, dispatch };
    }
)(Vote);

export default VoteConnected;
