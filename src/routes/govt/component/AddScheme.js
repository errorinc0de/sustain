import React, { useRef, useState  } from 'react'
import { Modal, Form, Button, Spinner } from 'react-bootstrap'
import { useAuth } from '../../../context/AuthProvider'
import { db, firebasevalue } from '../../../firebase'
import { ToastContainer, toast } from 'react-toastify';

function AddScheme(props) {

    const schemeNameRef = useRef()
    const amountRef = useRef()

    const [cardType, setCardType] = useState(null)
    const [loading, setLoading] = useState(false)

    const {currentUser} = useAuth()

    function handleClose() {
        props.onHide();
    }

    function handleAddShop(e)
    {
        e.preventDefault()
        setLoading(true)
        db.collection("users").doc(currentUser.uid).update({
            schemes:firebasevalue.arrayUnion({
                schemeName: schemeNameRef.current.value,
                amount: amountRef.current.value,
                cardType
            })
        }).then(()=>{

            props.onHide()
            setLoading(false)
            toast.success('Scheme added successfully !!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                });
        })
    }


    return (
        <div>

              <Modal centered show={props.show} onHide={handleClose}>
                    <Modal.Header>
                        Add New Scheme
                    </Modal.Header>
                    <Modal.Body>
                        <Form className="my-2" onSubmit={handleAddShop}>
                            <Form.Group controlId="schemeName">
                                <Form.Label>Scheme Name</Form.Label>
                                <Form.Control type="text" ref={schemeNameRef} placeholder="Enter Scheme Name" />
                            </Form.Group>
                            <Form.Group controlId="amount">
                                <Form.Label>Amount</Form.Label>
                                <Form.Control type="number" ref={amountRef} placeholder="Enter Scheme Amount" />
                            </Form.Group>
                            <Form.Group controlId="cardType">
                                <Form.Label>Card Type</Form.Label>
                                <div className="ml-1">
                                    <Form.Check inline label="BPL/LPG" name="group1" type="radio" id={`inline-BPL`} onClick={()=>setCardType("BPL/LPG")} />
                                    <Form.Check inline label="BPL/Non-LPG" name="group1" type="radio" id={`inline-BPL-non`} onClick={()=>setCardType("BPL/Non-LPG")} />
                                    <Form.Check inline label="APL" name="group1" type="radio" id={`inline-APL`} onClick={()=>setCardType("APL")} />
                                    <Form.Check inline label="AY" name="group1" type="radio" id={`inline-AY`} onClick={()=>setCardType("AY")} />
                                </div>
                            </Form.Group>
                            <Button  variant="dark" type="submit">{loading ?(
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            ):("Add Scheme")}
                            
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

export default AddScheme
