import React, { useRef, useState } from 'react'
import {Form,Container , Row , Col, Spinner, Button} from'react-bootstrap'
import card from '../../img/ration-card.jpg'
import people from '../../img/person.jpg'
import { useHistory } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { db, storageRef } from '../../firebase'

function VerifyProfile() {

    const rationCardPhotoRef = useRef()
    const personPhotoRef = useRef()
    const history = useHistory()
    const {currentUser, logout} = useAuth()


    const [rationCardImage,setRationCardImage] = useState(card)
    const [personImage,setPersonImage] = useState(people)
    const [rationCardImageFile,setRationCardImageFile] = useState()
    const [personImageFile,setPersonImageFile] = useState()
    const [loading,setLoading] = useState(false)


    function showRationCard(e)
    {
        e.preventDefault()
        if(e.target.files[0])
        {
            var file = e.target.files[0];
            setRationCardImageFile(file)
            var reader = new FileReader();
            reader.onloadend = function (e) {
                setRationCardImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
        
    }


    function showPersonImage(e)
    {
        e.preventDefault()
        if(e.target.files[0])
        {
            var file = e.target.files[0];
            setPersonImageFile(file)
            var reader = new FileReader();
            reader.onloadend = function (e) {
                setPersonImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
        
    }

    async function handleLogout() {    
        try {
          await logout()
          history.push("/")
        } catch {
          console.log("Failed to log out")
        }
      }

    function handleVerification(e)
    {
        e.preventDefault()

        setLoading(true)
        storageRef.child(`${currentUser.uid}/${rationCardImageFile.name}`).put(rationCardImageFile).then(() => {
            storageRef.child(`${currentUser.uid}/${rationCardImageFile.name}`).getDownloadURL()
                .then((url) => {
                    db.collection("users").doc(currentUser.uid).update({
                        cardImage:url
                    }).then(()=>{
                        storageRef.child(`${currentUser.uid}/${personImageFile.name}`).put(personImageFile).then(() => {
                            storageRef.child(`${currentUser.uid}/${personImageFile.name}`).getDownloadURL()
                                .then((url) => {
                                    db.collection("users").doc(currentUser.uid).update({
                                        personImage:url
                                    }).then(()=>{
                                        setLoading(false)
                                        history.push("/dashboard")
                                    })
                                })
                          });
                    })
                })
          });

        
          
        
    }

    return (
        <div className="login-page">
            <div className="login-page-bg"></div>
                <div className="login-form">
                    <h1 className="login-form-brand">Sustain</h1>                    
                    <h3 className="form-text">Verify your profile now .</h3>

                    <Form onSubmit={handleVerification}>
                        
                        <Container>
                            <Row>
                                <Col lg={6}>
                                    <Form.Label>Ration Card Image</Form.Label><br></br>
                                    <img src={rationCardImage} className="img-holder" onClick={()=>rationCardPhotoRef.current.click()}/>
                                    <Form.File 
                                        id="rationCardPhoto"
                                        label="Ration Card Photo"
                                        className="hidden"
                                        ref={rationCardPhotoRef}
                                        onChange={showRationCard}
                                        required
                                    />
                                </Col>
                                <Col lg={6}>
                                     <Form.Label>Person with Ration Card</Form.Label>
                                        <br></br>
                                        <img src={personImage} className="img-holder" onClick={()=>personPhotoRef.current.click()}/>
                                        <Form.File 
                                            id="custom-file"
                                            label="Ration Card Photo"
                                            className="hidden"
                                            ref={personPhotoRef}
                                            onChange={showPersonImage}
                                            required
                                        />
                                </Col>
                            </Row>
                        </Container>
                                <Button variant="light" className="theme-btn" type="submit">{loading ?(
                                    <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                ):("Submit for verifcation")}
                                </Button>

                                <Button variant="danger" className="theme-btn ml-2" onClick={handleLogout}>{loading ?(
                                    <Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                ):("Logout")}
                                </Button>
                        </Form>

                </div>

                
        </div>
    )
}

export default VerifyProfile
