import React, { Component } from 'react'
import { Switch, Route } from "react-router-dom"
import Home from './Pages/Home'
import Login from './Pages/Login'
import Myproject from './Pages/Myproject'
import Projectreg from './Pages/Projectreg'
import Projectview from './Pages/Projectview'
import Signup from './Pages/Signup'
import Taskview from './Pages/Taskview'
import Users from './Pages/Users'
export default class Layout extends Component {
    render() {
        return (
            <div>
                <Switch>
                    <Route exact path="/signup" component={Signup} />
                    <Route exact path="/" component={Login} />
                    <Route exact path="/projectreg" component={Projectreg} />
                    <Route exact path="/home" component={Home} />
                    <Route exact path="/view/:projectid" component={Projectview} />
                    <Route exact path="/taskview/:taskid" component={Taskview} />
                    <Route exact path="/myprojects" component={Myproject} />                    
                    <Route exact path="/users/:projectid" component={Users} />                    
                </Switch>
            </div>
        )
    }
}
