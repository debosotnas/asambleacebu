/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { connect } from "react-redux";
// import { isMobile } from "react-device-detect";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import BgImage from "../../images/clouds.jpg";
import BgImageLogo from "../../images/hay-vida-logo.png";

import Jumbotron from "react-bootstrap/Jumbotron";
import Toast from "react-bootstrap/Toast";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import Login from "./Login";
import Home from "./Home";

const getStyles = ({ isMobile, isLogged }) => ({
    parentContainer: css`
        /*
        ::after {
            content: "";
            background: url(${BgImage});
            opacity: 1;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            position: absolute;
            z-index: -1;
        }*/
    `,
    mainContainer: css`
        margin-top: 14px;
        /* padding-top: ${isMobile || isLogged ? 14 : 20}px; */
        padding-top: ${isLogged ? 14 : 50}px;
        min-height: 800px;
        margin-bottom: 0;
        position: relative;
        background-color: unset;
        border: 1px solid #ddd;
        background: url(${BgImageLogo}) bottom ${isMobile ? "center" : "right"}
            no-repeat;
        ${isMobile ? "background-size: 50%;" : ""}

        ::after {
            content: "";
            background: url(${BgImage});
            opacity: 1;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            position: absolute;
            z-index: -1;
            border-radius: 0.3rem;
        }
    `,
    noteFooter: css`
        color: #aaa;
        font-size: 10px;
        text-align: right;
        a {
            color: #aaa;
        }
        margin-bottom: 10px;
    `,
    colItem: css`
        padding-left: 0;
        padding-right: 0;
    `,
});

const App = ({ isLogged }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

    const styles = getStyles({ isLogged, isMobile });
    return (
        <Container fluid css={styles.parentContainer}>
            <Jumbotron css={styles.mainContainer}>
                <Row>
                    <Col css={isMobile ? styles.colItem : []}>
                        {isLogged ? <Home /> : <Login />}
                    </Col>
                </Row>
            </Jumbotron>
            <div css={styles.noteFooter}>
                <a
                    target="_blank"
                    rel="noreferrer noopener"
                    href="https://firmesensupalabra.com"
                >
                    powered by FirmesEnSuPalabra.com
                </a>
            </div>
        </Container>
    );
};

const AppConnected = connect((state) => {
    //TODO: leaving for now in false (isLogged = !) for testing
    const isLogged = !state.userSession.loggedIn;
    return {
        isLogged,
    };
})(App);

export default AppConnected;
