import React from 'react'
import Sidebar from './component/Sidebar'
import RationShop from './component/RationShop'
import {Container,Row,Col,Button, Card} from 'react-bootstrap'

function Dashboard() {
    return (
        <div>
            <Container fluid>
                <Row>
                    <Col lg={1}>
                        <Sidebar />
                    </Col>
                    <Col lg={11} >
                        <RationShop />
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Dashboard
