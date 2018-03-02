import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';

import Tag from '../CommonComponents/Tag';
import LinksSection from '../CommonComponents/LinksSection';
import UserFollowSection from './UserFollowSection';

const ProfileSidebar = (props) => {
  var locationSection = "";
  if (props.user.location) {
    locationSection =
      <div className="profile-location">
        <img className="icon" src="/assets/img/location-pin.svg"  />
        {props.user.location}
      </div>
  }

  var aboutMeSection = "";
  if (props.user.aboutMeDescription) {
    aboutMeSection =
      <div className="profile-aboutme default-font-size">
        {props.user.aboutMeDescription}
      </div>
  }

  // Skills Tag
  var skillsTags = props.user.knowsTags.map( (tag) => {
    return (
      <Tag tag={tag} />
    )
  })

  // Tags Section
  var tagsection = [];
  if (props.user.knowsTags.length) {
    tagsection = [
      <div className="profile-section-header text-color-grey-dark-1 text-uppercase">
        Skills
      </div>,
      <div className="profile-section-skills-tags">
        {skillsTags}
      </div>
    ];
  }

  // edit button on project screen, only for collaborators
  var editButtonSection = ""
  if (props.linkToEditing) {
    editButtonSection =
      <div className='col-xs-12 links-cancel-button side-container-top-right'>
        <MuiThemeProvider>
          <FontIcon onClick={ () => browserHistory.push("/account") } className="material-icons u-pointer-cursor">mode_edit</FontIcon>
        </MuiThemeProvider>
      </div>
  }

  return (
    <div className="side-container">
      {editButtonSection}

      <img className="profile-pic" src={props.user.profilePicUrl} />
      <div className="profile-username heading-2">
        {props.user.firstName} {props.user.lastName}
      </div>

      {/* Follower Section */}
      <UserFollowSection
        userToFollow={props.user}
        messageCallBack={ props.messageCallBack }
      />

      <div className="section-content">
        {/* Location Section */}
        {locationSection}

        {/* About Me Section */}
        {aboutMeSection}
      </div>

      <div className="profile-section-links">
        <div className="profile-section-skills">
          <div className="profile-section-header text-uppercase">
            On the web
          </div>
          <LinksSection links={props.user.links} />
          {tagsection}
        </div>
      </div>

    </div>
    )
}

export default ProfileSidebar;
