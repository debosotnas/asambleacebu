/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Vote from "./Vote";

import { connect } from "react-redux";
import { makeLogout } from "../state/actions";

import Jumbotron from "react-bootstrap/Jumbotron";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { validateAccess } from "./helpers";

const makeStyles = ({ isMobile }) => ({
    header: css`
        text-align: ${isMobile ? "left" : "center"};
        position: relative;
        .title {
            font-size: ${isMobile ? "1.5" : "2"}rem;
            color: #955;
        }
        .subtitle {
            font-size: ${isMobile ? ".8" : ".8"}rem;
            text-align: ${isMobile ? "right" : "center"};
            color: #999;
            line-height: 14px;
            margin: 20px 10px;
        }
    `,
    headerActions: css`
        position: absolute;
        top: 5px;
        right: 0;
    `,
    parentSpan: css`
        margin-top: 10px;
    `,
    blockSection: css`
        background-color: #a9e3ff;
        padding: 20px;
        margin: 10px 0;
        /* min-height: ${isMobile ? "inherit" : "200"}px; */
    `,
    blockSectionWithSpace: css`
        background-color: #a9e3ff;
        margin: 10px 0;
        min-height: ${isMobile ? "inherit" : "200"}px;
    `,
    nextVotationBlock: css`
        margin-top: 20px;
    `,
    colItem: css`
        padding-left: 0;
        padding-right: 0;
    `,
    colItemJumbo: css`
        padding-left: 3px;
        padding-right: 3px;
    `,
    tagData: css`
        word-break: break-word;
        color: #001f77;
        span {
            color: #555;
        }
    `,
});

const Home = ({ name, ci, email, phone, church, dispatch }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    const handleEnterToVote = () => {
        console.log("enter to vote");
    };
    const handleLogout = () => {
        console.log("logout!");
    };
    return (
        <Container fluid>
            <Row>
                <Col>
                    <Container>
                        <Row>
                            <Col>
                                <div css={styles.header}>
                                    <h2 className="title">
                                        Asamblea {isMobile && <br />}
                                        CEBU 2021
                                    </h2>
                                    <div css={styles.headerActions}>
                                        <Button
                                            onClick={() => {
                                                handleLogout();
                                            }}
                                            variant="outline-danger"
                                            size="sm"
                                        >
                                            {isMobile
                                                ? "Salir"
                                                : "Cerrar sesión"}{" "}
                                            <ExitToAppIcon />
                                        </Button>
                                    </div>
                                    <div class="subtitle">
                                        "...por medio de las cuales nos ha dado
                                        preciosas y grandísimas promesas, para
                                        que por ellas llegaseis a ser
                                        participantes de la naturaleza divina,
                                        habiendo huido de la corrupción que hay
                                        en el mundo a causa de la
                                        concupiscencia;" — 2 Pe. 1:4
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    <Container>
                        <Row css={styles.parentSpan}>
                            <Col css={isMobile ? styles.colItem : []}>
                                <div>Mis datos:</div>
                                <Jumbotron
                                    css={
                                        isMobile
                                            ? [
                                                  styles.blockSection,
                                                  styles.colItemJumbo,
                                              ]
                                            : styles.blockSection
                                    }
                                >
                                    <Container>
                                        <Row>
                                            <Col xs={6}>
                                                <div css={styles.tagData}>
                                                    <span>C.I.:</span> {ci}
                                                </div>
                                                <div css={styles.tagData}>
                                                    <span>Nombre:</span> {name}
                                                </div>
                                                <div css={styles.tagData}>
                                                    <span>E-mail:</span> {email}
                                                </div>
                                            </Col>
                                            <Col xs={6}>
                                                <div css={styles.tagData}>
                                                    <span>Celular:</span>{" "}
                                                    {phone}
                                                </div>
                                                <div css={styles.tagData}>
                                                    <span>Iglesia:</span>{" "}
                                                    {church}
                                                </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Jumbotron>
                            </Col>
                        </Row>
                    </Container>
                    <Container css={styles.nextVotationBlock}>
                        <Row>
                            <Col>
                                <div>Votación disponible:</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Jumbotron
                                    css={
                                        isMobile
                                            ? [
                                                  styles.blockSection,
                                                  styles.colItemJumbo,
                                              ]
                                            : styles.blockSection
                                    }
                                >
                                    <Vote />
                                </Jumbotron>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};
const HomeConnected = connect(
    (state) => {
        //Todo: uncomment later
        // const { name, ci, email, phone, church } =
        //     (state.userSession && state.userSession.info) || {};
        let {
            name = "Adán Pérez",
            ci = "1.234.567-8",
            email = "adan.perez@gmail.com",
            phone = "091 234 567",
            church = "Primera Iglesia de mi barrio",
        } = {};

        return {
            name,
            ci,
            email,
            phone,
            church,
        };
    },
    (dispatch) => {
        return { makeLogout, dispatch };
    }
)(Home);

export default HomeConnected;