import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'
import fgoIcon from '../images/icons/fgo.jpg'
import garupaIcon from '../images/icons/bangdream.jpg'
import deresuteIcon from '../images/icons/deresute.png'
import '../styles/styles.css'
import {
    Accordion,
    AccordionItem,
    AccordionItemBody,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';


class SignUp extends Component {
  state={
    username: '',
    password: '',
    email: '',
    gameSelect: [],
    fgoJP: {
      gameName:'Fate/Grand Order JP',
      fgoIGN: '',
      fgoFC: '',
      fgoPrivate: false,
      fgoTC: '',
      fgoPlayTime: 0
    },
    bangDreamEN: {
      gameName:'Bang Dream: Girls Band Party EN',
      bdIGN: '',
      bdFC: '',
      bdPrivate: false,
      bdTC: '',
      bdPlayTime: 0
    },
    deresute: {
      gameName:'Idolm@ster Cinderella Girls: Starlight Stage',
      cgIGN: '',
      cgFC: '',
      cgPrivate: false,
      cgTC: '',
      cgPlayTime: 0
    },
    clickedGames: [false,false,false],
    select: false
  }

  gameClick = (num) => {
    var newArray = this.state.clickedGames
    var wonder = newArray[num]
    newArray[num] = !wonder
    this.setState({
      clickedGames: newArray
    })
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  fgoChange = (e) => {
    e.persist()
    this.setState(prevState => ({
      [e.target.name]: {
          ...prevState.fgoJP,
          [e.target.id]: e.target.value
      }
  }))
  }
  bdChange = (e) => {
    e.persist()
    this.setState(prevState => ({
      [e.target.name]: {
          ...prevState.bangDreamEN,
          [e.target.id]: e.target.value
      }
  }))
  }
  cgChange = (e) => {
    e.persist()
    this.setState(prevState => ({
      [e.target.name]: {
          ...prevState.deresute,
          [e.target.id]: e.target.value
      }
  }))
  }

  handlefgoCheck = (e) => {
    e.persist()
    this.setState(prevState => ({
      [e.target.name]: {
          ...prevState.fgoJP,
          fgoPrivate: !this.state.fgoJP.fgoPrivate
      }
    }))
  }
  handlebdCheck = (e) => {
    e.persist()
    this.setState(prevState => ({
      [e.target.name]: {
          ...prevState.bangDreamEN,
          bdPrivate: !this.state.bangDreamEN.bdPrivate
      }
    }))
  }
  handlecgCheck = (e) => {
    e.persist()
    this.setState(prevState => ({
      [e.target.name]: {
          ...prevState.deresute,
          cgPrivate: !this.state.deresute.cgPrivate
      }
    }))
  }

  handleSubmit = (e) => {
    e.preventDefault()
    console.log(this.state);
    const userInfo = {
      username: this.state.username,
      password: this.state.password,
      email: this.state.email,
      fgoJP: this.state.fgoJP,
      bangDreamEN: this.state.bangDreamEN,
      deresute: this.state.deresute
    }
    axios.post(`/signup`, userInfo)
      .then(res => {
        console.log("Sign Up Successful");
        this.props.history.push("/login");
      })

  }

  render(){

    var fgo = this.state.clickedGames[0] ? {borderStyle: 'solid',borderWidth: '2px', borderColor: '#00C5FF'} : {}
    var bd = this.state.clickedGames[1] ? {borderStyle: 'solid',borderWidth: '2px', borderColor: '#00C5FF'} : {}
    var cg = this.state.clickedGames[2] ? {borderStyle: 'solid',borderWidth: '2px', borderColor: '#00C5FF'} : {}
    const token = localStorage.getItem("key")
    if(token) return <Redirect to="/profile" />
    return(
      <div className="container">
        <h3>Sign Up</h3>
        <div className="row z-depth-2">
          <div className="col s12 white z-depth-1">
            <form>
              <div className="input-field">
                <input type="text" id="username" value={this.state.username} onChange={this.handleChange} />
                <label htmlFor="username">Username</label>
              </div>
              <div className="input-field">
                <input type="text" id="password" value={this.state.password} onChange={this.handleChange} />
                <label htmlFor="password">Password</label>
              </div>
              <div className="input-field">
                <input type="email" id="email" value={this.state.email} onChange={this.handleChange} />
                <label htmlFor="email">Email</label>
              </div>
            </form>

            <p>Select which mobile games you play</p>
            <div className="row">
              <div className="col s4">
                <div className="waves-effect waves-light" onClick={()=>{this.gameClick(0)}}>
                  <img src={fgoIcon} className="iconImg" alt="F/GO JP" style={fgo} />
                </div>
              </div>
              <div className="col s4">
                <div className="waves-effect waves-light" onClick={()=>{this.gameClick(1)}} >
                  <img src={garupaIcon} className="iconImg" alt="Bang Dream EN" style={bd} />
                </div>
              </div>
              <div className="col s4">
                <div className="waves-effect waves-light" onClick={()=>{this.gameClick(2)}}>
                  <img src={deresuteIcon} className="iconImg" alt="Deresute" style={cg} />
                </div>
              </div>
            </div>


            <div className="row">
              <div className="col s12">
                <Accordion>
                  <AccordionItem expanded={this.state.clickedGames[0]}>
                    <AccordionItemBody>
                      <strong>Fate/Grand Order JP</strong>
                      <form>
                        <div className="input-field">
                          <input type="text" name="fgoJP" id="fgoIGN" onChange={this.fgoChange} />
                          <label htmlFor="fgoIGN">In-Game-Name</label>
                        </div>
                        <div className="input-field">
                          <input type="text" name="fgoJP" id="fgoFC" onChange={this.fgoChange} />
                          <label htmlFor="friendCode">Friend Code</label>
                        </div>
                        <div className="input-field">
                          <input type="text" name="fgoJP" id="fgoTC" onChange={this.fgoChange} />
                          <label htmlFor="transferCode">Transfer Code</label>
                        </div>
                        <label>
                          <input type="checkbox" name="fgoJP" defaultChecked={this.state.fgoJP.fgoPrivate} onChange={this.handlefgoCheck}/>
                          <span>Make friend code public?</span>
                        </label>
                      </form>
                    </AccordionItemBody>
                  </AccordionItem>
                </Accordion>
                <Accordion>
                  <AccordionItem expanded={this.state.clickedGames[1]}>
                    <AccordionItemBody>
                      <strong>Bang Dream: Girls Band Party EN</strong>
                      <form>
                        <div className="input-field">
                          <input type="text" name="bangDreamEN" id="bdIGN" onChange={this.bdChange} />
                          <label htmlFor="bdIGN">In-Game-Name</label>
                        </div>
                        <div className="input-field">
                          <input type="text" name="bangDreamEN" id="bdFC" onChange={this.bdChange} />
                          <label htmlFor="friendCode">Friend Code</label>
                        </div>
                        <div className="input-field">
                          <input type="text" name="bangDreamEN" id="bdTC" onChange={this.bdChange} />
                          <label htmlFor="transferCode">Transfer Code</label>
                        </div>
                        <label>
                          <input type="checkbox" name="bangDreamEN" checked={this.state.bangDreamEN.bdPrivate} onChange={this.handlebdCheck}/>
                          <span>Make friend code public?</span>
                        </label>
                      </form>
                    </AccordionItemBody>
                  </AccordionItem>
                </Accordion>
                <Accordion>
                  <AccordionItem expanded={this.state.clickedGames[2]}>
                    <AccordionItemBody>
                      <strong>Idolm@ster Cinderella Girls: Starlight Stage</strong>
                      <form>
                        <div className="input-field">
                          <input type="text" name="deresute" id="cgIGN" onChange={this.cgChange} />
                          <label htmlFor="cgIGN">In-Game-Name</label>
                        </div>
                        <div className="input-field">
                          <input type="text" name="deresute" id="cgFC" onChange={this.cgChange} />
                          <label htmlFor="friendCode">Friend Code</label>
                        </div>
                        <div className="input-field">
                          <input type="text" name="deresute" id="cgTC" onChange={this.cgChange} />
                          <label htmlFor="transferCode">Transfer Code</label>
                        </div>
                        <label>
                          <input type="checkbox" name="deresute" checked={this.state.deresute.cgPrivate} onChange={this.handlecgCheck}/>
                          <span>Make friend code public?</span>
                        </label>
                      </form>
                    </AccordionItemBody>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>
            <div className="btn blue waves-effect waves-light" onClick={this.handleSubmit}>Sign Up</div>
            <br />
            <br />
          </div>
        </div>
      </div>
    )
  }
}

export default SignUp
