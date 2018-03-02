import React from 'react';
import { connect } from 'react-redux';
import { updateProfile } from '../../actions/auth';
import ReactFilestack, { client } from 'filestack-react';
import { browserHistory, Link } from 'react-router';
import axios from 'axios';
import _ from "lodash";

import Messages from '../Messages';
import LinksSectionInput from '../CommonComponents/LinksSectionInput';
import Tag from '../CommonComponents/Tag';
import TagDropDownAutoComplete from '../CommonComponents/TagDropDownAutoComplete';
import SectionHeader from '../CommonComponents/SectionHeader';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';

const options = {
  accept: 'image/*',
  maxFiles: 5,
  storeTo: {
    location: 's3',
  },
};

class ProfileEdit extends React.Component {
  constructor(props) {
    super(props);

    this.handleProfileUpdate = this.handleProfileUpdate.bind(this);
    this.handleChangeInputField = this.handleChangeInputField.bind(this);

    this.getErrorLinkValue = this.getErrorLinkValue.bind(this);
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);
    this.addSkillTag = this.addSkillTag.bind(this);
    this.removeSkillsTag = this.removeSkillsTag.bind(this);

    var userNewState = {user: this.props.user};
    if (userNewState.user.slugUpdateRequired) {
      userNewState.user.slug = "";
      userNewState.user.links = [{}];
      userNewState.user.newUserUI = true;
    }

    this.state = {
      user: userNewState.user,
      errorState: {links:{}},
      tagInput: "",
      messageModal: {open: false, message: ""}
    };
  }

  componentDidMount() {
    if (!this.state.user.profilePicUrl) {
      var newStateUser = this.state.user;
      newStateUser.profilePicUrl = "/assets/img/catDefault.jpg";
      this.setState({user: newStateUser});
    }
  }

  removeSkillsTag(index) {
    var userNewState = this.state.user;
    userNewState.knowsTags.splice(index, 1);
    this.setState({user: userNewState});
  }

  addSkillTag(tag) {
    var userNewState = this.state.user;
    var tagAlreadyAdded = false;

    userNewState.knowsTags.map( (userTag) => {
      if (userTag._id == tag._id) {
        tagAlreadyAdded = true;
      }
    });

    if (!tagAlreadyAdded) {
      userNewState.knowsTags.push(tag);
      this.setState({
        user: userNewState
      });
    } else {
      this.setState({
        messageModal:
          {open: true, message: tag.friendlyName + " has already been added to your profile"}
      })
    }
  }

  handleSnackBarClose() {
    this.setState({messageModal: {open: false}});
  }

  getErrorLinkValue(index, label) {
    if (this.state.errorState.links[index] && this.state.errorState.links[index][label]) {
      return this.state.errorState.links[index][label];
    }
    return null;
  }

  handleChangeInputField(event) {
    var newState = this.state;
    newState.user[event.target.name] = event.target.value;
    this.setState(newState);
  }

  handleProfileUpdate(event) {
    event.preventDefault();
    var errorFree = true;

    // Error Checking
    // clear previous error state
    var newState = this.state;
    newState.errorState = {
      links: {}
    };

    // Cannot be blank
    // check if first name is empty
    if (!this.state.user.slug) {
      errorFree = false;
      newState.errorState.slugError = "Please add a username";
    }

    // check if first name is empty
    if (!this.state.user.firstName) {
      errorFree = false;
      newState.errorState.firstNameError = "First Name cannot be blank";
    }

    // check if last name is empty
    if (!this.state.user.lastName) {
      errorFree = false;
      newState.errorState.lastNameError = "Last Name cannot be blank";
    }

    // check if the user has uploaded a photo
    if (!this.state.user.profilePicUrl) {
      errorFree = false;
      newState.errorState.profilePicUrlError = "Please add a photo";
    }

    newState.errorState.links = {0: {}}
    this.state.user.links.map ( (link, index) => {
      newState.errorState.links[index] = {}

      if (!link.linkType) {
        errorFree = false;
        newState.errorState.links[index]['linkTypeError'] = "Please choose a link type";
      }

      if (!link.friendlyLabel) {
        errorFree = false;
        newState.errorState.links[index].friendlyLabelError = "Please add a link label";
      }

      if (!link.url) {
        errorFree = false;
        newState.errorState.links[index].urlError = "Please add a url";
      }
    })

    if (!this.state.user.profilePicUrl) {
      errorFree = false;
      newState.errorState.profilePicUrlError = "Please add a photo";
    }

    if (errorFree) {
      this.props.dispatch(updateProfile(this.state, this.props.token, false, () => {
        browserHistory.push('/profile/' + this.state.user.slug)
      }));
    } else {
      newState.messageModal = {open: true, message: "Please fix the above errors."};
      this.setState(newState);
    }
  }

  render() {
    var profilePicSection;
    if (this.state && this.state.user.profilePicUrl) {
      profilePicSection = [
        <img className="profile-pic-image" src = {this.state.user.profilePicUrl} />,
        <ReactFilestack
        apikey='A78lxkjwR2SEz9gHaIPOVz'
        options={options}
        onSuccess={(result) => {
          var mediaURL = result.filesUploaded[0].url;
          var newState = this.state;
          newState.user.profilePicUrl = mediaURL;
          this.setState(newState);
        }}
        render={({ onPick }) => (
          <div className="u-margin-top-small">
            <RaisedButton label="Update Profile Picture" primary={true} onClick={onPick} />
          </div>
        )}
      />]
    } else {
      profilePicSection =
        <ReactFilestack
          apikey='A78lxkjwR2SEz9gHaIPOVz'
          options={options}
          onSuccess={(result) => {
            var mediaURL = result.filesUploaded[0].url;
            var newState = this.state;
            newState.user.profilePicUrl = mediaURL;
            this.setState(newState);
          }}
          render={({ onPick }) => (
            <div className="u-margin-top-small">
              <RaisedButton label="Update Profile Picture" primary={true} onClick={onPick} />
            </div>
          )}
        />
    }

    var userTags = [];
    userTags = this.state.user.knowsTags.map ( (tag, index) => {
      return (
        <Tag tag={tag} addRemoveButton={true} removeHandler = { () => this.removeSkillsTag(index)} />
      );
    });

    var sectionTitle = this.state.user.newUserUI ? "Welcome! Let's finish your account" : "Update " + this.state.user.firstName + "'s profile";
    var sectionBottomRow =
      (this.state.user.newUserUI || !this.state.user.firstName) ?
        <p>
          Please provide some quick info about yourself so we can setup your portfolio!
        </p> :
        [
          <Link to="/projects" > {this.state.user.firstName + "'s"} Projects </Link>,
          <Link to={`/profile/${this.state.user.slug}`} >| {this.state.user.firstName + "'s"} Profile </Link>
        ]

    return (
      <MuiThemeProvider>
        <div className="main-container-v2">
          <div className="width-section-70-v2">
            <Snackbar
              open={this.state.messageModal.open}
              message={this.state.messageModal.message}
              action={this.state.messageModal.action}
              autoHideDuration={4000}
              onRequestClose={this.handleSnackBarClose}
            />
            <SectionHeader
              titleText={sectionTitle}
              bottomRow={sectionBottomRow}
            />

            {/* Basic Info */}
            <Paper className="section-container-padding u-margin-top-small">
              <Messages messages={this.props.messages} />
                <div className="section-item-full-column left-content section-content-header">
                  Basic Info
                </div>

                <div className="user-profile-url-container">
                  <div className="user-profile-base">
                    http://www.thehackhive.com/profile/
                  </div>
                  <TextField
                    className="user-profile-url"
                    value={this.state.user.slug}
                    onChange={this.handleChangeInputField}
                    errorText={this.state.errorState.slugError}
                    name="slug"
                    type="text"
                    floatingLabelText="username"
                  />
                </div>

                {/* Email Setup */}
                <TextField
                  value={this.state.user.email}
                  name="email"
                  type="text"
                  disabled={true}
                  fullWidth={true}
                  floatingLabelText="Email"
                />

                <TextField
                  name="firstName"
                  value={this.state.user.firstName}
                  errorText={this.state.errorState.firstNameError}
                  onChange={this.handleChangeInputField}
                  type="text"
                  fullWidth={true}
                  floatingLabelText="First Name"
                />

                <TextField
                  name="lastName"
                  value={this.state.user.lastName}
                  errorText={this.state.errorState.lastNameError}
                  onChange={this.handleChangeInputField}
                  type="text"
                  floatingLabelText="Last Name"
                  fullWidth={true}
                />

                <div className="section-item-col-1">
                  <label className='label-main' htmlFor="email">Profile Pic</label>
                </div>
                <div className='section-item-col-2'>
                  <p className="error-text-form" >
                    {this.state.errorState.profilePicUrlError}
                  </p>
                  {profilePicSection}
                </div>
              </Paper>


              {/* Links */}
              <Paper className="section-container-padding u-margin-top-small">
                <div className="section-item-full-column left-content section-content-header">
                  Links
                </div>
                <p>
                  Add links to where people can learn about you on the web.
                </p>
                <LinksSectionInput
                  links= {this.state.user.links}
                  errorState =  {this.state.errorState}
                  getLinkSectionStateFunction = { (linksState) => {
                    var newState = this.state;
                    newState.user.links = linksState.links;
                    this.setState(newState);
                  }}
                 />
              </Paper>

              {/* Tags */}
              <Paper className="section-container-padding u-margin-top-small">
                <div className="section-item-full-column left-content section-content-header">
                  Skills Tags
                </div>
                {userTags}
                <br/>
                <TagDropDownAutoComplete elementClick={this.addSkillTag} />
              </Paper>

              <div className="section-content-grid-col-2 section-border-padding">
                <div className="section-item-full-column center-content">
                  <button className="btn btn-default__primary" onClick={this.handleProfileUpdate} type="submit">Update Profile</button>
                </div>
              </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    messages: state.messages,
    token: state.auth.token
  };
};

export default connect(mapStateToProps)(ProfileEdit);
