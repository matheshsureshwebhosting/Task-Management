import axios from 'axios'
import Cookies from 'js-cookie'
import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import "../assest/css/projectreg.css"

export default class Projectreg extends Component {
    constructor(props) {
        super()
        this.state = {
            clientid: localStorage.getItem("clientid"),
            name: null,
            description: null,
        }
    }
    handlechange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    submitbtnsign = async () => {
        const { name, description } = this.state
        await axios.post("/projects", {
            name: name,
            description: description,
            date: new Date().toLocaleString(),
            clientid:[]
        }).then((res) => {
            if (res.data) {
                window.location.replace("/myprojects")
            }
        }).catch((error) => {
            if (error) {
                console.log(error.response);
            }
        })

    }
    render() {
        return (
            <div>
                <div className="card">
                    <h2 className="title"> Project Register</h2>
                    {/* <p className="subtitle">Already have an account? <a href={"javascript"}> sign In</a></p> */}
                    <div className="email-login">
                        <label htmlFor="title"> <b>Project Title</b></label>
                        <input type="text" placeholder="Enter Project Title" onChange={(e) => this.handlechange(e)} name="name" required />

                        <label htmlFor="name"> <b>Description</b></label>
                        <input type="text" placeholder="Enter Project Description" onChange={(e) => this.handlechange(e)} name="description" required />
                    </div>
                    <button className="btn btn-primary mt-3" onClick={this.submitbtnsign}>submit</button>
                </div>
                {/* <ToastContainer /> */}
            </div>

        )
    }
}
