import React, { useEffect, useRef, useState } from 'react'
import { Form , Button, Spinner } from 'react-bootstrap'
import {Link, useHistory} from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider'
import { captchaRef, db } from '../../firebase'
import '../styles/login.css'

function Register() {
    const {currentUser,peopleRegister,registerConfirmation} = useAuth()

    const [error,setError] = useState()
    const [loading, setLoading] = useState(false)
    const [districtList, setDistrictList] = useState([])
    const [stateList, setStateList] = useState([])
    const [selectedDistrict, setselectedDistrict] = useState([])
    const [selectedState, setselectedState] = useState(null)
    const [rationDealer, setRationDealer] = useState(null)
    const [selectedStateName, setselectedStateName] = useState(null)
    const [cardType, setCardType] = useState(null)
    const [shopList, setShopList] = useState([])
    const [showOTP,setShowOTP] =useState(false)

    const history = useHistory()

    const nameRef = useRef()
    const cardNumberRef = useRef()
    const addressRef = useRef()
    const phoneNumbeRef = useRef()
    const otpRef = useRef()


    useEffect(()=>{
        if(currentUser && currentUser.uid)
        {
            if(currentUser.isGovt)
                history.push("/govt-dashboard")
        }
    },[currentUser])


    function getDistrictList(option)
    {
      var stateName = stateList.filter(state => state.value === parseInt(option))

      setselectedState(option)
      setselectedStateName(stateName[0].name)
      const url =`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${option}`
      var processed =0 
      var districtlist=[]
        fetch(url , {
          "method":"GET",
        })
          .then(res =>res.json())
          .then (list =>{
            list.districts.forEach((district,index)=>{
              processed++
              districtlist.push({name:district.district_name,value:district.district_id})
              if(processed === list.districts.length )
              {
                setDistrictList(districtlist)
              }
            })
          })
      }

    useEffect(() => {
        const url =`https://cdn-api.co-vin.in/api/v2/admin/location/states`
        var processed = 0 
        var states=[]
          fetch(url , {
            "method":"GET",
          })
            .then(res =>res.json())
            .then (list =>{
              list.states.forEach((state)=>{
                processed++
                states.push({name:state.state_name,value:state.state_id})
                if(processed === list.states.length )
                {
                  setStateList(states)
                }
              })
            })
      }, [])


      function getRationShop(district)
      {
        setselectedDistrict(district)
        db.collection("users").where("district","==",district).get().then((docs)=>{
            if(!docs.empty)
            {
                var shoplist = []

                docs.forEach((doc)=>{
                    shoplist.push({uid:doc.id,...doc.data()})
                })
                setShopList(shoplist)
            }else
            {
                setShopList([])
            }
        }) 
      }
      
    function handleRegister(e)
    {
        e.preventDefault()

        window.recaptchaVerifier = new captchaRef.RecaptchaVerifier('recaptcha-container', {
            'size': 'normal',
            'callback': (response) => {
                handleRegistration();
            },
          });

          window.recaptchaVerifier.render()


    }
    function handleOTP(e)
    {
        e.preventDefault()

        registerConfirmation(phoneNumbeRef.current.value,nameRef.current.value,cardNumberRef.current.value,addressRef.current.value,cardType,rationDealer,selectedState,selectedStateName,selectedDistrict , otpRef.current.value).then(()=>{
            setShowOTP(true)
        }).catch((error)=>console.log(error))

    }

    function handleRegistration()
    {
        console.log("huiiiiiiiiii")

        peopleRegister(phoneNumbeRef.current.value, window.recaptchaVerifier).then(()=>{
            setShowOTP(true)
        }).catch((error)=>console.log(error))
    }

    return (
        <div className="login-page">
            <div className="login-page-bg"></div>
                <div className="login-form">
                    <h1 className="login-form-brand">Sustain</h1>                    
                    <h3 className="form-text">Have an account ? <Link to="/login"> Login Now </Link></h3>
                    {error && (
                    <div className="show-error">
                        {error}
                    </div>)}
                        <Form className="my-2" onSubmit={handleRegister}>
                        <Form.Group controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" ref={nameRef} placeholder="Enter your name" />
                        </Form.Group>
                        <Form.Group controlId="name">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="text" ref={phoneNumbeRef} placeholder="Enter your phone Number" />
                        </Form.Group>
                        <Form.Group controlId="cardNumber">
                            <Form.Label>Ration Card Number</Form.Label>
                            <Form.Control type="text" ref={cardNumberRef} placeholder="Enter your card Number" />
                        </Form.Group>
                        <Form.Group controlId="address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" ref={addressRef} placeholder="Enter your address" />
                        </Form.Group>
                        <Form.Group controlId="cardType">
                            <Form.Label>Card Type</Form.Label>
                            <div className="ml-1">
                                <Form.Check inline label="BPL/LPG" name="group1" type="radio" id={`inline-BPL`} onClick={()=>setCardType("BPL/LPG")} />
                                <Form.Check inline label="BPL/Non-LPG" name="group1" type="radio" id={`inline-BPL`} onClick={()=>setCardType("BPL/Non-LPG")} />
                                <Form.Check inline label="APL" name="group1" type="radio" id={`inline-APL`} onClick={()=>setCardType("APL")} />
                                <Form.Check inline label="AY" name="group1" type="radio" id={`inline-AY`} onClick={()=>setCardType("AY")} />
                            </div>
                        </Form.Group>
                        <Form.Group controlId="shopName">
                        <Form.Label>State</Form.Label>
                        <Form.Control as="select"  onChange={(e)=>getDistrictList(e.target.value)} >
                            {stateList && stateList.length > 0 && stateList.map((state,key)=>{
                                return(<option value={state.value} key={key}>{state.name}</option>)
                            })}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="shopName">
                        <Form.Label>District</Form.Label>
                        <Form.Control as="select"  onChange={(e)=>getRationShop(e.target.value)} disabled={districtList.length <= 0 && ("disabled")}>
                            {districtList && districtList.length > 0 && districtList.map((district,key)=>{
                                return(<option key={key}>{district.name}</option>)
                            })}
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="shopName">
                        <Form.Label>Ration Dealer</Form.Label>
                        <Form.Control as="select"  onChange={(e)=>setRationDealer(e.target.value)} disabled={shopList.length <= 0 && ("disabled")}>
                            {shopList && shopList.length > 0 && shopList.map((shop,key)=>{
                                return(<option value={shop.uid} key={key}>{shop.displayName}</option>)
                            })}
                        </Form.Control>
                    </Form.Group>

                        <div id="recaptcha-container"></div>
                        
                       
                        {!showOTP ? (
                        <Button variant="light" className="theme-btn w-100" type="submit">{loading ?(
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        ):("Register")}
                        </Button>
                        ):false}
                        
                         

                        
                    </Form>

                    {showOTP && (
                        <Form className="my-2" onSubmit={handleOTP}>
                            <Form.Group controlId="name">
                                <Form.Label>OTP</Form.Label>
                                <Form.Control type="number" ref={otpRef} placeholder="Enter your OTP" />
                            </Form.Group>
                        <Button variant="light" className="theme-btn" type="submit">{loading ?(
                            <Spinner animation="border" role="status">
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        ):("Register")}
                        
                        </Button> 


                        </Form>
                    )}
                    
                </div>
        </div>
    )
}
export default Register
