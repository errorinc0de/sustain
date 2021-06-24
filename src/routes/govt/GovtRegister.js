import React, { useEffect, useRef, useState } from 'react'
import {Form , Button , Spinner } from 'react-bootstrap'
import {Link, useHistory} from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { db } from '../../firebase'

function GovtRegister() {
    const [error , setError] = useState()
    const [loading , setLoading] = useState(false)


    const {currentUser,GovSignup} = useAuth()

    const emailRef = useRef()
    const passwordRef = useRef()
    const stateRef = useRef()
    const nameRef = useRef()

    const history = useHistory()

    const states =["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand" ,"Karnataka", "Kerala", "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal	"]

    function handleRegister(e)
    {
        e.preventDefault()

        setLoading(true)
        setError()
        if(stateRef.current.value === '')
        {
            setError("Please Select Your Address")
            setLoading(false)
            return
        }
        else if(passwordRef.current.value.length < 6)
        {
            setError("Password Must have 6 characters")
            setLoading(false)
            return
        }
        else if(!(/^([a-zA-Z0-9]+)@([a-zA-Z0-9]+)\.gov\.in$/.test(emailRef.current.value)))
        {
            setError("Please use a goverment provided domain to signup")
            setLoading(false)
            return
        }
        else
        {
            GovSignup(emailRef.current.value,passwordRef.current.value,nameRef.current.value,stateRef.current.value).then(()=>{
                history.push("/govt-dashboard")
            }).catch((error)=>{
                setLoading(false)
                setError(error)
            })
        }
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
                    <h3 className="form-text">Don't have an account ? <Link to="/govt-login"> Login Now </Link></h3>
                    <Form className="my-2" onSubmit={handleRegister}>
                        <Form.Group controlId="name">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" placeholder="Enter Full Name" ref={nameRef} required/>
                        </Form.Group>
                        <Form.Group controlId="emailId">
                            <Form.Label>Email ID</Form.Label>
                            <Form.Control type="email" placeholder="Enter Email Id" ref={emailRef} required/>
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password" ref={passwordRef} required/>
                        </Form.Group>
                        <Form.Group controlId="phoneNumber">
                            <Form.Label>State</Form.Label>
                                <Form.Control as="select" ref={stateRef} custom required>
                                <option value="" selected hidden>Select Your State</option>
                                {states && states.map((state,key)=>{
                                    return (<option key={key}>{state}</option>)
                                })}
                                </Form.Control>
                        </Form.Group>
                        {error && (
                        <div className="show-error">
                            {error}
                        </div>)}
                        <Button variant="light" className="theme-btn" type="submit">{loading ?(
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        ):("Register")}
                        
                        </Button> 
                        
                        
                    </Form>
                    
                </div>
        </div>
    )
}

export default GovtRegister
