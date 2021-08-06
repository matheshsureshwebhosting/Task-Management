import React, { Component } from 'react'
import AdmincontextProvider from './contexts/Admincontext'
import axios, { AxiosResponse, AxiosInstance } from 'axios';
import Layout from './Layout'
import Header from './Pages/Header'

export default class App extends Component {
  render() {
    return (
      <div>
        <AdmincontextProvider>
          <Header />
          <Layout />
        </AdmincontextProvider>
      </div>
    )
  }
}
