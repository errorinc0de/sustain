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
                var productList = []
                var processed = 0;

                docs.forEach((doc)=>{
                    processed ++
                    var data = doc.data().products
                    productList.push(data)
                    if(processed === docs.size)
                    {
                        setProducts(productList)
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
                        {products && products.length > 0 && products.map((product)=>{
                            return (
                                <h1>{products.name}</h1>
                            )
                        })}
                    </Col>
                </Row>
            </Container>
            <AddQuota show={show} onHide={handleClose}/>
        </div>
    )
}

export default Quota
