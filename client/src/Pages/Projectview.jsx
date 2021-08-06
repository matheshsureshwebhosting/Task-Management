import React, { Component } from 'react'
import taskimage from '../assest/images/task.png'
import { Link } from 'react-router-dom'
import '../assest/css/task.css'
import axios from 'axios'
import Cookies from 'js-cookie'
import adminStatus from "../helpers/Checkadmin"
export default class Projectview extends Component {

    constructor(props) {
        super()
        this.state = {
            clientid: localStorage.getItem("clientid"),
            mytasks: [],
            admin: false,
            projectid: null,
            title: null,
            description: null,
            startdate: null,
            enddate: null
        }
    }
    componentDidMount = async () => {
        const isadmin = await adminStatus()
        const { projectid } = this.props.match.params
        const tasks = await axios.get(`/task/project/${projectid}`).then((res) => { return res.data }).catch((error) => { if (error) return false })
        if (tasks !== false) {
            if (isadmin === false) {
                const mytasks = await this.filtermyTask(tasks)
                this.setState({ mytasks: mytasks,projectid:projectid })
            } else {
                this.setState({ mytasks: tasks, admin: isadmin,projectid:projectid })
            }
        }
    }

    filtermyTask = async (tasks) => {
        const { clientid } = this.state
        const filtermyTask = new Promise(async (resolve, reject) => {
            const mytasks = []
            for (var i = 0; i < tasks.length; i++) {
                for (var j = 0; j < tasks[i].clientid.length; j++) {
                    if (tasks[i].clientid[j] === clientid) {
                        mytasks.push(tasks[i])
                    }
                }
            }
            return resolve(mytasks)
        })
        return await filtermyTask
    }

    handlechange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    }
    submitTask = async () => {
        const { title, description, startdate, enddate,projectid} = this.state
        const newTask = {
            name: title,
            description: description,
            startdate: startdate,
            enddate: enddate,
            status:"Bending",
            projectid:projectid,
            date:new Date().toLocaleString(),
            clientid:[]
        }        
        const isadmin = await adminStatus()
         if(isadmin===true){
             const addnewTask=await axios.post(`/tasks`,newTask).then((res)=>{return res.data}).catch((error)=>{if(error) return false})
             if(addnewTask===false) return alert("Try Again")
              alert("New Task Created")
              return window.location.reload()
         }
    
    }
    delTask = async (e, taskid) => {
        console.log(taskid);
        const admin = await adminStatus()
        if (admin === true) {
            const deltask = await axios.delete(`/tasks/${taskid}`).then((res) => { return res.data }).catch((error) => { if (error) return false })
            if (deltask === false) return alert("Something Wrong")
            return alert("Task Deleted")
        }
    }
    render() {
        const { mytasks, admin } = this.state
        return (
            <React.Fragment>
                <div className="container mt-3 mb-5">
                    {
                        admin ? <button type="button" style={{ float: "right", marginTop: "-28px" }} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Create Task
                    </button> : null
                    }


                    <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="exampleModalLabel">Create Task</h5>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div className="modal-body">
                                    <div className="email-login">
                                        <label htmlFor="title"> <b>Task Title</b></label>
                                        <input type="text" placeholder="Enter Task Title" onChange={(e) => this.handlechange(e)} name="title" required />

                                        <label htmlFor="des"> <b>Task Description</b></label>
                                        <textarea type="text" placeholder="Enter Task Description" onChange={(e) => this.handlechange(e)} name="description" required />

                                        <label htmlFor="startdate"> <b>Start date</b></label>
                                        <input type="date" placeholder="Enter Start Date" onChange={(e) => this.handlechange(e)} name="startdate" required />

                                        <label htmlFor="enddate"> <b>End date</b></label>
                                        <input type="date" placeholder="Enter End Date" onChange={(e) => this.handlechange(e)} name="enddate" required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-primary" onClick={this.submitTask}>Submit</button>
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="container">
                    <div className="row">
                        {
                            mytasks.length !== 0 ? mytasks.map((task, index) => (
                                <div className="col-lg-12 col-12" key={index}>

                                    <div className="taskcard" style={{ maxHeight: "150px", width: "100%" }}>
                                        <div className="row g-0">

                                            <div className="col-md-2">
                                                <Link to={`/taskview/${task.taskid}`}>
                                                    <img src={taskimage} className="card-img-top" alt="doctor" style={{ width: "130px", marginTop: "-10px" }} />
                                                </Link>
                                            </div>
                                            <div className="col-md-10">
                                                <div className="card-body taskbody">
                                                    <h5 className="card-title">{task.name}  {admin ? <span className="btn btn-danger" onClick={(e) => this.delTask(e, task.id)} style={{ float: "right" }} >Remove Task</span> : null} </h5>
                                                    <Link to={`/taskview/${task.id}`}>
                                                        <p className="blogshort">{task.description}</p>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )) : <div>No Data</div>
                        }



                    </div>
                </div>
            </React.Fragment>
        )
    }
}
