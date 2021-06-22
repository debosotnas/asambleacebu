/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { connect } from "react-redux";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

import { makeDelChurch, makeUpdateChurch } from "../../state/actions";

const makeStyles = ({ isMobile }) => ({
    titleChurch: css`
        font-size: 16px;
        color: #995555;
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
            height: 400px;
            overflow-y: auto;
            /* border: 1px solid #0050f0; */

            .dyn-row {
                .l-col {
                    text-align: left;
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
});

const ListChurches = ({
    churches,
    makeDelChurch,
    makeUpdateChurch,
    dispatch,
}) => {
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

    const handleDelConfirmed = async () => {
        if (!idChurchSelected) {
            return;
        }
        setIsLoading(true);
        try {
            await makeDelChurch({
                payload: {
                    id: idChurchSelected,
                },
                dispatch,
            });
        } catch (e) {
            console.log("Error after try makeDelChurch! - Err: ", e);
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
                <div css={styles.titleChurch}>
                    Iglesias ({churches && churches.length})
                </div>

                <Container>
                    <Row>
                        <Col xs={7}>
                            <span class="title-list">Nombre (# Titulares)</span>
                        </Col>
                        <Col xs={5}></Col>
                    </Row>
                </Container>
                <div class="list-churches-block-content">
                    <Container>
                        {churches.map((c) => {
                            return (
                                <div class="dyn-row">
                                    <Row>
                                        <Col xs={7}>
                                            <div class="l-col">
                                                {c.name} ({c.members})
                                            </div>
                                        </Col>
                                        <Col xs={5}>
                                            <div class="r-col">
                                                <button
                                                    onClick={() => {
                                                        handleUpdateChurch(c);
                                                    }}
                                                    class="btn-ac"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        handleDelChurch(c.id);
                                                    }}
                                                    class="btn-ac"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                            );
                        })}
                    </Container>
                </div>
            </div>

            <Modal show={showDelete} centered onHide={handleCloseDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar Iglesia</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        ¿Confirma eliminar la iglesia y todos sus titulares?
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

const ListChurchesConnected = connect(
    (state) => {
        return {};
    },
    (dispatch) => {
        return { makeDelChurch, makeUpdateChurch, dispatch };
    }
)(ListChurches);

export default ListChurchesConnected;
