import React, { useEffect, useRef, useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { db } from '../../../firebase'
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthProvider';

function AddShop(props) {

    const shopNameRef = useRef()
    const shopAddressRef = useRef()
    const shopContactRef= useRef()
    const shopLoginCodeRef= useRef()
    const wardNoRef = useRef()

    const [districtList, setDistrictList] = useState([])
    const [stateList, setStateList] = useState([])
    const [selectedDistrict, setselectedDistrict] = useState([])
    const [selectedState, setselectedState] = useState(null)
    const [selectedStateName, setselectedStateName] = useState(null)

    const {currentUser} = useAuth()

    function handleClose() {
        props.onHide();
    }

    function handleAddShop(e)
    {
        e.preventDefault()
        db.collection("users").add({
            displayName: shopNameRef.current.value,
            isRationShop:true,
            address:shopAddressRef.current.value,
            phoneNumber : shopContactRef.current.value ,
            loginCode : shopLoginCodeRef.current.value,
            wardNo:wardNoRef.current.value,
            district: selectedDistrict,
            stateId:selectedState,
            state: selectedStateName,
            addedByID: currentUser.uid,
            addedByName: currentUser.displayName,
        }).then(()=>{

            props.onHide()

            toast.success('Ration shop added successfully !!', {
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

    function getDistrictList(option)
    {
      var stateName = stateList.filter(state => state.value === parseInt(option))

      console.log(stateName)
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
    return (
        <div>

              <Modal centered show={props.show} onHide={handleClose}>
                <Modal.Header>
                    Add Ration Shop
                </Modal.Header>
                <Modal.Body>
                <Form className="my-2" onSubmit={handleAddShop}>
                    <Form.Group controlId="shopName">
                        <Form.Label>Shop Name</Form.Label>
                        <Form.Control type="text" ref={shopNameRef} placeholder="Enter Ration Shop Name" />
                    </Form.Group>
                    <Form.Group controlId="shopName">
                        <Form.Label>Shop Address</Form.Label>
                        <Form.Control type="text" ref={shopAddressRef} placeholder="Enter Ration Shop Address" />
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
                        <Form.Control as="select"  onChange={(e)=>setselectedDistrict(e.target.value)} disabled={districtList.length <= 0 && ("disabled")}>
                            {districtList && districtList.length > 0 && districtList.map((district,key)=>{
                                return(<option key={key}>{district.name}</option>)
                            })}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="ward">
                        <Form.Label>Ward No. </Form.Label>
                        <Form.Control type="number" ref={wardNoRef} placeholder="Enter ward no." />
                    </Form.Group>
                    <Form.Group controlId="shopName">
                        <Form.Label>Shop Contact</Form.Label>
                        <Form.Control type="number" ref={shopContactRef} placeholder="Enter Ration Shop Phone Number" />
                    </Form.Group>
                    <Form.Group controlId="shopName">
                        <Form.Label>Login Code</Form.Label>
                        <Form.Control type="number" ref={shopLoginCodeRef} placeholder="Enter Ration Shop login code" />
                    </Form.Group>

                    <Button variant="dark" type="submit">
                        Add Store
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

export default AddShop
