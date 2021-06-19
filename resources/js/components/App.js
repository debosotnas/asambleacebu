/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { connect } from "react-redux";

import Jumbotron from "react-bootstrap/Jumbotron";
import Toast from "react-bootstrap/Toast";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import Login from "./Login";
import Home from "./Home";

const style = css`
    margin-top: 14px;
`;

const App = ({ isLogged }) => (
    <Container fluid>
        <Jumbotron css={style}>
            <Row>
                <Col>{isLogged ? <Home /> : <Login />}</Col>
            </Row>
        </Jumbotron>
    </Container>
);

const AppConnected = connect((state) => {
    const isLogged = state.userSession.loggedIn;
    return {
        isLogged,
    };
})(App);

export default AppConnected;
