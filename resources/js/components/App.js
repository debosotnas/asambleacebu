/** @jsxImportSource @emotion/react */
import { jsx, css } from "@emotion/react";
import React, { useState } from "react";

import Jumbotron from "react-bootstrap/Jumbotron";
import Toast from "react-bootstrap/Toast";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

// Not using directly CSS
// import "../../css/app.css";

const style = css`
    color: #000;
`;

// const ExampleToast = ({ children }) => {
//     const [show, toggleShow] = useState(true);

//     return (
//         <>
//             {!show && (
//                 <Button onClick={() => toggleShow(true)}>Show Toasts</Button>
//             )}
//             <Toast show={show} onClose={() => toggleShow(false)}>
//                 <Toast.Header>
//                     <strong className="mr-auto">React-Bootstrap</strong>
//                 </Toast.Header>
//                 <Toast.Body>{children}</Toast.Body>
//             </Toast>
//         </>
//     );
// };

const App = () => (
    <Container fluid>
        <Jumbotron>
            <Row>
                <Col>
                    <h1>Hello, world!</h1>
                    <p css={style}>
                        This is a simple hero unit, a simple jumbotron-style
                        component for calling extra attention to featured
                        content or information.
                    </p>
                    <p>
                        <Button variant="primary">Learn more</Button>
                    </p>
                </Col>
            </Row>
        </Jumbotron>
    </Container>
);

/*
const App = () => (
    <Container className="p-3">
        <Jumbotron>
            <h1 className="header">Welcome To React-Bootstrap</h1>
            <ExampleToast>
                We now have Toast.
                <span role="img" aria-label="tada">
                    🎉
                </span>
            </ExampleToast>
        </Jumbotron>
    </Container>
);
*/

export default App;
