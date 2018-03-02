import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FontIcon from 'material-ui/FontIcon';

import Tag from '../CommonComponents/Tag';
import UsernamePhoto from '../CommonComponents/UsernamePhoto';
import LinksSection from '../CommonComponents/LinksSection';
import VoteButton from '../CommonComponents/VoteButton';

const ProjectSidebar = (props) => {

  // Username views
  var sortedBuilders = JSON.parse(JSON.stringify(props.project.builders));

  sortedBuilders.sort( (a, b) => {
    return (a.userOnProjectOrder - b.userOnProjectOrder);
  })

  var builders = sortedBuilders.map( (user) => {
    return (
      <UsernamePhoto user={user} usernameSubtext={
        user.userOnProjectRole ?
        <p className="mini-user-name-sub-text">
          {user.userOnProjectRole}
        </p> : null
      } />
    )
  })

  // Tech Tag
  var techTags = props.project.techTags.map( (tag) => {
    return (
      <Tag tag={tag} />
    )
  })

  // Tech Tags Section
  var techTagSection = "";
  if (props.project.techTags.length) {
    techTagSection =
      <div className="section">
        <div className="section__header">
          Tech
        </div>
        <div className="section__content">
          {techTags}
        </div>
      </div>
  }

  // edit button on project screen, only for collaborators
  var editButtonSection = ""
  if (props.linkToEditing) {
    editButtonSection =
      <div className='col-xs-12 links-cancel-button side-container-top-right'>
        <MuiThemeProvider>
          <FontIcon onClick={ () => browserHistory.push("/project/edit/" + props.project.slug) } className="material-icons u-pointer-cursor">mode_edit</FontIcon>
        </MuiThemeProvider>
      </div>
  }

  var projectLogoSection = "";
  if (props.project.projectLogo) {
    projectLogoSection =
      <div className="project-logo-section">
        <img src={props.project.projectLogo} className="project-logo-section--image" />
      </div>
  }

  return (
    <div className="side-container">
      {editButtonSection}
      {projectLogoSection}

      <div className="container-title heading-2">
        {props.project.title}
      </div>
      <div className="section">
        <div className="section__header">
          On the web
        </div>
        <LinksSection links={props.project.links} />
      </div>

      {/**** Tech Tags Sections **/}
      {techTagSection}

      <div className="section">
        <div className="section__header">
          Builders
        </div>
        <div className="section__content">
          {builders}
        </div>
      </div>
      <div className="section" style={ {marginTop: "5px"} }>
        <VoteButton project={props.project} voteMessageCallback={props.messageCallBack} />
      </div>
    </div>
    )
}

export default ProjectSidebar;
