/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import { connect } from "react-redux";
import { makeLogin } from "../state/actions";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import {
    validate_ci,
    validateEmail,
    validateCel,
    validateAccess,
} from "./helpers";

const style = css`
    color: #000;
    margin: 5px 0;
`;

const makeStyles = ({ isMobile }) => ({
    parentSpan: css`
        margin-top: 10px;
    `,
    span: css`
        display: inline-block;
        min-width: 180px;
    `,
    header: css`
        /* text-align: center; */
        .subtitle {
            font-size: ${isMobile ? ".7" : ".8"}rem;
            text-align: ${isMobile ? "center" : "right"};
            line-height: 14px;
            color: #999;
            ${isMobile ? "margin-bottom: 20px;" : "margin-bottom: 40px;"}
        }
        h2 {
            color: #955;
            ${isMobile ? "text-align: center" : "text-align: right"}
        }
    `,
    bodyForm: css`
        min-width: 500px;
        margin: auto;
    `,
    subnote: css`
        color: #a55;
        font-size: 15px;
    `,
});

const Login = ({ makeLogin, dispatch }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    const handleSubmit = async () => {
        const ci = document.querySelector("#ci").value;
        // if (!validate_ci(ci)) {
        //     console.log("Invalid C.I.");
        //     return;
        // }

        const email = document.querySelector("#email").value;
        // if (email && !validateEmail(email)) {
        //     console.log("Invalid Email");
        //     return;
        // }
        const cel = document.querySelector("#cel").value;
        // if (cel && !validateCel(cel)) {
        //     console.log("Invalid Cel");
        //     return;
        // }
        // if (!email && !cel) {
        //     console.log("Email o Cel is required!");
        //     return;
        // }

        const code = document.querySelector("#code").value;
        // if (!validateAccess(code)) {
        //     console.log("Invalid código de acceso personal");
        //     return;
        // }

        const payload = {
            ci,
            cel,
            email,
            code,
        };
        // dispatch({ type: "TEST_TEST", payload });

        // console.log(">>> payload: ", payload);

        // try {
        await makeLogin(payload, dispatch);
        // } catch (e) {
        //     console.log("Error after try makeLogin! / E: ", e);
        // }

        // call to login service
        // retrieve result and setup cookie and session.
        // navigate and show next screen (automatically when <App> detects that user is logged in)
    };

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Container>
                        <Row>
                            <Col>
                                <div css={styles.header}>
                                    <h2>
                                        Asamblea {isMobile && <br />}
                                        CEBU 2021
                                    </h2>
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
                            <Col>
                                <span css={styles.span}>
                                    C.I.{" "}
                                    <span css={styles.subnote}>
                                        (sin puntos ni guiones)
                                    </span>
                                    :
                                </span>
                                <br />
                                <input
                                    type="text"
                                    id="ci"
                                    maxLength="8"
                                    autoComplete="off"
                                ></input>
                            </Col>
                        </Row>
                        <Row css={styles.parentSpan}>
                            <Col>
                                <span css={styles.span}>
                                    Celular{" "}
                                    <span css={styles.subnote}>
                                        (09x xxx xxx)
                                    </span>
                                    :
                                </span>
                                <br />
                                <input
                                    type="text"
                                    id="cel"
                                    maxLength="9"
                                    autoComplete="off"
                                ></input>
                            </Col>
                        </Row>
                        <Row css={styles.parentSpan}>
                            <Col>
                                <span css={styles.span}>E-mail:</span>
                                <br />
                                <input
                                    type="text"
                                    id="email"
                                    autoComplete="off"
                                ></input>
                            </Col>
                        </Row>
                        <Row css={styles.parentSpan}>
                            <Col>
                                <span css={styles.span}>
                                    Código de accesso personal:
                                </span>
                                <br />
                                <input
                                    type="text"
                                    id="code"
                                    maxLength="8"
                                    autoComplete="off"
                                ></input>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <br />
                                <Button
                                    onClick={() => {
                                        handleSubmit();
                                    }}
                                    css={{ marginTop: 20 }}
                                    variant="primary"
                                >
                                    Ingresar <VpnKeyIcon />
                                </Button>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};
const LoginConnected = connect(
    (state) => {
        return {};
    },
    (dispatch) => {
        return { makeLogin, dispatch };
    }
    // { makeLogin }
)(Login);

export default LoginConnected;
