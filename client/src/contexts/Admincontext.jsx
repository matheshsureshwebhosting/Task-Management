import React, { Component } from 'react'
export const Admincontext = React.createContext()
export default class AdmincontextProvider extends Component {
    constructor(props) {
        super()
        this.state = {
            admin: false
        }
    }
    changeAdmin = () => {    
        console.log("changeAdmin");    
        this.setState({ admin: true })
    }
    render() {
        return (
            <Admincontext.Provider value={
                {
                    ...this.state,
                    changeAdmin: this.changeAdmin
                }
            }>
                {this.props.children}
            </Admincontext.Provider>
        )
    }
}
