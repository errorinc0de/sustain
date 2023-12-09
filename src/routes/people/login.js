import React, { useEffect, useRef, useState } from 'react'
import { Form , Button, Spinner } from 'react-bootstrap'
import {Link, useHistory} from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import '../styles/login.css'
import Sawo from "sawo"

function Login() {

    const {currentUser,logout,peopleLogin} = useAuth()

    const [error,setError] = useState()
    const [loading, setLoading] = useState(false)

    const history = useHistory()

    const passwordRef = useRef()
    const emailRef = useRef()

    async function handleLogout() {    
        try {
          await logout()
          history.push("/hr-login")
        } catch {
          console.log("Failed to log out")
        }
      }


    useEffect(() => {
        var config = {
            containerID: "sawo-container",
            identifierType: "phone_number_sms",
            apiKey: "fcda7114-a385-439f-aef0-6eef92844230",
            onSuccess: (payload) => {
                peopleLogin(payload)
            },
          };
          let sawo = new Sawo(config);
          sawo.showForm();
       }, []);
    
    useEffect(()=>{
        if(currentUser && currentUser.uid)
        {
            if(currentUser.isPeople)
                history.push("/dashboard")
            else
                handleLogout()
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
                    <div
                        id="sawo-container"
                        style={{ height: "300px", width: "300px",marginTop:"300px" }}
                        
                        ></div>
                    
                </div>
        </div>
    )
}

export default Login
