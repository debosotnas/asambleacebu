/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { connect } from "react-redux";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

// import AddNewOption from "./AddNewOption";
// import AddNewElection from "./AddNewElection";
// import ListElections from "./ListElections";
import GeneralResults from "./GeneralResults";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const makeStyles = ({ isMobile }) => ({
    listAndAdd: css`
        background-color: #eeffea;
        margin: 5px 0;
    `,
});
const Results = ({ elections }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    return (
        <Container css={styles.listAndAdd}>
            <Row>
                <Col xs={12}>
                    <GeneralResults elections={elections} />
                    {/* <AddNewElection /> */}
                </Col>
                {/* <Col xs={8} css={["padding-right: 0"]}>
                    <ListElections elections={elections} />
                </Col> */}
            </Row>
            {/* <Row>
                <Col xs={4}>
                    <AddNewOption />
                </Col>
                <Col xs={8} css={["padding-right: 0"]}>
                    <ListOptions elections={elections} />
                </Col>
            </Row> */}
        </Container>
    );
};

const ResultsConnected = connect(
    (state) => {
        const elections = state.electionsInfo.elections || [];

        return {
            elections,
        };
    },
    (dispatch) => {
        return { dispatch };
    }
)(Results);

export default ResultsConnected;
