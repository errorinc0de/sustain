import React, { useEffect, useRef, useState } from 'react'
import { Modal, Form, Button , Spinner, Container, Row, Col } from 'react-bootstrap'
import { db, firebasevalue } from '../../../firebase'
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthProvider';

function AddQuota(props) {
    const [loading, setLoading] = useState(false)
    const [shopList, setShopList] = useState()

    const productNameRef = useRef()
    const BPLLPGPriceRef =useRef()
    const BPLLPGQuantityRef =useRef()
    const BPLNONLPGPriceRef =useRef()
    const BPLNONLPGQuantityRef =useRef()
    const APLPriceRef =useRef()
    const APLQuantityRef =useRef()
    const AYPriceRef =useRef()
    const AYQuantityRef =useRef()
    const unitRef =useRef()

    const {currentUser} = useAuth()

    function handleClose() {
        props.onHide();
    }

    function handleAddQuota(e)
    {
        e.preventDefault()

        setLoading(true)

        var processed = 0 ;
        shopList.forEach((shop)=>{

            processed ++ 
            db.collection("users").doc(shop.id).update({
                products:firebasevalue.arrayUnion({
                    name:productNameRef.current.value,
                    unit:unitRef.current.value,
                    BPLLPGPrice : BPLLPGPriceRef.current.value,
                    BPLLPGQuantity : BPLLPGQuantityRef.current.value,
                    BPLNONLPGPrice : BPLNONLPGPriceRef.current.value,
                    BPLNONLPGQuantity : BPLNONLPGQuantityRef.current.value,
                    APLPrice : APLPriceRef.current.value,
                    APLQuantity : APLQuantityRef.current.value,
                    AYPrice : AYPriceRef.current.value,
                    AYQuantity : AYQuantityRef.current.value
                })
            })

            if(processed === shopList.length)
            {
                props.onHide()
                setLoading(false)
                toast.success('Product added successfully !!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    });
            }

        })
    }

    useEffect(()=>{

        var unsubscribe = db.collection("users").where("addedByID","==",currentUser.uid).onSnapshot((docs)=>{
            if(!docs.empty)
            {
                var shoplist = []
                var processed = 0;

                docs.forEach((doc)=>{
                    processed ++
                    shoplist.push({id:doc.id,...doc.data()})
                    if(processed === docs.size)
                    {
                        setShopList(shoplist)
                    }
                })
            }else
            {
                setShopList([])
            }
        })

        return unsubscribe
    },[])


    return (
         <div>

              <Modal size="xl" centered show={props.show} onHide={handleClose}>
                    <Modal.Header>
                        Add Product
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="my-2" onSubmit={handleAddQuota}>
                        <Form.Group controlId="productName">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control type="text" ref={productNameRef} placeholder="Enter Product Name" />
                            </Form.Group>

                            <Form.Group controlId="unit">
                                <Form.Label>Unit</Form.Label>
                                <Form.Control as="select" ref={unitRef}>
                                    <option>Kg</option>
                                    <option>Litre</option>
                                    <option>piece</option>
                                </Form.Control>
                            </Form.Group>
                            <Container fluid>
                                <Row>
                                    <Col lg={3}>
                                    <fieldset className="fieldset">
                                        <legend className="legend">For BPL/LPG</legend>
                                        <Form.Group controlId="BplPrice">
                                            <Form.Label>Price</Form.Label>
                                            <Form.Control type="number" ref={BPLLPGPriceRef} placeholder="Product Price" />
                                        </Form.Group>
                                        <Form.Group controlId="BplQuantity">
                                            <Form.Label>Quantity</Form.Label>
                                            <Form.Control type="number" ref={BPLLPGQuantityRef} placeholder="Product Price" />
                                        </Form.Group>
                                    </fieldset>
                                    </Col>
                                    <Col lg={3}>
                                        <fieldset className="fieldset">
                                            <legend className="legend">For BPL/NON-LPG</legend>
                                            <Form.Group controlId="BplPrice">
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control type="number" ref={BPLNONLPGPriceRef} placeholder="Product Price" />
                                            </Form.Group>
                                            <Form.Group controlId="BplQuantity">
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Control type="number" ref={BPLNONLPGQuantityRef} placeholder="Product Price" />
                                            </Form.Group>
                                        </fieldset>
                                    </Col>
                                    <Col lg={3}>
                                        <fieldset className="fieldset">
                                            <legend className="legend">For APL</legend>
                                            <Form.Group controlId="BplPrice">
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control type="number" ref={APLPriceRef} placeholder="Product Price" />
                                            </Form.Group>
                                            <Form.Group controlId="BplQuantity">
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Control type="number" ref={APLQuantityRef} placeholder="Product Price" />
                                            </Form.Group>
                                        </fieldset>
                                    </Col>
                                    <Col lg={3}>
                                        <fieldset className="fieldset">
                                            <legend className="legend">For AY</legend>
                                            <Form.Group controlId="BplPrice">
                                                <Form.Label>Price</Form.Label>
                                                <Form.Control type="number" ref={AYPriceRef} placeholder="Product Price" />
                                            </Form.Group>
                                            <Form.Group controlId="BplQuantity">
                                                <Form.Label>Quantity</Form.Label>
                                                <Form.Control type="number" ref={AYQuantityRef} placeholder="Product Price" />
                                            </Form.Group>
                                        </fieldset>
                                    </Col>

                                </Row>
                            </Container>
                            <Button  variant="dark" type="submit">{loading ?(
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            ):("Add Quota")}
                            </Button> 

                        </Form>
                    </Modal.Body>
                </Modal>

                <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                />
            
        </div>
    )
}

export default AddQuota
