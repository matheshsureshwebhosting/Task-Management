import React, { Component } from 'react'
import "../assest/css/home.css"
import { Link, Redirect } from 'react-router-dom'
import Cookies from 'js-cookie'
import axios from 'axios'
import adminStatus from "../helpers/Checkadmin"
export default class Myproject extends Component {

    constructor(props) {
        super()
        this.state = {
            clientid: localStorage.getItem("clientid"),
            myprojects: [],
            admin: false
        }
    }

    componentDidMount = async () => {
        const myproject = await axios.get("/projects").then(async res => {
            return res.data
        }).catch((error) => { if (error) return false })
        const isadmin = await adminStatus()
        if (isadmin === false) {
           return window.location.replace("/home")
        } else {
            this.setState({ myprojects: myproject, admin: isadmin })
        }
    }
    filterMyproject = async (projects) => {
        const { clientid } = this.state
        const filterMyproject = new Promise(async (resolve, reject) => {
            const myprojects = []
            for (var i = 0; i < projects.length; i++) {
                for (var j = 0; j < projects[i].clientid.length; j++) {
                    if (projects[i].clientid[j] === clientid) {
                        myprojects.push(projects[i])
                    }
                }
            }
            return resolve(myprojects)
        })
        return await filterMyproject
    }
    render() {
        const { clientid, myprojects } = this.state
        if (clientid === undefined) {
            return <Redirect to="/" />
        }      
        return (
            <div className="container">
                <div className="row">
                    {
                        myprojects.length !== 0 ? myprojects.map((project, index) => (
                            <div className="col-md-6" key={index}>
                                <Link to={`/users/${project.id}`}><div className="homecard mb-3" style={{ maxWidth: "540px" }}>
                                    <div className="card-body">
                                        <h5 className="card-title">{project.name}</h5>
                                        <p className="blogshort">{project.description}</p>

                                    </div>
                                </div>
                                </Link>
                            </div>
                        )) : <div>No Data</div>
                    }

                </div>
            </div>
        )
    }
}
