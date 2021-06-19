/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";

import { connect } from "react-redux";
import { makeLogin } from "../state/actions";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import { validateAccess } from "./helpers";

const styles = {
    header: css`
        text-align: center;
    `,
    parentSpan: css`
        margin-top: 10px;
    `,
};

const Home = ({ makeLogin, dispatch }) => {
    return (
        <Container fluid>
            <Row>
                <Col>
                    <Container>
                        <Row>
                            <Col>
                                <div css={styles.header}>
                                    <h2>Asamblea CEBU</h2>
                                    <br />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                    <Container>
                        <Row css={styles.parentSpan}>
                            <Col>
                                <div>Mis datos:</div>
                            </Col>
                            <Col>
                                <div>Última votación:</div>
                            </Col>
                            <Col>
                                <div>Entrar a votar:</div>
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
        return {};
    },
    (dispatch) => {
        return { makeLogin, dispatch };
    }
)(Home);

export default HomeConnected;
