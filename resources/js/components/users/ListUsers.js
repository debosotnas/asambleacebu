/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";
import { connect } from "react-redux";

import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";

import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

import {
    makeDelUser,
    makeUpdateUser,
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
        color: #1c37f7;
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
                font-size: 14px;
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
    makeDelUser,
    makeUpdateUser,
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
    const [ciUser, setCiUser] = useState(null);
    const [editCel, setEditCel] = useState(null);
    const [currChurchSelected, setCurrChurchSelected] = useState(null);

    // loading users
    const [isLoadingDD, setIsLoadingDD] = useState(false);

    const handleDelConfirmed = async () => {
        if (!idChurchSelected) {
            return;
        }
        setIsLoading(true);
        try {
            await makeDelUser({
                payload: {
                    id: idChurchSelected,
                    church_id: currChurchSelected.id,
                },
                dispatch,
            });
        } catch (e) {
            console.log("Error after try makeDelUser! - Err: ", e);
        } finally {
            setIsLoading(false);
            setShowDelete(false);
        }
    };

    const handleEditConfirmed = async () => {
        if (!churchSelected || (churchSelected && !churchSelected.id)) {
            return;
        }

        console.log(">>>>> churchSelected: ", churchSelected);

        if (!churchEditName || !ciUser) {
            return;
        }

        const payload = {
            id: churchSelected.id,
            church_id: currChurchSelected.id,
            ci: ciUser,
            name: churchEditName,
            phone: editCel,
        };

        console.log(">>> payload USER edit: ", payload);

        setIsLoading(true);
        try {
            await makeUpdateUser({
                payload,
                dispatch,
            });
        } catch (e) {
            console.log("Error after try makeUpdateUser! - Err: ", e);
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

        setCiUser(church.ci);
        setChurchEditName(church.name);
        setEditCel(church.phone);

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
            setCurrChurchSelected(ff);
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
                            <span class="title-list">Nombre (Cel)</span>
                        </Col>
                        <Col xs={2}>
                            <span class="title-list">Código</span>
                        </Col>
                        <Col xs={3}></Col>
                    </Row>
                </Container>
                <div class="list-churches-block-content">
                    <Container>
                        {usersByChurch.users &&
                            usersByChurch.users.map((c) => {
                                return (
                                    <div class="dyn-row">
                                        <Row>
                                            <Col xs={7}>
                                                <div class="l-col">
                                                    {c.name} ({c.phone})
                                                </div>
                                            </Col>
                                            <Col xs={2}>
                                                <div class="l-col">
                                                    {c.password}
                                                </div>
                                            </Col>
                                            <Col xs={3}>
                                                <div class="r-col">
                                                    <button
                                                        onClick={() => {
                                                            handleUpdateChurch(
                                                                c
                                                            );
                                                        }}
                                                        class="btn-ac"
                                                    >
                                                        <EditIcon />
                                                    </button>
                                                    <button
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
                    <div>¿Confirma eliminar este Titular?</div>
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
                            <div>C.I.:</div>
                            <div>
                                <InputGroup size="sm" className="mb-3">
                                    <FormControl
                                        name="ciEdit"
                                        value={ciUser}
                                        onChange={(e) => {
                                            setCiUser(e.target.value);
                                        }}
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm"
                                    />
                                </InputGroup>
                            </div>
                            <div>Nombre:</div>
                            <div>
                                <InputGroup size="sm" className="mb-3">
                                    <FormControl
                                        name="nombreEdit"
                                        value={churchEditName}
                                        onChange={(e) => {
                                            setChurchEditName(e.target.value);
                                        }}
                                        aria-label="Small"
                                        aria-describedby="inputGroup-sizing-sm"
                                    />
                                </InputGroup>
                            </div>
                            <div>Celular:</div>
                            <div>
                                <InputGroup size="sm" className="mb-3">
                                    <FormControl
                                        name="celEdit"
                                        value={editCel}
                                        onChange={(e) => {
                                            setEditCel(e.target.value);
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
            usersByChurch: state.churchesInfo.usersByChurch || {},
        };
    },
    (dispatch) => {
        return { makeDelUser, makeUpdateUser, loadUsersByChurch, dispatch };
    }
)(ListChurches);

export default ListChurchesConnected;
