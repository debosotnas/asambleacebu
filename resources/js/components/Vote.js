/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import HowToVoteIcon from "@material-ui/icons/HowToVote";
import VisibilityIcon from "@material-ui/icons/Visibility";

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
        .main-btn-container {
            text-align: center;
            padding: 0 15px;
        }
    `,
    voteSection: css`
        position: relative;
        .time-in-curse {
            font-size: 17px;
            color: #751252;
        }
        .global-time {
            ${!isMobile
                ? "display: block; position: absolute; top: 0; right: 0;"
                : "text-align: center; margin-bottom: 15px;"}
        }
        .time {
            font-size: 17px;
            color: #aa006e;
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
    highlightCurrVotation: css`
        text-align: center;
        margin: ${isMobile ? 0 : 35}px 10px 15px 10px;
        background-color: #fbffe6;
        padding: 3px;
        border-radius: 5px;
        border: 1px solid #d46868;

        .in-curse {
            font-size: 20px;
            color: #af1111;
            display: ${isMobile ? "block" : "inline"};
            text-align: center;
        }
        .type {
            font-size: 20px;
            color: #af3232;
            display: ${isMobile ? "block" : "inline"};
            text-align: center;
            font-weight: bold;
        }
    `,
});

const Vote = ({ opts, dispatch }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [selectedOption, setSelectedOption] = useState(0);
    const [selectedName, setSelectedName] = useState("");

    const [fakeVoteScreen, setFakeVoteScreen] = useState(false);

    let [countClock, setClockCount] = useState(59);

    const makeMoveClock = (sec) => {
        console.log("MoveClock!!");
        setClockCount(sec);
        if (sec > 0) {
            setTimeout(() => {
                makeMoveClock(sec - 1);
            }, 1000);
        }
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
                <div css={styles.nextVotationBlock}>
                    <div class="main-btn-container">
                        <Button
                            onClick={() => {
                                handleEnterToVote();
                            }}
                            variant="primary"
                        >
                            Haga click aquí para ver la votación que está
                            disponible <VisibilityIcon />
                        </Button>
                    </div>
                </div>
            ) : (
                <div css={styles.voteSection}>
                    <Container css={styles.nextVotationBlock}>
                        <Row>
                            <Col sm={12}>
                                <div css={styles.highlightCurrVotation}>
                                    <span class="in-curse">
                                        Elección en curso:
                                    </span>{" "}
                                    <span class="type">Presidente</span>
                                </div>
                                <div class="global-time">
                                    <span class="time-in-curse">
                                        Tiempo restante:
                                    </span>{" "}
                                    <span class="time">
                                        00:
                                        {countClock > 0
                                            ? countClock > 9
                                                ? countClock
                                                : `0${countClock}`
                                            : "00"}
                                    </span>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12} md={6} css={["text-align: center;"]}>
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
                                    disabled={isLoading || selectedOption === 0}
                                    variant="info"
                                    css={styles.sendVoteBtn}
                                >
                                    {isLoading
                                        ? "Enviando..."
                                        : `Confirmar selección
                                    y enviar`}{" "}
                                    <HowToVoteIcon />
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
                        Enviar
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
