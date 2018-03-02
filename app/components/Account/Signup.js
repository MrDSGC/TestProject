import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux'
import { signup } from '../../actions/auth';

import axios from 'axios';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

import ConfirmDialog from '../CommonComponents/ConfirmDialog';
import Messages from '../Messages';
import Snackbar from 'material-ui/Snackbar';

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSignupClick = this.handleSignupClick.bind(this);

    this.handleRequestInviteDialogClick = this.handleRequestInviteDialogClick.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);

    this.handleRequestInviteSubmit = this.handleRequestInviteSubmit.bind(this);

    var inviteCode = "";

    if (this.props.location.query.inviteCode) {
      inviteCode = this.props.location.query.inviteCode;
    }

    this.state = {
      email: '',
      password: '',
      inviteCode: inviteCode,
      emailError: '',
      passwordError: '',
      inviteCodeError: '',

      emailRequestInvite: '',
      linkedinUrl: '',
      projectDesc: '',
      whyJoin: '',
      howDidYouHear: '',

      showRequestInviteDialog: false,
      snackBarMessageModal: {
        open: false,
        message: ''
      }
    };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleRequestInviteDialogClick() {
    this.setState({
      showRequestInviteDialog:true
    })
  }

  handleDialogClose() {
    this.setState({
      showRequestInviteDialog:false
    })
  }

  handleRequestInviteSubmit() {
    var inviteRequest = {
      linkedinUrl: this.state.linkedinUrl,
      projectDesc: this.state.projectDesc,
      whyJoin: this.state.whyJoin,
      howDidYouHear: this.state.howDidYouHear,
      emailRequestInvite: this.state.emailRequestInvite
    }

    axios.post(
      '/api/inviteRequest',
      {inviteRequest}
    ).then( (response) => {
      // close form. reset fields.
      this.setState({
        snackBarMessageModal: {
          open: true,
          message: "Thanks! We'll get back to you shortly!"
        },
        showRequestInviteDialog: false,
        emailRequestInvite: '',
        linkedinUrl: '',
        projectDesc: '',
        whyJoin: '',
        howDidYouHear: ''
      })
    });
  }

  handleSnackBarClose() {
    this.setState({snackBarMessageModal: {open: false}});
  }

  handleSignupClick(event) {
    event.preventDefault();

    var newState = this.state;
    newState.emailError = "";
    newState.passwordError = "";
    newState.inviteCodeError = "";
    var containsError = false;

    if (!this.state.email.length) {
      newState.emailError ="Please provide a valid email address";
      this.setState(newState);
      containsError = true;
    }

    if (!this.state.password.length) {
      newState.passwordError ="Please provide a valid password"
      this.setState(newState)
      containsError = true;
    }

    if(!containsError) {
      this.props.signup(this.state.email, this.state.password, this.state.inviteCode);
    }
  }

  render() {
    var requestInviteForm =
      <div className="container-fluid">
        <div className="page-header-text">
          <span className="section-title-border">
            Request an Invite
          </span>
        </div>

        <p className="u-margin-top-small">
          <b> A few quick questions.</b> We will send you a personal invite. We respond in less than 4 hrs.
          <br/>
        </p>

        <div className="row u-margin-top-small form-container-center">
          <div className="col-xs-12 col-md-4">
            <b>Email Address</b>
          </div>
          <div className="col-xs-12 col-md-7">
            <TextField
              className='vertically-center'
              name={'emailRequestInvite'}
              onChange={this.handleChange}
              value={this.state.emailRequestInvite}
              floatingLabelText={'Email Address'}
              fullWidth={true}
            />
          </div>
        </div>

        <div className="row u-margin-top-small form-container-center">
          <div className="col-xs-12 col-md-4">
            <b>Linkedin Profile</b> or some other online profile
          </div>
          <div className="col-xs-12 col-md-7">
            <TextField
              className='vertically-center'
              name={'linkedinUrl'}
              onChange={this.handleChange}
              value={this.state.linkedinUrl}
              floatingLabelText={'Linkedin Url'}
              fullWidth={true}
            />
          </div>
        </div>

        <div className="row u-margin-top-small form-container-center">
          <div className="col-xs-12 col-md-4">
            <b>What's someething you've built?</b> A quick description, or link is great!
          </div>
          <div className="col-xs-12 col-md-7">
            <TextField
              className='vertically-center'
              name="projectDesc"
              onChange={this.handleChange}
              value={this.state.projectDesc}
              floatingLabelText={'Project'}
              fullWidth={true}
            />
          </div>
        </div>

        <div className="row u-margin-top-small form-container-center">
          <div className="col-xs-12 col-md-4">
            <b>Why are you interested in joining </b>
          </div>
          <div className="col-xs-12 col-md-7">
            <TextField
              className='vertically-center'
              name="whyJoin"
              onChange={this.handleChange}
              value={this.state.whyJoin}
              floatingLabelText={'Why Join?'}
              fullWidth={true}
            />
          </div>
        </div>

        <div className="row u-margin-top-small form-container-center">
          <div className="col-xs-12 col-md-4">
            <b> How did you hear about us? </b>
          </div>
          <div className="col-xs-12 col-md-7">
            <TextField
              className='vertically-center'
              name="howDidYouHear"
              onChange={this.handleChange}
              value={this.state.howDidYouHear}
              floatingLabelText={'How did you hear about us?'}
              fullWidth={true}
            />
          </div>
        </div>
      </div>

      var loginButton = <FlatButton primary={true} label="Log In" onClick={ ()=> browserHistory.push("/login") } />;

    return (
      <MuiThemeProvider>
        <div className="main-container-v2">
          <div className="width-section-50-v2">

            <ConfirmDialog dialogViewStatus={this.state.showRequestInviteDialog} handleClose={ this.handleDialogClose } handleConfirm={ this.handleRequestInviteSubmit }>
              {requestInviteForm}
            </ConfirmDialog>

            <Snackbar
              open={this.state.snackBarMessageModal.open}
              message={this.state.snackBarMessageModal.message}
              autoHideDuration={4000}
              onActionClick={this.performSnackBarAction}
              onRequestClose={this.handleSnackBarClose}
            />

            <Paper className="section-container-padding u-margin-top-small">
              <div className="section-item-full-column">
                <div style={ {display:"flex", alignItems: "center", justifyContent: "space-between"}} >
                  <div className="page-header-text">
                    <span className="section-title-border">
                      Sign Up
                    </span>
                  </div>
                  {loginButton}
                </div>

                <Messages messages={this.props.messages} />

                {/* Invite Code Enter */}
                <div className="section-container-within-page u-margin-top-small u-margin-bottom-small" >
                  <p className="text-section-header-color">
                    <b>Please enter your invite code.</b> <FlatButton primary={true} label="Request an Invite" onClick={ this.handleRequestInviteDialogClick } />
                  </p>
                  <div className="section-container-content u-center-text" >
                    <TextField
                      type="text"
                      name="inviteCode"
                      id="inviteCode"
                      floatingLabelText="Invite Code"
                      value={this.state.inviteCode}
                      onChange={this.handleChange}
                      errorText={this.state.inviteCodeError}
                      fullWidth={false}
                    />
                  </div>
                </div>

                {/* Sign Up Section */}
                <div className="section-container-within-page u-margin-top-small u-margin-bottom-medium" >
                  <p className="text-section-header-color">
                    <b>Login with Facebook or Email.</b>
                  </p>

                  <div className="section-container-content u-center-text u-margin-top-medium">
                    <a href="/auth/facebook">
                      <img className="facebook-login-button" src="/assets/img/HackHiveAssets/btnLoginFacebook.png" />
                    </a>

                    <div className="or-border-text-container">
                      <div className="sign-up-border-bottom" />
                      <span className="or-text" > or </span>
                      <div className="sign-up-border-bottom" />
                    </div>

                    <TextField
                      type="email"
                      name="email"
                      id="email"
                      floatingLabelText="Email"
                      value={this.state.email}
                      onChange={this.handleChange}
                      errorText={this.state.emailError}
                      fullWidth={false}
                    />
                    <br/>
                    <TextField
                      type="password"
                      name="password"
                      id="password"
                      floatingLabelText="Password"
                      value={this.state.password}
                      onChange={this.handleChange}
                      errorText={this.state.passwordError}
                      fullWidth={false}
                    />
                  </div>
                </div>

                {/* Sign Up Submit Buttons */}
                <div>
                  <div className="section-item-full-column center-content u-margin-top-small">
                    <button onClick={this.handleSignupClick} className="btn-default btn-default__primary" type="submit">Create an account</button>
                  </div>
                  <div className="section-item-full-column center-content u-margin-top-small">
                    <p className="text-section-header-color">Already have an account? {loginButton} </p>
                  </div>
                </div>
              </div>
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps, {signup})(Signup);
