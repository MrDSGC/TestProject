import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux'
import { login } from '../../actions/auth';
import Messages from '../Messages';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: ''
    };

    this.handleLoginClick = this.handleLoginClick.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleLoginClick(event) {
    event.preventDefault();

    var newState = this.state;
    newState.emailError = "";
    newState.passwordError = "";
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
      this.props.login(this.state.email, this.state.password);
    }
  }

  render() {
    var signUpButton = <FlatButton primary={true} label="Sign Up" onClick={ ()=> browserHistory.push("/signup") } />;

    return (
      <MuiThemeProvider>
        <div className="main-container-v2">
          <div className="width-section-50-v2">

            <Paper className="section-container-padding u-margin-top-small">
              <div className="section-item-full-column">
                <div style={ {display:"flex", alignItems: "center", justifyContent: "space-between"}} >
                  <div className="page-header-text">
                    <span className="section-title-border">
                      Log In
                    </span>
                  </div>
                  {signUpButton}
                </div>

                <Messages messages={this.props.messages} />

                {/* Email or Facebook Login */}
                <div className="section-container-within-page u-margin-top-small u-margin-bottom-medium" >
                  <p className="text-section-header-color">
                    <b>Sign Up with Facebook or Email.</b>
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
                      onChange={this.handleChange.bind(this)}
                      errorText={this.state.emailError}
                      fullWidth={false}
                    />
                    <br/>
                    <TextField
                      type="password"
                      name="password"
                      id="password"
                      value={this.state.password}
                      errorText={this.state.passwordError}
                      onChange={this.handleChange.bind(this)}
                      floatingLabelText="Password"
                      fullWidth={false}
                    />
                  </div>
                </div>

                {/* Log in Buttons */}
                <div>
                  <div className="section-item-full-column center-content u-margin-top-small">
                    <button className="btn-default btn-default__primary" onClick={this.handleLoginClick}>Log In</button>
                  </div>
                  <div className="section-item-col-1 center-content u-margin-top-small">
                    <p className="text-section-header-color">Don't have an account? {signUpButton} </p>
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

export default connect(mapStateToProps, {login})(Login);
