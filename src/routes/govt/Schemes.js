import React, { useEffect, useState } from 'react'
import {Container, Row, Col, Button, Card} from 'react-bootstrap'
import { useAuth } from '../../context/AuthProvider';
import AddScheme from './component/AddScheme';
import Sidebar from './component/Sidebar'

function Schemes() {

    const [show,setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const {currentUser} = useAuth()

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col lg={1}>
                        <Sidebar />
                    </Col>
                    <Col lg={11} >
                        <div className="d-flex justify-content-end mt-4">
                            <Button variant="dark" className="theme-btn-r" onClick={handleShow}>Add Scheme</Button>
                        </div>
                        <Container fluid>
                                <Row>

                                {currentUser  && currentUser.schemes && currentUser.schemes.length > 0 && currentUser.schemes.map((scheme)=>{
                                    return (
                                        
                                        <Col lg={3}>
                                            <Card>
                                                <Card.Body>
                                                    <Card.Title>{scheme.schemeName}</Card.Title>
                                                    <Card.Subtitle className="mb-2 text-muted">{scheme.cardType}</Card.Subtitle>
                                                    <Card.Subtitle className="mb-2 text-muted">Rs. {scheme.amount} /-</Card.Subtitle>
                                                </Card.Body>
                                            </Card>

                                        </Col>
                                            
                                        )
                                })}
                                </Row>
                            </Container>
                    </Col>
                </Row>
            </Container>
            <AddScheme  show={show} onHide={handleClose} />
        </div>
    )
}

export default Schemes
