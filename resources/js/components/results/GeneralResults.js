/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { connect } from "react-redux";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import { getGeneralResults } from "../../state/actions";

const makeStyles = ({ isMobile }) => ({
    listAndAdd: css`
        background-color: #eeffea;
        margin: 5px 0;
    `,
    //------------------
    titleChurch: css`
        font-size: 16px;
        color: #1c37f7;
        margin-bottom: 10px;
        margin-left: 15px;
    `,
    ddrop: css`
        display: inline-block;
        margin-left: 5px;
    `,
});
const Results = ({ elections, countPerOption, dispatch }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    const [selectedDropD, setSelectedDropD] = useState("--");
    const [isLoadingDD, setIsLoadingDD] = useState(false);

    const getTotalOfVotes = () => {
        let total = 0;
        for (const obj of countPerOption) {
            // console.log("------> obj: ", obj);
            total += obj.total;
        }
        return total;

        /*
        console.log(
            "countPerOption>>> ",
            countPerOption,
            Array.isArray(countPerOption)
        );
        const res = Array.isArray(countPerOption)
            ? Array(countPerOption).reduce((prev, curr) => {
                  console.log("CURR: ", curr);
                  return prev + (curr && curr.total ? curr.total : 0);
              }, 0)
            : 0;
        return res;
        */
    };

    const handleUpdateSelectDropD = async (id) => {
        const ff = elections.find((c) => {
            return c.id === +id;
        });
        console.log("fff>>> ", ff);
        if (ff) {
            setIsLoadingDD(true);
            await getGeneralResults({ payload: { id: ff.id }, dispatch });
            setIsLoadingDD(false);
            // setCurSelElection(ff);

            const ttt =
                String(ff.title).length > 25
                    ? String(ff.title).substr(0, 25) + "..."
                    : ff.title;
            setSelectedDropD(ttt);

            // setSelectedDropD(ff.name);
        }
    };

    return (
        <Container css={styles.listAndAdd}>
            <Row>
                <Col xs={12}>
                    <div css={styles.titleChurch}>
                        Ver resultados de:{" "}
                        <DropdownButton
                            id={`dropdown-button-drop-down`}
                            drop={`down`}
                            variant="secondary"
                            title={selectedDropD}
                            css={styles.ddrop}
                            onSelect={(e) => {
                                handleUpdateSelectDropD(e);
                            }}
                            disabled={isLoadingDD}
                        >
                            {elections.map((c) => {
                                return (
                                    <Dropdown.Item key={c.id} eventKey={c.id}>
                                        {c.title}
                                    </Dropdown.Item>
                                );
                            })}
                        </DropdownButton>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    Total de votos: {getTotalOfVotes()}
                    <br />
                    {countPerOption && countPerOption.length ? (
                        <div>
                            {" "}
                            Total de votos por opción:
                            <ul>
                                {countPerOption.map(({ name, total }) => {
                                    return (
                                        <li>
                                            {name}: {total}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ) : (
                        <>
                            <br />
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

const ResultsConnected = connect(
    (state) => {
        // const elections = state.electionsInfo.elections || [];
        const countPerOption = state.resultsInfo && state.resultsInfo.general;
        console.log("countPerOption: ", countPerOption);
        return {
            countPerOption,
        };
    },
    (dispatch) => {
        return { dispatch };
    }
)(Results);

export default ResultsConnected;
