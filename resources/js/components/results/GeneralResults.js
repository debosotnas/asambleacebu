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
import { VictoryPie } from "victory-pie";

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
    perChurch: css`
        font-size: 12px;
        /* min-width: 200px; */
        display: flex;
        flex-grow: 1;
        width: 20%;
    `,
    parentPerChurch: css`
        display: flex;
        flex-wrap: wrap;
    `,
    squareNoRe: css`
        background-color: #344d5b;
        width: 25px;
        height: 12px;
        display: inline-block;
        margin-left: 10px;
    `,
    squareRe: css`
        background-color: #45b29d;
        width: 25px;
        height: 12px;
        display: inline-block;
        margin-left: 10px;
    `,
    headSquares: css`
        padding: 10px 5px;
        margin-top: 10px;
        border-top: 1px solid #97bb33;
    `,
    numvotes: css`
        font-size: 20px;
        span {
            font-weight: bold;
        }
    `,
});
const Results = ({ elections, countPerOption, countPerChurch, dispatch }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    const [selectedDropD, setSelectedDropD] = useState("--");
    const [isLoadingDD, setIsLoadingDD] = useState(false);

    const getTotalOfT = () => {
        let total = 0;
        for (const obj of countPerChurch) {
            // console.log("------> obj: ", obj);
            total += obj.members;
        }
        return total;
    };

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

    const getDataCountPerOpt = (countPerOpt) => {
        return countPerOpt.map(({ name, total }) => {
            return { x: name, y: total };
        });
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
                <Col xs={6}>
                    <div css={styles.numvotes}>
                        Total de titulares (registrados):{" "}
                        <span>{getTotalOfT()}</span>
                    </div>
                    <div css={styles.numvotes}>
                        Total de votos recibidos (votaron):{" "}
                        <span>{getTotalOfVotes()}</span>
                    </div>
                    {/* <VictoryPie
                        data={[
                            { x: "Registrados", y: getTotalOfT() },
                            {
                                x: "Votaron",
                                y: getTotalOfT() - getTotalOfVotes(),
                            },
                        ]}
                        colorScale={"heatmap"}
                        radius={25}
                        width={100}
                        height={100}
                        style={{
                            labels: {
                                fill: "white",
                            },
                        }}
                    /> */}
                </Col>
                <Col xs={6}>
                    {countPerOption && countPerOption.length ? (
                        <Container>
                            <Row>
                                <Col xs={6}>
                                    <div>
                                        {" "}
                                        Total de votos por opción:
                                        <ul>
                                            {countPerOption.map(
                                                ({ name, total }) => {
                                                    return (
                                                        <li>
                                                            {name}: {total}
                                                        </li>
                                                    );
                                                }
                                            )}
                                        </ul>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <VictoryPie
                                        data={getDataCountPerOpt(
                                            countPerOption
                                        )}
                                        colorScale={"heatmap"}
                                        radius={125}
                                        style={{
                                            labels: {
                                                fill: "white",
                                            },
                                        }}
                                    />
                                </Col>
                            </Row>
                        </Container>
                    ) : (
                        <>
                            <br />
                        </>
                    )}
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <div css={styles.headSquares}>
                        Porcentaje de votos recibidos por iglesia:
                        <div css={styles.squareNoRe}></div> No recibidos
                        <div css={styles.squareRe}></div> Recibidos
                    </div>

                    {countPerChurch && countPerChurch.length ? (
                        <div css={styles.parentPerChurch}>
                            {countPerChurch.map((c) => {
                                const myData = [
                                    {
                                        x: "Total",
                                        y: c.members - c.votesPerChurch,
                                    },
                                    { x: "Votaron", y: c.votesPerChurch },
                                ];
                                return (
                                    <div css={styles.perChurch}>
                                        <div>
                                            {/* {c.churchId} */}
                                            <strong>{c.name}</strong>
                                            <br />
                                            Miembros: {c.members} <br />
                                            V. Recibidos: {
                                                c.votesPerChurch
                                            }{" "}
                                            <br />
                                            Porcentaje:{c.percent}%
                                        </div>
                                        <div>
                                            <VictoryPie
                                                data={myData}
                                                colorScale={"qualitative"}
                                                radius={50}
                                                style={{
                                                    labels: { fill: "white" },
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
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
        const countPerChurch =
            state.resultsInfo && state.resultsInfo.byChurches;

        console.log("countPerOption: ", countPerOption);
        return {
            countPerOption,
            countPerChurch,
        };
    },
    (dispatch) => {
        return { dispatch };
    }
)(Results);

export default ResultsConnected;
