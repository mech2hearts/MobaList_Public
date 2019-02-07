import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import Home from './components/Home'
import SignUp from './components/SignUp'
import Profile from './components/Profile'
import Login from './components/Login'
import axios from 'axios'

class App extends Component {

  state: {
    loggedIn: false
  }

  componentWillMount(){
    axios.post(`/auth`, {"token" : localStorage.getItem("key")}).then(res => {
      if (res.data === "invalid"){
        this.setState({loggedIn: false})
      }
      else if (res.data === "clear"){
        localStorage.removeItem("key")
        this.setState({loggedIn: false})
      }
      else if (res.data === "valid"){
        console.log('success')
        this.setState({loggedIn: true})
        console.log(this.state)
      }
    })
  }

  render() {
    return (
      <BrowserRouter>
        <div className="container">
          <div className="row">
            <div className="col s12">
              <div className="App">
              <Switch>
                <Route exact path ='/' component={Home} />
                <Route path ='/signup' component={SignUp} />
                <Route path ='/profile' component={Profile} />
                <Route path ='/login' component={Login} />
              </Switch>
              </div>
            </div>
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
