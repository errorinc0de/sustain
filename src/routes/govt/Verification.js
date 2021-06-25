import React, { useEffect, useState } from 'react'
import {Container, Row, Col, Button, Card} from 'react-bootstrap'
import AddScheme from './component/AddScheme';
import Sidebar from './component/Sidebar'


function Verification() {
    return (
        <div>
            <Container fluid>
                <Row>
                    <Col lg={1}>
                        <Sidebar />
                    </Col>
                    <Col lg={11} >
                        <Container fluid>
                                <Row>


                                </Row>
                            </Container>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Verification
