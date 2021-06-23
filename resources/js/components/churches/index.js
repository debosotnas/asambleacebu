/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { connect } from "react-redux";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import AddNewChurch from "./AddNewChurch";
import ListChurches from "./ListChurches";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const makeStyles = ({ isMobile }) => ({
    listAndAdd: css`
        background-color: #eeffea;
        margin: 5px 0;
    `,
});
const Churches = ({ churches }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    return (
        <Container css={styles.listAndAdd}>
            <Row>
                <Col xs={4}>
                    <AddNewChurch />
                </Col>
                <Col xs={8} css={["padding-right: 0"]}>
                    <ListChurches churches={churches} />
                </Col>
            </Row>
        </Container>
    );
};

const ChurchesConnected = connect(
    (state) => {
        const churches = state.churchesInfo.churches;

        return {
            churches,
        };
    },
    (dispatch) => {
        return { dispatch };
    }
)(Churches);

export default ChurchesConnected;
