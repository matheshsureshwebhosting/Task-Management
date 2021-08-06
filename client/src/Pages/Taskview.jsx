import axios from 'axios'
import Cookies from 'js-cookie'
import React, { Component } from 'react'
import '../assest/css/taskview.css'
import { Admincontext } from "../contexts/Admincontext"
import adminStatus from "../helpers/Checkadmin"
export default class Taskview extends Component {
    static contextType = Admincontext
    constructor(props) {
        super()
        this.state = {
            token: Cookies.get("_uid"),
            mytasks: [],
            taskid: null,
            admin: false,
            status: null,
            users: [],
            allusers: [],
            newusers: null,
            taskStatus: ["Processing", "Completed", "Bending"]
        }
    }
    componentDidMount = async () => {
        const { taskid } = this.props.match.params
        const isadmin = await adminStatus()
        const viewTask = await axios.get(`/tasks/${taskid}`).then((res) => { return res.data }).catch((error) => { if (error) return false })
        if (viewTask !== false) {
            this.setState({
                mytasks: viewTask,
                admin: isadmin,
                taskid: taskid
            })
        }
        if (isadmin === true) {
            const taskUsers = await this.getUsers()
            if (taskUsers.length !== 0) {
                this.setState({ users: taskUsers })
            }
            const allusers = await this.allUsers()
            if (allusers.length !== 0) {
                this.setState({ allusers: allusers })
            }
        }

    }
    allUsers = async () => {
        const allUsers = new Promise(async (resolve, reject) => {
            const users = await axios.get(`/users`).then((res) => { return res.data }).catch((error) => { return false })
            if (users !== false) {
                return resolve(users)
            }
        })
        return await allUsers
    }
    getUsers = async () => {
        const getUsers = new Promise(async (resolve, reject) => {
            const { clientid } = this.state.mytasks
            const taskUsers = []
            for (var i = 0; i < clientid.length; i++) {
                const getUserdata = await axios.get(`/users?filter=%7B%0A%0A%20%20%22where%22%3A%20%7B%0A%20%20%20%20%22clientid%22%3A%22${clientid[i]}%22%0A%20%20%7D%0A%7D`).then((res) => {
                    return res.data
                }).catch((error) => {
                    if (error) return false
                })
                if (getUserdata !== false) {
                    taskUsers.push({ email: getUserdata[0].email, clientid: getUserdata[0].clientid })
                }
            }
            return resolve(taskUsers)
        })
        return await getUsers
    }


    removeUser = async (e, removeclientid) => {
        const admin = await adminStatus()
        const { taskid } = this.state
        if (admin === true) {
            const removeuserinTask = await axios.post(`/task/removeclientid/${taskid}`, {
                clientid: removeclientid
            }).then((res) => { return res.data }).catch((error) => { if (error) return false });
            if (removeuserinTask === false) return alert("Something Wrong")
            alert("User Removed In Task")
            return window.location.reload()
        }

    }

    handlechange = (e) => {
        this.setState({ status: e.target.value })
    }
    updateStatus = async () => {
        const { taskid, status } = this.state
        const chanestatus = await axios.post(`/task/updatestatus/${taskid}`, {
            status: status
        }).then((res) => { return res.data }).catch((error) => { if (error) return false })
        if (chanestatus === false) return alert("Tray Again")
        return window.location.reload()
    }
    handlechangegetemail = (e) => {
        const email = e.target.value
        this.setState({ newusers: email })
    }
    addnewUser = async () => {
        const { newusers, users, taskid } = this.state
        const admin = await adminStatus()
        if (admin === true) {
            const filtercorrectuser = await this.filterCorrectuser(newusers)
            if (filtercorrectuser.length === 0) return alert("User Not Founded")
            const checkUser = await users.filter((user) => { return user.clientid === filtercorrectuser[0] })
            if (checkUser.length !== 0) return alert("Already Added")
            const adduserinTask = await axios.post(`/task/updateclientid/${taskid}`, {
                clientid: filtercorrectuser[0]
            }).then((res) => { return res.data }).catch((error) => { if (error) return false })
            if (adduserinTask === false) return alert("Something Wrong")
            alert("User Added In Task")
            return window.location.reload()
        }
    }
    filterCorrectuser = async (newuseremail) => {
        const filterCorrectuser = new Promise(async (resolve, reject) => {
            const { allusers } = this.state
            const user = []
            for (var i = 0; i < allusers.length; i++) {
                if (allusers[i].email === newuseremail) {
                    user.push(allusers[i].clientid)
                }
            }
            return resolve(user)
        })
        return await filterCorrectuser
    }
    render() {
        const { mytasks, taskStatus, admin, users } = this.state
        return (
            <div className="container">
                <div className="row">
                    {
                        mytasks.length !== 0 ? (
                            <div className="col-md-5"><div className="card taskcard">
                                <h2 className="title mb-5"> Task Details</h2>
                                <h6><b>Title</b></h6>
                                <p>{mytasks.title}</p>
                                <h6><b>Task Description</b></h6>
                                <p>{mytasks.description}</p>
                                <h6><b>Start date</b></h6>
                                <p>{mytasks.startdate}</p>
                                <h6><b>End date</b></h6>
                                <p>{mytasks.enddate}</p>
                                <h6><b>Status</b></h6>
                                <p>{mytasks.status}</p>
                            </div></div>
                        ) : null
                    }
                        <div className="col-md-2"></div>
                    <div className="col-md-5">
                        <div className="col-lg-12">
                            {
                                admin ? (
                                    <div className="card taskcard">
                                        <h5 className="mb-5"> <b>Users</b><span className="btn btn-info" style={{ float: "right" }} data-bs-toggle="modal" data-bs-target="#exampleModal" >Add User</span></h5>
                                        {
                                            users.length !== 0 ? users.map((user, index) => (
                                                <p key={index}><b>{user.email}</b>  <span className="btn btn-danger" style={{ float: "right" }} onClick={(e) => this.removeUser(e, user.clientid)} >Remove User</span></p>
                                            )) : null
                                        }
                                    </div>
                                ) : null
                            }

                            <div className="card taskcard">
                                <h5 className="mb-5"> <b>Update Status</b></h5>

                                <div>
                                    <select style={{ width: "47%" }} name="status" id="status" className="form-select" onChange={(e) => this.handlechange(e)} >
                                        {
                                            taskStatus.map((tasksts, index) => (
                                                tasksts === mytasks.status ? <option key={index} selected value={tasksts}  >{tasksts}</option> : <option key={index} value={tasksts} >{tasksts}</option>
                                            ))
                                        }
                                    </select>  <span className="btn btn-info" onClick={this.updateStatus} style={{ float: "right", marginTop: "-39px" }}>Update Status</span>
                                </div>


                            </div>


                            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="exampleModalLabel">Add User</h5>
                                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="email-login">
                                                <label htmlFor="email"> <b>User Email</b></label>
                                                <input type="email" placeholder="Enter User Email" onChange={(e) => this.handlechangegetemail(e)} name="email" required />
                                            </div>
                                        </div>
                                        <div className="modal-footer">
                                            <button type="button" className="btn btn-primary" onClick={this.addnewUser} >Submit</button>
                                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* </div> */}
                    </div>


                    {/* <ToastContainer /> */}
                </div>
            </div>
        )
    }
}
