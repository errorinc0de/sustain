import React, { useState } from 'react'
import { Form , Button, Spinner } from 'react-bootstrap'
import {Link} from 'react-router-dom'
import '../styles/login.css'

function GovtLogin() {

    const [error,setError] = useState()
    const [loading, setLoading] = useState(false)
    const [showOTP, setShowOTP] = useState(false)

    function handleLogin(e)
    {
        e.preventDefault()
    }

    return (
        <div className="login-page">
            <div className="login-page-bg"></div>
                <div className="login-form">
                    <h1 className="login-form-brand">Sustain</h1>
                    {error && (
                    <div className="show-error">
                        {error}
                    </div>)}
                    <h3 className="form-text">Don't have an account ? <Link to="/register"> Register Now </Link></h3>
                    <Form className="my-2" onSubmit={handleLogin}>
                        <Form.Group controlId="phoneNumber">
                            <Form.Label>Phone No</Form.Label>
                            <Form.Control type="number" placeholder="Enter phone number" />
                        </Form.Group>
                        {!showOTP && <Button variant="light" className="theme-btn" onClick ={()=>{setShowOTP(true)}}>Send Otp</Button> }
                        {showOTP && (
                            <>
                                <Form.Group controlId="password">
                                    <Form.Label>otp</Form.Label>
                                    <Form.Control type="password" placeholder="Password"  />
                                </Form.Group>
                                
                                <Button variant="light" className="theme-btn" type="submit">
                                {loading ? (<Spinner animation="border" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>):("Login Now")}
                                    
                                </Button>
                            </>
                            
                        )

                        }
                        
                    </Form>
                    
                </div>
        </div>
    )
}

export default GovtLogin
