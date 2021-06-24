import React, { useEffect, useRef, useState } from 'react'
import { Form , Button, Spinner } from 'react-bootstrap'
import {Link, useHistory} from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import '../styles/login.css'

function GovtLogin() {

    const {currentUser,GovLogin} = useAuth()

    const [error,setError] = useState()
    const [loading, setLoading] = useState(false)

    const history = useHistory()

    const passwordRef = useRef()
    const emailRef = useRef()

    function handleLogin(e)
    {
        e.preventDefault()
        setLoading(true)

        if(passwordRef.current.value.length < 6)
        {
            setLoading(false)
            setError("Password must be of 6 character")
            return
        }
        GovLogin(emailRef.current.value,passwordRef.current.value).then(()=>{
            history.push("/govt-dashboard")
            setLoading(false)
        }).catch((err)=>{
            setError(err.meesage)
            setLoading(false)
        })
    }

    useEffect(()=>{
        if(currentUser && currentUser.uid)
        {
            if(currentUser.isGovt)
                history.push("/govt-dashboard")
        }
    },[currentUser])

    return (
        <div className="login-page">
            <div className="login-page-bg"></div>
                <div className="login-form">
                    <h1 className="login-form-brand">Sustain</h1>                    
                    <h3 className="form-text">Don't have an account ? <Link to="/register"> Register Now </Link></h3>
                    {error && (
                    <div className="show-error">
                        {error}
                    </div>)}
                    <Form className="my-2" onSubmit={handleLogin}>
                        <Form.Group controlId="email">
                            <Form.Label>Email Id</Form.Label>
                            <Form.Control type="email" ref={emailRef} placeholder="Enter your email" />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} placeholder="Enter your password" />
                        </Form.Group>
                       
                        <Button variant="light" className="theme-btn" type="submit">{loading ?(
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        ):("Login")}
                        
                        </Button> 
                    </Form>
                    
                </div>
        </div>
    )
}

export default GovtLogin
