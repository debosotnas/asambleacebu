/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { connect } from "react-redux";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import DeleteIcon from "@material-ui/icons/Delete";
// import EditIcon from "@material-ui/icons/Edit";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

import {
    makeDelElection,
    makeElectionActive,
    makeUpdateChurch,
} from "../../state/actions";

const makeStyles = ({ isMobile }) => ({
    titleChurch: css`
        font-size: 16px;
        color: #1c37f7;
        margin-bottom: 10px;
        text-align: center;
    `,
    listChurchesBlock: css`
        margin: 10px 0;

        .title-list {
            font-size: 15px;
            font-weight: bold;
            color: #8b008b;
        }

        .list-churches-block-content {
            height: 200px;
            overflow-y: auto;
            /* border: 1px solid #0050f0; */

            .dyn-row {
                .l-col {
                    text-align: left;
                    font-size: 14px;
                    padding-left: 5px;
                    .c-title {
                        font-weight: bold;
                    }
                }
                .r-col {
                    text-align: right;
                }
            }
            .dyn-row:nth-child(odd) {
                background-color: #f5f4f4;
            }
            .dyn-row:nth-child(even) {
                background-color: #ffd3d3;
            }
            .dyn-row:hover:nth-child(odd),
            .dyn-row:hover:nth-child(even) {
                background-color: #c9f7ac;
            }
        }
        .btn-ac {
            border: none;
            background-color: transparent;
            font-size: 13px;
        }
        .btn-ac:hover {
            background-color: #a3da99;
        }
    `,
    dynRowAll: css`
        margin-top: 3px;
    `,
    dynRow: css`
        .dyn-row {
            background-color: #55daff !important;
        }
    `,
});

const ListElections = ({
    elections,
    makeDelElection,
    makeUpdateChurch,
    makeElectionActive,
    dispatch,
}) => {
    // console.log(">>> elections: ", elections);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [idChurchSelected, setIdChurchSelected] = useState(null);
    const [churchSelected, setChurchSelected] = useState(null);

    const [churchEditName, setChurchEditName] = useState(null);
    const [churchEditMembers, setChurchEditMembers] = useState(null);

    const handleActivateElection = async (currId, currVis) => {
        const payload = {
            id: currId,
            visible: !currVis,
        };
        setIsLoading(true);
        try {
            await makeElectionActive({ payload, dispatch });
        } catch (e) {
            console.log("Error after try makeElectionActive! - Err: ", e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelConfirmed = async () => {
        if (!idChurchSelected) {
            return;
        }
        setIsLoading(true);
        try {
            const payload = {
                id: idChurchSelected,
            };
            await makeDelElection({
                payload,
                dispatch,
            });
        } catch (e) {
            console.log("Error after try makeDelElection! - Err: ", e);
        } finally {
            setIsLoading(false);
            setShowDelete(false);
        }
    };

    const handleEditConfirmed = async () => {
        if (!churchSelected || (churchSelected && !churchSelected.id)) {
            return;
        }

        if (
            !churchEditName ||
            (churchEditMembers && isNaN(churchEditMembers))
        ) {
            return;
        }

        const memb = parseInt(churchEditMembers);
        if (memb < 1) {
            return;
        }

        const payload = {
            id: churchSelected.id,
            name: churchEditName,
            members: memb,
        };

        console.log(">>> payload edit: ", payload);

        setIsLoading(true);
        try {
            await makeUpdateChurch({
                payload,
                dispatch,
            });
        } catch (e) {
            console.log("Error after try makeUpdateChurch! - Err: ", e);
        } finally {
            setIsLoading(false);
            setShowEdit(false);
        }
    };

    const handleCloseEdit = () => {
        setShowEdit(false);
    };

    const handleCloseDelete = () => {
        setShowDelete(false);
    };

    const handleDelChurch = (id) => {
        setIdChurchSelected(id);
        setShowDelete(true);
    };

    const handleUpdateChurch = (church) => {
        if (!church || (church && !church.id)) {
            return;
        }
        setChurchSelected({ ...church });
        setChurchEditName(church.name);
        setChurchEditMembers(church.members);
        setShowEdit(true);
    };

    return (
        <>
            <div css={styles.listChurchesBlock}>
                <div css={styles.titleChurch}>Elecciones</div>
                {elections && elections.length ? (
                    <Container>
                        <Row>
                            <Col xs={7}>
                                <span class="title-list">Título</span>
                            </Col>
                            <Col xs={5}></Col>
                        </Row>
                    </Container>
                ) : (
                    <></>
                )}
                <div class="list-churches-block-content">
                    <Container>
                        {elections.map((c) => {
                            return (
                                <div
                                    css={
                                        c.visible
                                            ? [styles.dynRow, styles.dynRowAll]
                                            : [styles.dynRowAll]
                                    }
                                >
                                    <div class="dyn-row">
                                        <Row>
                                            <Col xs={7}>
                                                <div class="l-col">
                                                    <span class="c-title">
                                                        {c.title}
                                                    </span>
                                                    {c.description
                                                        ? `: ${c.description}`
                                                        : ""}
                                                </div>
                                            </Col>
                                            <Col xs={5}>
                                                <div class="r-col">
                                                    <button
                                                        onClick={() => {
                                                            handleActivateElection(
                                                                c.id,
                                                                c.visible
                                                            );
                                                            // handleUpdateChurch(c);
                                                        }}
                                                        class="btn-ac"
                                                        disabled={isLoading}
                                                    >
                                                        {c.visible
                                                            ? `Desactivar`
                                                            : `Activar`}
                                                    </button>

                                                    <button
                                                        disabled={isLoading}
                                                        onClick={() => {
                                                            handleDelChurch(
                                                                c.id
                                                            );
                                                        }}
                                                        class="btn-ac"
                                                    >
                                                        <DeleteIcon />
                                                    </button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            );
                        })}
                    </Container>
                </div>
            </div>

            <Modal show={showDelete} centered onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar Elección</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        ¿Confirma eliminar la elección y todas sus opciones?
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        disabled={isLoading}
                        variant="secondary"
                        onClick={handleCloseDelete}
                    >
                        Cancelar
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="primary"
                        onClick={handleDelConfirmed}
                    >
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEdit} centered onHide={handleCloseEdit}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Iglesia</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div>
                            <div>Nombre:</div>
                            <div>
                                <InputGroup size="sm" className="mb-3">
                                    <FormControl
                                        name="church"
                                        value={churchEditName}
                                        onChange={(e) => {
                                            setChurchEditName(e.target.value);
                                        }}
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm"
                                    />
                                </InputGroup>
                            </div>
                            <div>Número de Titulares:</div>
                            <div>
                                <InputGroup size="sm" className="mb-3">
                                    <FormControl
                                        name="members"
                                        value={churchEditMembers}
                                        onChange={(e) => {
                                            setChurchEditMembers(
                                                e.target.value
                                            );
                                        }}
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm"
                                    />
                                </InputGroup>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        disabled={isLoading}
                        variant="secondary"
                        onClick={handleCloseEdit}
                    >
                        Cancelar
                    </Button>
                    <Button
                        disabled={isLoading}
                        variant="primary"
                        onClick={handleEditConfirmed}
                    >
                        Guardar cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

const ListElectionsConnected = connect(
    (state) => {
        return {};
    },
    (dispatch) => {
        return {
            makeDelElection,
            makeElectionActive,
            makeUpdateChurch,
            dispatch,
        };
    }
)(ListElections);

export default ListElectionsConnected;
