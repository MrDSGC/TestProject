import React from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import _ from 'lodash';

import ReactFilestack, { client } from 'filestack-react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

class SubscribeButton extends React.Component {
  constructor(props) {
    super(props);

    this.subscribeButtonClickHandler = this.subscribeButtonClickHandler.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitSubscribeToServer = this.submitSubscribeToServer.bind(this);
    this.subscribeButtonOnEmailDialogSubmit = this.subscribeButtonOnEmailDialogSubmit.bind(this);

    this.state = {
      isLoading: false,
      subscribeCountToRender: 0,

      showEmailDialog: false,
      emailSubscribe: "",

      alreadySubscribed: false,

      messageSnackBar: {
        open: false,
        msg: ""
      }
    }
  }

  componentDidMount() {
    var subscribeCountToRender = 0;
    if (this.props.eventObject) {
      subscribeCountToRender = this.props.eventObject.subscribeCount ? this.props.eventObject.subscribeCount : 0;
    }

    var alreadySubscribed = false;
    if (this.props.eventObject && this.props.eventObject.currentUserAlreadySubscribed) {
      alreadySubscribed = true;
    }

    this.setState({
      subscribeCountToRender,
      alreadySubscribed
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleDialogClose() {
    this.setState({showEmailDialog: false});
  }

  submitSubscribeToServer() {
    this.setState({isloading: true});
    axios.post(
      '/api/eventObject/addSubscribe',
      {
        eventObjectId: this.props.eventObject.id,
        emailAddress: this.state.emailSubscribe
      }
    ).then( (response) => {
      var newState = this.state;
      newState.isloading = false;

      if (response.data.status == 'validAndAdded') {

        // Subscribe Added! Increment the count and add
        newState.subscribeCountToRender = newState.subscribeCountToRender + 1;
        newState.alreadySubscribed = true;
        newState.showEmailDialog = false;

        var returnMsg = "Yay - you're subscribed. We'll send you a quick reminder"
        if (this.props.subscribeMessageCallback) {
          this.props.subscribeMessageCallback(returnMsg)
        }

      } else if (response.data.status == 'validAndNeedToConfirm') {
        newState.alreadySubscribed = true;
        newState.showEmailDialog = false;

        var returnMsg = "Yay - you are subscribed."
        if(this.props.subscribeMessageCallback) {
          this.props.subscribeMessageCallback(returnMsg)
        }

      } else if (response.data.status == 'invalid') { // reminder already set
        // Already reminded
        newState.alreadySubscribed = true;
        newState.showEmailDialog = false;

        var returnMsg = "You are already subscribed!"
        if(this.props.subscribeMessageCallback) {
          this.props.subscribeMessageCallback(returnMsg)
        }
      }
      this.setState(newState);
    });
  }

  subscribeButtonClickHandler() {
    // subscribe on project button clicked
    this.setState({isLoading: true})

    if (!this.props.user) {
      // user does not exist
      this.setState({showEmailDialog: true});
    } else {
      this.submitSubscribeToServer();
    }
  }

  subscribeButtonOnEmailDialogSubmit() {
    this.submitSubscribeToServer();
  }

  render() {
    var subscribeEnabledCheckBox =
        <FontIcon className="material-icons u-pointer-cursor">check_circle</FontIcon>

    if (this.state.isLoading) {
      subscribeEnabledCheckBox = <CircularProgress size={20}/>
    }

    // subscribe enabled box
    var subscribeEnabledCheckBox =
      <div className="vote-container" onClick={ this.subscribeButtonClickHandler } style={ {cursor: "pointer"} }>
        <div className="vote-inner-container">
          <div className="vote-check-box-container">

            <div className="vote-check-box">
              {subscribeEnabledCheckBox}
            </div>
            <div className="vote-text">
              Subscribe
            </div>

          </div>
          <div className="vote-count-box">
            {this.state.subscribeCountToRender}
          </div>
        </div>
      </div>

      // disable subscribe box
      var subscribeDisabledCheckBox =
        <div className="vote-container-disabled" onClick={ this.AlreadyVoted }>
          <div className="vote-inner-container-disabled">
            <div className="vote-check-box-container">
              <div className="vote-check-box">
                <FontIcon color={"#00FF00"} className="material-icons u-pointer-cursor">check_circle</FontIcon>
              </div>
              <div className="vote-text-disabled">
                Subscribed
              </div>
            </div>
            <div className="vote-count-box">
              {this.state.subscribeCountToRender}
            </div>
          </div>
        </div>

    var subscribeButtonStateToRender = subscribeEnabledCheckBox; //enabled by default

    if (this.state.alreadySubscribed) {
      subscribeButtonStateToRender = subscribeDisabledCheckBox;
    }

    return (
      <MuiThemeProvider>
        <div>
          {/* enter email to subscribe */}
          <Dialog
            modal={false}
            open={ this.state.showEmailDialog }
            onRequestClose={ this.handleDialogClose }
            actions = {
              <FlatButton
                  label="Subscribe"
                  onClick={ ()=> { this.subscribeButtonOnEmailDialogSubmit()} }
              />
            }
          >
            <b>Enter your email to subscribe.</b> We will send you an email to confirm your subscription.

            <div className="section-container-content u-center-text">
              <TextField
                type="email"
                name="emailSubscribe"
                floatingLabelText="Email"
                value={this.state.emailSubscribe}
                onChange={this.handleChange}
                errorText={this.state.emailError}
                fullWidth={false}
              />
            </div>

          </Dialog>
          {subscribeButtonStateToRender}
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    messages: state.messages,
    token: state.auth.token
  };
};

export default connect(mapStateToProps)(SubscribeButton);
