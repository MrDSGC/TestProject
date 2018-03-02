/**********************
  Renders the follow section in a profile.

  Component Props:
  - userToFollow <- user that will be followed. Current profile of the user.
  - messageCallBack <- callback for message snackbar to activate.
**********************/

import React from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { DotLoader } from 'react-spinners';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import UserFollowButton from '../CommonComponents/UserFollowButton';
import UsernamePhoto from '../CommonComponents/UsernamePhoto';

class UserFollowSection extends React.Component {
  constructor(props) {
    super(props);

    this.openUserListDialog = this.openUserListDialog.bind(this);
    this.handleUserListClose = this.handleUserListClose.bind(this);

    this.state = {
      isUserListLoading: true,
      showUserListDialog: false,
      userFollowerList: [],
      userFollowingList: [],
      userListToRender: [],
    }
  }

  componentDidMount() {
    // Setup Counts
    var userFollowerCount = 0;
    var userFollowingCount = 0;
    if (this.props.userToFollow.userFollowerCount) {
      userFollowerCount = this.props.userToFollow.userFollowerCount;
    }
    if (this.props.userToFollow.userFollowingCount) {
      userFollowingCount = this.props.userToFollow.userFollowingCount;
    }

    this.setState({
      userFollowerCount,
      userFollowingCount
    });
  }

  handleUserListClose() {
    this.setState({showUserListDialog: false});
  }

  openUserListDialog(userListType) {
    if (userListType == "followers") {
      // Get Followers
      this.setState({
        showUserListDialog: true,
        isUserListLoading: true,
        userListDialogTitle: this.props.userToFollow.firstName + "'s followers"
      });
    } else if (userListType == "following") {
      // Get Following
      this.setState({
        showUserListDialog: true,
        isUserListLoading: true,
        userListDialogTitle: this.props.userToFollow.firstName + " Follows"
      });
    }

    this.getUserListFromServer(userListType)

  }

  getUserListFromServer(userListType) {       //gets a list of users from the server
    var urlToGet = '';

    if (userListType == "followers") {
      urlToGet = '/api/userFollow/getUserFollowers/' + this.props.userToFollow._id;
    } else if (userListType == "following") {
      urlToGet = '/api/userFollow/getUserFollowing/' + this.props.userToFollow._id;
    }

    axios.get(urlToGet)
    .then ((response) => {
      this.setState({
        userListToRender: response.data.userFollowList,
        isUserListLoading: false
      })
    })
  }

  updateFollowCount() {
    var newState = this.state;
    newState.userFollowerCount = this.state.userFollowerCount + 1;
    this.setState(newState);
  }

  render() {
    // Setup User List Section
    var userListSection = null;

    if (this.state.isUserListLoading) {
      userListSection =
      [
        <b>{this.state.userListDialogTitle}</b>,
        <div className="section-container-content u-center-text">
          <div className="follow-user-list-content u-margin-top-medium">
            <center>
              <DotLoader />
            </center>
          </div>
        </div>
      ]

    } else if (this.state.userListToRender.length != 0) {
      userListSection = [
        <b>{this.state.userListDialogTitle}</b>,
        <div className="section-container-content u-center-text">
          <div className="follow-user-list-content u-margin-top-medium">
            {
              this.state.userListToRender.map( (user) => {
                return (
                  <UsernamePhoto user={user} />
                )
              })
            }
          </div>
        </div>
      ]
    } else {
      userListSection = [
        <b>{this.state.userListDialogTitle}</b>,
        <div className="section-container-content u-center-text">
          <div className="follow-user-list-content u-margin-top-medium">
            Nobody yet!
          </div>
        </div>
      ];
    }

    return (
      <MuiThemeProvider>
        <div className="profile-follow-section">
          <Dialog
            modal={false}
            open={this.state.showUserListDialog}
            onRequestClose={ this.handleUserListClose }
            autoScrollBodyContent={true}
            actions = {
              <FlatButton
                  label="Close"
                  onClick={ ()=> { this.handleUserListClose() } }
              />
            }
          >
            <div className="modal_content_container">
              {userListSection}
              {/*
              <div className="follow_user_dialog_notice u-margin-top-medium">
                <p>
                  Note - people can follow with only their email address. The email address is not shown, but it adds to the follower count :)
                </p>
              </div>
              */}
            </div>
          </Dialog>

          <UserFollowButton
            userToFollow = {this.props.userToFollow}
            updateUserFollowerCountCallback = { ()=>{ this.updateFollowCount() } }
            messageCallBack = { this.props.messageCallBack }
          />
          <div className="section__content u-margin-top-small follow_user_text_count"
            onClick={ ()=> this.openUserListDialog("followers") } >
            <b>{this.state.userFollowerCount}</b> Followers
          </div>
          <div className="section__content follow_user_text_count"
            onClick={ ()=> this.openUserListDialog("following") } >
            <b>{this.state.userFollowingCount}</b> Following
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default UserFollowSection;
