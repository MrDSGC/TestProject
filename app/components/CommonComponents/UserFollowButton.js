/**********************
  - Component Props:
  - userToFollow <- user that will be followed.
  - updateUserFollowerCountCallback <- will be called once a new follower is added.
  - messageCallBack <- callback for message snackbar to activate.

Follow Button responds to state - currentUserAlreadyFollows . Populated from the server

**********************/

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

class UserFollowButton extends React.Component {
  constructor(props) {
    super(props);

    this.userFollowButtonClickHandler = this.userFollowButtonClickHandler.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitUserFollowToServer = this.submitUserFollowToServer.bind(this);
    this.userFollowButtonOnEmailDialogSubmit = this.userFollowButtonOnEmailDialogSubmit.bind(this);

    this.state = {
      isLoading: false,
      userFollowCountToRender: 0, // for the current user.

      showEmailDialog: false,
      emailUserFollow: "",

      alreadyFollow: false,

      messageSnackBar: {
        open: false,
        msg: ""
      }
    }
  }

  componentDidMount() {
    var userFollowCountToRender = 0;
    var alreadyFollow = false;

    if (this.props.user && this.props.userToFollow.currentUserAlreadyFollows) {
      alreadyFollow = true;
    }

    this.setState({
      userFollowCountToRender,
      alreadyFollow
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleDialogClose() {
    this.setState({showEmailDialog: false});
  }

  submitUserFollowToServer() {
    this.setState({isloading: true});
    axios.post(
      '/api/userFollow/addFollowFromCurrentUserToAnotherUser',
      {
        userToFollowId: this.props.userToFollow._id,        // current logged in user
        emailAddressToAddToFollower: this.state.emailUserFollow
      }
    ).then( (response) => {
      var newState = this.state;
      newState.isloading = false;

      if (response.data.status == 'validAndAdded') {

        // follower Added! Increment the count and add
        newState.userFollowCountToRender = newState.userFollowCountToRender + 1;
        newState.alreadyFollow = true;
        newState.showEmailDialog = false;

        var returnMsg = "Yay - follower added!"
        if (this.props.messageCallBack) {
          this.props.messageCallBack(returnMsg)
        }

        // call updatecallback
        if (this.props.updateUserFollowerCountCallback) {
          this.props.updateUserFollowerCountCallback();
        }

      } else if (response.data.status == 'validAndNeedToConfirm') {
        newState.alreadyFollow = true;
        newState.showEmailDialog = false;

        var returnMsg = "Yay - follower added!"
        if(this.props.messageCallBack) {
          this.props.messageCallBack(returnMsg)
        }

      } else if (response.data.status == 'invalid') { // reminder already set
        // Already reminded
        newState.alreadyFollow = true;
        newState.showEmailDialog = false;

        var returnMsg = "You are already following!"
        if(this.props.messageCallBack) {
          this.props.messageCallBack(returnMsg)
        }
      }
      this.setState(newState);
    });
  }

  userFollowButtonClickHandler() {
    // subscribe on project button clicked
    this.setState({isLoading: true})

    if (!this.props.user) {

      // user is not logged in. Show email dialog
      this.setState({showEmailDialog: true});
    } else {
      this.submitUserFollowToServer();
    }
  }

  userFollowButtonOnEmailDialogSubmit() {
    this.submitUserFollowToServer();
  }

  render() {
    var followEnabledCheckBox =
        <FontIcon className="material-icons u-pointer-cursor">check_circle</FontIcon>

    if (this.state.isLoading) {
      followEnabledCheckBox = <CircularProgress size={20}/>
    }

    // follow enabled box
    var userFollowEnabledCheckBox =
      <div className="vote-container" onClick={ this.userFollowButtonClickHandler } style={ {cursor: "pointer"} }>
        <div className="vote-inner-container">
          <div className="vote-check-box-container">
            <div className="vote-check-box">
              {followEnabledCheckBox}
            </div>
            <div className="vote-text">
              Follow
            </div>
          </div>
        </div>
      </div>

      // disable follow box
      var userFollowDisabledCheckBox =
        <div className="vote-container-disabled">
          <div className="vote-inner-container-disabled">
            <div className="vote-check-box-container">
              <div className="vote-check-box">
                <FontIcon color={"#00FF00"} className="material-icons u-pointer-cursor">check_circle</FontIcon>
              </div>
              <div className="vote-text-disabled">
                Following
              </div>
            </div>
            <div className="vote-count-box">
              {/* this.state.userFollowCountToRender */}
            </div>
          </div>
        </div>

    var userFollowButtonStateToRender = userFollowEnabledCheckBox; // follow enabled by default

    if (this.state.alreadyFollow) {
      userFollowButtonStateToRender = userFollowDisabledCheckBox;
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
                  label="Follow"
                  onClick={ ()=> { this.userFollowButtonOnEmailDialogSubmit()} }
              />
            }
          >
            <b>Enter your email to follow.</b> We will send you an email to confirm your follow.

            <div className="section-container-content u-center-text">
              <TextField
                type="email"
                name="emailUserFollow"
                floatingLabelText="Email"
                value={this.state.emailUserFollow}
                onChange={this.handleChange}
                errorText={this.state.emailError}
                fullWidth={false}
              />
            </div>

          </Dialog>
          {userFollowButtonStateToRender}
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

export default connect(mapStateToProps)(UserFollowButton);
