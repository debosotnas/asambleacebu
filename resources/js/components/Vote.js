/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import HowToVoteIcon from "@material-ui/icons/HowToVote";
import VisibilityIcon from "@material-ui/icons/Visibility";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { connect } from "react-redux";
import { checkSomethingToVote, makeSendVote } from "../state/actions";

import Modal from "react-bootstrap/Modal";
import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";

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
                : "text-align: right; margin-bottom: 15px;"}
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
        margin: ${isMobile ? 0 : 45}px 10px 15px 10px;
        /* margin: ${isMobile ? 0 : 5}px 10px 15px 10px; */
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
        .desc-in-curse {
            font-size: 15px;
            color: #af6677;
            /* display: ${isMobile ? "block" : "inline"}; */
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

const Vote = ({
    currElection,
    isSomethingToVote,
    opts,
    userId,
    checkSomethingToVote,
    makeSendVote,
    dispatch,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    const [isLoading, setIsLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [selectedOption, setSelectedOption] = useState(0);
    const [selectedName, setSelectedName] = useState("");

    const [showFakeVoteScreen, setShowFakeVoteScreen] = useState(false);

    const [isCheckingVote, setIsCheckingVote] = useState(false);

    // let [countClock, setClockCount] = useState(59); --time
    // const makeMoveClock = (sec) => {
    //     console.log("MoveClock!!");
    //     setClockCount(sec);
    //     if (sec > 0) {
    //         setTimeout(() => {
    //             makeMoveClock(sec - 1);
    //         }, 1000);
    //     }
    // };

    const handleExitNoVote = async () => {
        setSelectedName("");
        setSelectedOption(0);
        setShowFakeVoteScreen(false);
    };

    const handleEnterToVote = async () => {
        // setTimeout(() => { --time
        //     makeMoveClock(59);
        // }, 1000);

        setIsCheckingVote(true);
        setTimeout(async () => {
            try {
                await checkSomethingToVote({ dispatch });
                setShowFakeVoteScreen(true);
            } catch (e) {
                console.log("Error trying to get something to Vote - Err: ", e);
            } finally {
                setIsCheckingVote(false);
            }
        }, Math.ceil(Math.random() * 3000));
        // }, 1000);
    };

    const isAPerson = (p) => {
        return !(
            String(p).indexOf("abstenc") > -1 ||
            String(p).indexOf("en blan") > -1
        );
    };

    const handleConfirmAndVote = () => {
        if (isLoading) {
            console.log("isLoading!!");
            return;
        } else if (!isAPerson(selectedOption)) {
            setShowConfirm(true);
        } else {
            const option = opts.find((i) => i.id === selectedOption);
            // console.log(opts, option);
            if (option && option.id && option.name) {
                setShowConfirm(true);
            }
        }
    };

    const handleSelectOption = (id) => {
        // console.log("seleccion > ", id);
        setSelectedOption(id);
        const abc = opts.find((i) => i.id === id) || {};
        setSelectedName(abc.name ? abc.name.split("_").join("") : "");
    };

    const handleCloseConfirm = () => {
        setShowConfirm(false);
    };

    const handleSendVote = async () => {
        setShowConfirm(false);
        setIsLoading(true);

        // setTimeout(async () => {}, 1);
        try {
            // console.log(currElection, selectedOption);
            const payload = {
                election_id: currElection.id,
                option_id: selectedOption,
                user_id: userId,
            };
            await makeSendVote({ dispatch, payload });
        } catch (e) {
            console.log("error sending vote, please try again - Err: ", e);
        } finally {
            setIsLoading(false);
            setSelectedName("");
            setSelectedOption(0);
            setShowFakeVoteScreen(false);
        }
    };

    return (
        <>
            {showFakeVoteScreen && isSomethingToVote ? (
                <div css={styles.voteSection}>
                    <Container css={styles.nextVotationBlock}>
                        <Row>
                            <Col sm={12}>
                                <div class="global-time">
                                    <Button
                                        onClick={() => {
                                            handleExitNoVote();
                                        }}
                                        variant="danger"
                                        size="sm"
                                    >
                                        [x] Salir sin votar
                                    </Button>
                                </div>
                                <div css={styles.highlightCurrVotation}>
                                    <span class="in-curse">
                                        Elección en curso:
                                    </span>{" "}
                                    <span class="type">
                                        {currElection.title}
                                    </span>
                                    <div class="desc-in-curse">
                                        {currElection.description}
                                    </div>
                                </div>
                                {/* --time <div class="global-time">
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
                                </div> */}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12} md={6} css={["text-align: center;"]}>
                                <ButtonGroup
                                    vertical
                                    css={styles.buttonGroupOpts}
                                >
                                    {opts.map(({ id, name }) => {
                                        return (
                                            <Button
                                                key={`${id}-${name}`}
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
                                                {name.split("_").join("")}
                                            </Button>
                                        );
                                    })}
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
            ) : (
                <div css={styles.nextVotationBlock}>
                    <div class="main-btn-container">
                        <Button
                            onClick={() => {
                                handleEnterToVote();
                            }}
                            variant="primary"
                            disabled={isCheckingVote}
                        >
                            {isCheckingVote ? (
                                "Cargando info..."
                            ) : (
                                <span>
                                    {" "}
                                    Haga click o toque aquí para ver la votación
                                    que está disponible
                                    {/* <VisibilityIcon /> */}
                                </span>
                            )}
                        </Button>
                    </div>
                </div>
            )}
            <Modal show={showConfirm} centered onHide={handleCloseConfirm}>
                <Modal.Header closeButton>
                    <Modal.Title>Enviar voto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isAPerson(selectedName) ? (
                        <div>
                            ¿Enviar voto por{" "}
                            <span css={styles.selName}>{selectedName}</span>?
                        </div>
                    ) : (
                        <div>¿Enviar {selectedName.split("_").join("")}?</div>
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
        const isSomethingToVote =
            state.votesInfo.readyToVote &&
            state.votesInfo.readyToVote.id &&
            !state.votesInfo.readyToVote.alreadyVote;
        let opts = [];
        if (isSomethingToVote) {
            opts.push(...state.votesInfo.readyToVote.opts);
        }
        const userId = state.userSession.userId;

        return {
            isSomethingToVote,
            currElection: state.votesInfo.readyToVote,
            userId,
            opts,
        };
    },
    (dispatch) => {
        return { checkSomethingToVote, makeSendVote, dispatch };
    }
)(Vote);

export default VoteConnected;
