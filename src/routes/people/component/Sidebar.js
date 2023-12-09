import { faBullhorn, faCartPlus, faCashRegister, faFileContract, faHome, faSignOutAlt, faStore, faUserCheck, faUserTie } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { NavLink, useHistory } from 'react-router-dom'
import { useAuth } from '../../../context/AuthProvider'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from '../../../img/logo.png'
function Sidebar() {

    const history = useHistory()
    const {logout} = useAuth()

    async function handleLogout() {    
        try {
          await logout()
          history.push("/login")
        } catch {
          console.log("Failed to log out")
        }
      }
    return (
        <div className="sidebar">
            <img src={logo} alt="logo" className="sidebar-brand img-fluid" />
            <ul className="sidebar-ul">
                <NavLink to="/govt-dashboard" activeClassName="active"><li><FontAwesomeIcon icon={faHome} /><span>Home</span></li></NavLink>
                <NavLink to="/quota" activeClassName="active" ><li><FontAwesomeIcon icon={faCartPlus} /><span>Orders</span></li></NavLink>
                <NavLink to="/verification" activeClassName="active"><li><FontAwesomeIcon icon={faUserTie} /><span>Jobs</span></li></NavLink>
                <li><button variant="light" onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt}/><span>Sign out</span></button></li>
            </ul>
        </div>
    )
}

export default Sidebar
