import axios from 'axios'
import Cookies from 'js-cookie'
import React, { Component } from 'react'
import { Link, Redirect } from 'react-router-dom'
import '../assest/css/signup.css'

export default class Signup extends Component {
    constructor(props) {
        super()
        this.state = {
            name: null,
            email: null,            
            password: null,
            clientid: localStorage.getItem("clientid")
        }

    }
    handlechange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    submitbtnsign = async () => {
        const { name, email, password } = this.state
        await axios.post("/users", {
            name: name,
            email: email,            
            password: password,
            isadmin:false
        }).then((res) => {
            console.log(res.data)
            localStorage.setItem("clientid", res.data.clientid)
            if (res.data.clientid) {
                window.location.replace("/home")
            }
        }).catch((error) => {
            if (error) {
                console.log(error.response);
            }
        })
    }
    render() {
        const { clientid } = this.state        
        if (clientid !== null) {
            return <Redirect to="/home" />
        }
        return (
            <div>

                <div className="card">
                    <h2 className="title"> Sign Up</h2>
                    {/* <p className="subtitle">Already have an account? <a href={"javascript"}> sign In</a></p> */}
                    <div className="email-login">
                        <label htmlFor="email"> <b>Name</b></label>
                        <input type="text" placeholder="Enter Name" onChange={(e) => this.handlechange(e)} name="name" required />

                        <label htmlFor="email"> <b>Email</b></label>
                        <input type="email" placeholder="Enter Email" onChange={(e) => this.handlechange(e)} name="email" required />                       

                        <label htmlFor="psw"><b>Password</b></label>
                        <input type="password" placeholder="Enter Password" onChange={(e) => this.handlechange(e)} name="password" required />

                    </div>
                    <button className="btn btn-primary" onClick={this.submitbtnsign}>Sign Up</button>
                    <p className="subtitle mt-3">Already have an account? <Link to="/" > sign In</Link></p>
                </div>
                {/* <ToastContainer /> */}
            </div>

        )
    }
}
