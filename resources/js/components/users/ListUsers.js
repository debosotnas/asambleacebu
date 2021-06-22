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

import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

import {
    makeDelChurch,
    makeUpdateChurch,
    loadUsersByChurch,
} from "../../state/actions";

const makeStyles = ({ isMobile }) => ({
    ddrop: css`
        display: inline-block;
        margin-left: 5px;
    `,
    // ---------------------
    titleChurch: css`
        font-size: 16px;
        color: #995555;
        margin-bottom: 10px;
        margin-left: 15px;
        /* text-align: center; */
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
    usersByChurch,
    makeDelChurch,
    makeUpdateChurch,
    dispatch,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
    const styles = makeStyles({ isMobile });

    const [selectedDropD, setSelectedDropD] = useState("--");

    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [idChurchSelected, setIdChurchSelected] = useState(null);
    const [churchSelected, setChurchSelected] = useState(null);

    const [churchEditName, setChurchEditName] = useState(null);
    const [churchEditMembers, setChurchEditMembers] = useState(null);

    // loading users
    const [isLoadingDD, setIsLoadingDD] = useState(false);

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

    const handleUpdateSelectDropD = async (id) => {
        const ff = churches.find((c) => {
            return c.id === +id;
        });
        if (ff) {
            setIsLoadingDD(true);
            await loadUsersByChurch({ payload: { id: ff.id }, dispatch });
            setIsLoadingDD(false);

            const ttt =
                String(ff.name).length > 25
                    ? String(ff.name).substr(0, 25) + "..."
                    : ff.name;
            setSelectedDropD(ttt);

            // setSelectedDropD(ff.name);
        }
    };
    return (
        <>
            <div css={styles.listChurchesBlock}>
                <div css={styles.titleChurch}>
                    Ver Titulares de:{" "}
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
                        {churches.map((c) => {
                            return (
                                <Dropdown.Item eventKey={c.id}>
                                    {c.name}
                                </Dropdown.Item>
                            );
                        })}
                    </DropdownButton>
                </div>

                <Container>
                    <Row>
                        <Col xs={7}>
                            <span class="title-list">
                                Nombre (Cel) - Código{" "}
                            </span>
                        </Col>
                        <Col xs={5}></Col>
                    </Row>
                </Container>
                <div class="list-churches-block-content">
                    <Container>
                        {usersByChurch.map((c) => {
                            return (
                                <div class="dyn-row">
                                    <Row>
                                        <Col xs={7}>
                                            <div class="l-col">
                                                {c.name} ({c.password})
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
                        ¿Confirma eliminar la iglesia y todos sus miembros?
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
        return {
            usersByChurch: state.churchesInfo.usersByChurch || [],
        };
    },
    (dispatch) => {
        return { makeDelChurch, makeUpdateChurch, loadUsersByChurch, dispatch };
    }
)(ListChurches);

export default ListChurchesConnected;
