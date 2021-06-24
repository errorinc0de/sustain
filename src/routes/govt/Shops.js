import React,{useEffect, useState} from 'react'
import Sidebar from './component/Sidebar'
import {Container,Row,Col,Button, Card} from 'react-bootstrap'
import AddShop from './component/AddShop'
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthProvider';
function Shops() {
    const [show,setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const {currentUser} = useAuth()

    const [shopList, setShopList] = useState()

    useEffect(()=>{

        var unsubscribe = db.collection("users").where("addedByID","==",currentUser.uid).onSnapshot((docs)=>{
            if(!docs.empty)
            {
                var shoplist = []
                var processed = 0;

                docs.forEach((doc)=>{
                    processed ++
                    shoplist.push(doc.data())
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
            <Container fluid>
                <Row>
                    <Col lg={1}>
                        <Sidebar />
                    </Col>
                    <Col lg={11} >
                        <div className="d-flex justify-content-end mt-4">
                            <Button variant="dark" className="theme-btn-r" onClick={handleShow} >Add Shop</Button>
                        </div>



                        <Container fluid>
                            <Row>

                        {shopList  && shopList.length > 0 && shopList.map((shop)=>{
                            return (
                                
                                <Col lg={3}>
                                    <Card>
                                        <Card.Body>
                                        <Card.Title>{shop.displayName}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{shop.phoneNumber}</Card.Subtitle>
                                        <Card.Text>
                                        {shop.address}
                                        <br />
                                        District - {shop.district}
                                        <br />
                                        State - {shop.state}
                                        <br />
                                        Ward - {shop.wardNo}
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
            <AddShop show={show} onHide={handleClose} />
        </div>
    )
}

export default Shops
