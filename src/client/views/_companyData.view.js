// Licensed under the MIT License.

import React, { Component } from 'react';
import {
  Container, Col, Form,
  FormGroup, Label, Input,
  Button, FormText, FormFeedback,
} from 'reactstrap';


import * as microsoftTeams from '@microsoft/teams-js';

import './_home.view.scss';
import './_companyData.css';

/**
 * The 'GroupTab' component renders the main tab content
 * of your app.
 */
class HomeView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      context: {},
      email: '',
      validate: {
        emailState: '',
      },
      // Access only for specifc user groups
      role: 0,
      finished: false,
      context: {},
      Team_Name: "",
    };
    this.handleChange = this.handleChange.bind(this);
  }


  // React lifecycle method that gets called once a component has finished mounting
  // Learn more: https://reactjs.org/docs/react-component.html#componentdidmount
  componentDidMount() {
    // Get the user context from Teams and set it in the state
    microsoftTeams.getContext((context, error) => {
      this.setState({
        context
      });
    });
    this.state.Team_Name = this.state.context.teamId;
    this.state.role = this.state.context.UserTeamRole;

    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state)
      };

      fetch('/companyDataGet', requestOptions)
        .then(response => response.json())
        .then((res) => {
          console.log(res[0]);
          this.setState({
            Bezeichnung: res[0].Bezeichnung, Mitarbeiterzahl: res[0].Mitarbeiterzahl, Mail: res[0].E_Mail_Adresse, Adresse: res[0].Adresse
          });
        });
    } catch (e) {
      console.log(e);
    }
  
    
  }


  handleChange = async (event) => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    await this.setState({
      [name]: value,
    });
  }

  // check if email has correct format
  validateEmail(e) {
    const emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const { validate } = this.state;
    if (emailRex.test(e.target.value)) {
      validate.emailState = 'has-success';
    } else {
      validate.emailState = 'has-danger';
    }
    this.setState({ validate });
  }

  // sumbit results to db
  submitForm(e) {
    e.preventDefault();
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.state)
      };

      fetch('/companyDataSet', requestOptions)
        .then(response => response.json())
        .then((res) => {
          this.setState({
            finished: true,
          });
          this.forceUpdate();
        });
    } catch (e) {
      console.log(e);
    }
  }

  render() {
    const {
      email, BezeichnungUnternehmen, MitarbeiterzahlUnternehmen, AdresseUnternehmen
    } = this.state;
    const userName = Object.keys(this.state.context).length > 0 ? this.state.context.upn : '';
    const FormComponenent = (this.state.role == 0 && this.state.finished == false) ? (
      <div className= "InputForm">
      <Container className="App">
        <h1>Unternehmensdaten</h1>
        <Form className="form" onSubmit={e => this.submitForm(e)}>

          <Col>
            <FormGroup>
              <Label for="BezeichnungInput">Unternehmensbezeichnung</Label>
              <Input
                name="BezeichnungInput"
                id="BezeichnungInputID"
                type="text"
                placeholder={this.state.Bezeichnung}
                value={BezeichnungUnternehmen}
                onChange={e => this.handleChange(e)}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="MitarbeiterzahlInput">Mitarbeiterzahl</Label>
              <Input
                name="MitarbeiterzahlInput"
                id="MitarbeiterzahlInputID"
                type="text"
                placeholder={this.state.Mitarbeiterzahl}
                value={MitarbeiterzahlUnternehmen}
                onChange={e => this.handleChange(e)}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="AdresseInput">Adresse</Label>
              <Input
                name="AdresseInput"
                id="AdresseInputID"
                type="text"
                placeholder={this.state.Adresse}
                value={AdresseUnternehmen}
                onChange={e => this.handleChange(e)}
              />
            </FormGroup>
          </Col>
          <Col>
          <FormGroup>
        <Label for="exampleEmail">Email</Label>
        <Input type="email" name="mailInput" id="mailInputID" placeholder={this.state.email} onChange={e => {this.handleChange(e); this.validateEmail(e);}} valid={this.state.validate.emailState === 'has-success'}
                invalid={this.state.validate.emailState === 'has-danger'}/>
        <FormFeedback valid>
                Das ist eine valide E-Mail-Adresse!.
              </FormFeedback>
              <FormFeedback invalid>
                Bitte geben Sie eine valide E-Mail-Adresse an!
              </FormFeedback>
              <FormText>Die E-Mail-Adresse Ihres Unternehmens</FormText>
           </FormGroup>
          </Col>
          <Button color="primary">Absenden</Button>
        </Form>
      </Container>
      </div>
    ) : null;

    const finishedComp = this.state.finished ? (
      <div className="finished">
        <h1>Eingabe gesendet</h1>
      </div>
    ) : null;
    const adminComp = (this.state.role != 0 && !this.state.finished) ? (
      <div className="role1">
      <h1>Zugriff nur fuer Administratoren gestattet!</h1>
    </div>
    ) : null;


    return (
      <div className="home">
        
          {FormComponenent}
          {finishedComp}
          {adminComp}
      
      </div>
    );
  }
}
export default HomeView;
