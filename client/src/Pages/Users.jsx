import axios from 'axios'
import React, { Component } from 'react'
import adminStatus from "../helpers/Checkadmin"
export default class Users extends Component {
    constructor(props) {
        super()
        this.state = {
            projectid: null,
            users: [],
            projectdata: null,
            allusers: []
        }
    }
    componentDidMount = async () => {
        const { projectid } = this.props.match.params
        this.setState({ projectid: projectid })
        const getproject = await axios.get(`/projects/${projectid}`).then((res) => { return res.data }).catch((error) => { return false })
        if (getproject !== false) {
            const getusers = await this.getUsers(getproject.clientid)
            this.setState({ users: getusers })
        }
        const allusers = await this.allUsers()
        this.setState({ allusers: allusers })
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
    getUsers = async (clientid) => {
        const getUsers = new Promise(async (resolve, reject) => {
            const taskUsers = []
            for (var i = 0; i < clientid.length; i++) {
                const getUserdata = await axios.get(`/users?filter=%7B%0A%0A%20%20%22where%22%3A%20%7B%0A%20%20%20%20%22clientid%22%3A%22${clientid[i]}%22%0A%20%20%7D%0A%7D`).then((res) => {
                    return res.data
                }).catch((error) => {
                    if (error) return false
                })
                if (getUserdata !== false) {
                    taskUsers.push({ name: getUserdata[0].name, email: getUserdata[0].email, clientid: getUserdata[0].clientid })
                }
            }
            return resolve(taskUsers)
        })
        return await getUsers
    }
    removeUser = async (e, clientid) => {
        const { projectid } = this.state
        const admin = await adminStatus()
        console.log(projectid);
        if (admin === true) {
            const removeUser = await axios.post(`/project/removeclientid/${projectid}`, {
                clientid: clientid
            }).then((res) => { return res.data }).catch((error) => { return false })
            if (removeUser === false) return alert("Something Wrong")
            alert("User Removed")
            return window.location.reload()
        }

    }
    handlechangegetemail = (e) => {
        const email = e.target.value
        this.setState({ newusers: email })
    }
    addnewUser = async () => {
        const { newusers, users, projectid } = this.state
        console.log(projectid);
        const admin = await adminStatus()
        if (admin === true) {
            const filtercorrectuser = await this.filterCorrectuser(newusers)
            if (filtercorrectuser.length === 0) return alert("User Not Founded")
            const checkUser = await users.filter((user) => { return user.clientid === filtercorrectuser[0] })
            if (checkUser.length !== 0) return alert("Already Added")
            const adduserinTask = await axios.post(`/project/updateclientid/${projectid}`, {
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
        const { users } = this.state
        return (
            <div>
                <div style={{ float: "right", margin: "10px" }}>
                    <button className="btn btn-info" data-bs-toggle="modal" data-bs-target="#exampleModal" >Add User</button>
                </div>
                <table className="table">
                    <thead >
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.length !== 0 ? users.map((user, index) => (
                                <tr key={index}>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td><button className="btn btn-danger" onClick={(e) => this.removeUser(e, user.clientid)}>Remove User</button></td>
                                </tr>
                            )) : null
                        }
                    </tbody>
                </table>

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
        )
    }
}
