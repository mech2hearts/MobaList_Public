import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import '../styles/styles.css'

export class Profile extends Component{
  state = {
    profile: {}
  }
  componentWillMount(){
    axios.get(`/profile`)
      .then(res => {
        this.setState({
          profile: res.data
        })
    })

  }

  logout = (e) =>{
    e.preventDefault();
    const token = {"token" : localStorage.getItem("key")}
    axios.post(`/logout`, token).then(res => {
      if(res.data==="logged out"){
        localStorage.removeItem("key")
      }
    })
    this.props.history.push('/')
  }

  render(){
    const token = localStorage.getItem("key")
    if(!token) return <Redirect to="/" />
  return(
    <div className="container">
      <div className="row">
        <div className="col s12">
          <div className="card horizontal">
            <div className="card-image">
              <img src="https://pbs.twimg.com/profile_images/549737807397138433/dawb1rEZ_400x400.jpeg" alt="profile" />
            </div>
            <div className="card-stacked">
              <div className="card-content">
                <h3>User: {this.state.profile.username}</h3>

              </div>
              <div className="card-action">

              </div>
            </div>
          </div>
        </div>
        <div className="btn" onClick={this.logout}>Logout</div>
      </div>
    </div>
  )
  }
}

export default Profile
