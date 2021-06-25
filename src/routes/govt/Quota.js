import React, { useEffect, useState } from 'react'
import {Container, Row, Col, Button, Card} from 'react-bootstrap'
import { useAuth } from '../../context/AuthProvider';
import { db } from '../../firebase';
import AddQuota from './component/AddQuota';
import Sidebar from './component/Sidebar'
function Quota() {


    const [show,setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const {currentUser} = useAuth()
    const [products,setProducts] = useState([])


    useEffect(()=>{
        db.collection("users").where("addedByID","==",currentUser.uid).limit(1).onSnapshot((docs)=>{
            if(!docs.empty)
            {
                var processed = 0;

                docs.forEach((doc)=>{
                    processed ++
                    var data = doc.data().products
                    if(processed === docs.size)
                    {
                        setProducts(data)
                    }
                })
            }else
            {
                setProducts([])
            }
        })
    },[])

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col lg={1}>
                        <Sidebar />
                    </Col>
                    <Col lg={11}>
                        <div className="d-flex justify-content-end mt-4">
                            <Button variant="dark" className="theme-btn-r" onClick={handleShow}>Add Product</Button>
                        </div>

                        <Container fluid>
                            <Row>
                        {products && products.length > 0 && products.map((product)=>{
                            return (
                                <Col lg={3}>
                                    <Card>
                                        <Card.Body>
                                        <Card.Title>{product.name}</Card.Title>
                                        <div className="big-header">BPL / LPG</div>
                                        <Card.Text className="header-desc">
                                        Quantity allowed - {product.BPLLPGQuantity} / {product.unit}
                                        <br />
                                        Price - Rs. {product.BPLLPGPrice} /-
                                        <br />
                                        </Card.Text>
                                        <div className="big-header">BPL / NON-LPG</div>
                                        <Card.Text className="header-desc">
                                        Quantity allowed - {product.BPLNONLPGQuantity} / {product.unit}
                                        <br />
                                        Price - Rs. {product.BPLNONLPGPrice} /-
                                        <br />
                                        </Card.Text>
                                        <div className="big-header">APL</div>
                                        <Card.Text className="header-desc">
                                        Quantity allowed - {product.APLQuantity} / {product.unit}
                                        <br />
                                        Price - Rs. {product.APLPrice} /-
                                        <br />
                                        </Card.Text>
                                        <div className="big-header">AY</div>
                                        <Card.Text className="header-desc">
                                        Quantity allowed - {product.APLQuantity} / {product.unit}
                                        <br />
                                        Price - Rs. {product.AYPrice} /-
                                        <br />
                                        </Card.Text>
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
            <AddQuota show={show} onHide={handleClose}/>
        </div>
    )
}

export default Quota
