import React, { Component } from 'react'
import usericon from "../assest/images/profilepic.png"
import '../assest/css/header.css'
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie'
import { Admincontext } from "../contexts/Admincontext"
import adminStatus from "../helpers/Checkadmin"
export default class Header extends Component {
    static contextType = Admincontext
    constructor(porps) {
        super()
        this.state = {
            clientid: localStorage.getItem("clientid"),
            admin: false
        }
    }
    logout = () => {
        localStorage.removeItem("clientid")
        window.location.replace("/")
    }
    componentDidMount = async () => {
        const admin = await adminStatus()
        if (admin === true) {
            this.setState({ admin: true })
        }
    }
    render() {
        const { clientid, admin } = this.state
        return (
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <a className="navbar-brand" href={clientid === null ? "/" : "/home"} ><b>Task Management</b></a>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav me-auto mb-2 mb-lg-0">

                            </ul>
                            {
                                clientid === undefined ? null : <div className="d-flex">
                                    <div className="dropdown">
                                        <span type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                            <img src={usericon} width="40" height="40" className="rounded-circle" alt="" />
                                        </span>
                                        <ul className="dropdown-menu" id="profiledrop" aria-labelledby="dropdownMenuButton1">
                                            <li><Link to={admin? "/myprojects" : "/home"} className="dropdown-item">My Projects</Link></li>
                                            {
                                                admin ? <li><Link to="/projectreg" className="dropdown-item">Create Project</Link></li> : null
                                            }
                                            <li><a className="dropdown-item" href="##" onClick={this.logout}>Logout</a></li>
                                        </ul>
                                    </div>
                                </div>
                            }

                        </div>
                    </div>
                </nav>
            </div>
        )
    }
}
