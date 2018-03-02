import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import ReactFilestack, { client } from 'filestack-react';
import axios from 'axios';

import { updateProject } from '../../actions/project_actions';
import Messages from '../Messages';
import UsernamePhoto from '../CommonComponents/UsernamePhoto';
import LinksSectionInput from '../CommonComponents/LinksSectionInput';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import Switch from "react-switch";

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';

import Tag from '../CommonComponents/Tag';
import TagDropDownAutoComplete from '../CommonComponents/TagDropDownAutoComplete';

import ReactQuillServerSafe from '../CommonComponents/ReactQuillServerSafe'
import { browserHistory, Link } from 'react-router';

import {Tabs, Tab} from 'material-ui/Tabs';
import { DotLoader } from 'react-spinners';

import ConfirmDialog from '../CommonComponents/ConfirmDialog';
import SectionHeader from '../CommonComponents/SectionHeader';

import Moment from 'react-moment';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

const options = {
  accept: 'image/*',
  maxFiles: 5,
  storeTo: {
    location: 's3'
  }
};

class ProjectEdit extends React.Component {
  constructor(props) {
    super(props)

    // Handle Tabs, Dialogs Change Handlers
    this.handleTabUpdate = this.handleTabUpdate.bind(this);
    this.handleCloseDeleteDialog = this.handleCloseDeleteDialog.bind(this);
    this.handleCloseInviteColaborator = this.handleCloseInviteColaborator.bind(this);
    this.handleCloseInviteDeleteColaborator = this.handleCloseInviteDeleteColaborator.bind(this);
    this.performSnackBarAction = this.performSnackBarAction.bind(this);
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);
    this.handleUserOnProjectOrderChange = this.handleUserOnProjectOrderChange.bind(this);

    // Handle Field Updates
    this.handleChangeInputField = this.handleChangeInputField.bind(this);
    this.handleGenericChangeInputField = this.handleGenericChangeInputField.bind(this);
    this.projectStatusToggleChangeHandler = this.projectStatusToggleChangeHandler.bind(this);

      //Sections
    this.addDetailsSection = this.addDetailsSection.bind(this);
    this.handleDetailInput = this.handleDetailInput.bind(this);
    this.handleDetailBodyInput = this.handleDetailBodyInput.bind(this);
    this.removeMediaItem = this.removeMediaItem.bind(this);
    this.removeProjectTag = this.removeProjectTag.bind(this);
    this.addProjectTag = this.addProjectTag.bind(this);
    this.getErrorLinkValue = this.getErrorLinkValue.bind(this);
    this.getErrorDetailValue = this.getErrorDetailValue.bind(this);

    // Handle Project Actions - Delete, Dialogs Change Handlers
    this.handleSendColabInvite = this.handleSendColabInvite.bind(this);
    this.handleDeleteColabInvite = this.handleDeleteColabInvite.bind(this);
    this.removeUserProjectAssoc = this.removeUserProjectAssoc.bind(this);
    this.updateUserOrderOnProject = this.updateUserOrderOnProject.bind(this);

    this.handleProjectDelete = this.handleProjectDelete.bind(this);
    this.handleProjectUpdate = this.handleProjectUpdate.bind(this);

    var initProjectState = {
      title: "",
      shortDescription: "",
      heroImageUrl: "",
      links: [{}],
      publicStatus: false,
      details: [{
          media: []
      }],
      projectInvites: [],
      builders: [],
      techTags: []
    };

    var pageTitle = "";
    var submitButtonTitle = "Submit Project";
    var newProject = false;
    var tabToRenderValue = 0;

    if (this.props.location.pathname.indexOf('/addFirstProject') !== -1) {
      pageTitle = "Add Your First Project!";
      submitButtonTitle = "Create Project";
      newProject = true;
      tabToRenderValue = 0;
    } else if (this.props.location.pathname.indexOf('/newProject') !== -1) {
      pageTitle = "Create a new project";
      submitButtonTitle = "Create Project";
      newProject = true;
      tabToRenderValue = 0;
    } else {
      pageTitle = "Edit Project";
      submitButtonTitle = "Update Project";
      newProject = false;
      tabToRenderValue = 42;
    }

    this.state = {
      tabToRenderValue,  // show loading spinner
      pageTitle,
      submitButtonTitle,
      newProject,

      messageModal: {open: false, message: ""},
      project: initProjectState,

      inviteToDeleteObject: {},
      errorState: {links:{}, details:{}}
    }
  }

  componentDidMount() {
    // get project to edit.
    if (this.props.params.projectSlug) {
      axios.get('/api/currentUser/project/' + this.props.params.projectSlug)
      .then ((response) => {

        var sortedBuilders = [];
        sortedBuilders = response.data.builders.sort( (a, b) => {
          return (a.userOnProjectOrder - b.userOnProjectOrder);
        })

        sortedBuilders = sortedBuilders.map( (builder, index) => {
          builder.userOnProjectOrder = index;
          return builder;
        })
        response.data.builders = sortedBuilders;

        this.setState({
          tabToRenderValue: 0,
          project: response.data
        })
      })
      .catch((error) => {
        browserHistory.push("/projects")
      })
    }
  }

  updateUserOrderOnProject() {
    axios.post(
      '/api/project/updateUserOnProjectOrder',
      {projectState: this.state.project})
    .then( (response) => {
      var newState = this.state;
      newState.messageModal = {
        open: true,
        message: response.data.msg
      };
      this.setState(newState);
    });
  }

  handleUserOnProjectOrderChange( currentIndexLocationofElement ) {
    return (event, index, value) => {
      var elementToMove = JSON.parse(JSON.stringify(this.state.project.builders[currentIndexLocationofElement]));
      var newArrayToReturn = JSON.parse(JSON.stringify(this.state.project.builders));

      if (index > currentIndexLocationofElement) { // move to is greater
        newArrayToReturn.splice(index+1, 0, elementToMove)
        newArrayToReturn.splice(currentIndexLocationofElement, 1)
      } else if (index < currentIndexLocationofElement) {
        newArrayToReturn.splice(index, 0, elementToMove) // insert element
        newArrayToReturn.splice(currentIndexLocationofElement+1, 1)  //delete the element
      }
      //renormalize location

      newArrayToReturn = newArrayToReturn.map( (user, index) => {
        user.userOnProjectOrder = index;
        return user;
      });

      var projectToReturn = this.state.project;
      projectToReturn.builders = newArrayToReturn;
      this.setState({project: projectToReturn});
    }
  }

  addProjectTag(tag) {
    var projectNewState = this.state.project;
    var tagAlreadyAdded = false;

    projectNewState.techTags.map( (projectTag) => {
      if (projectTag._id == tag._id) {
        tagAlreadyAdded = true;
      }
    });
    if (!tagAlreadyAdded) {
      projectNewState.techTags.push(tag);
      this.setState({
        project: projectNewState
      });
    } else {
      this.setState({
        messageModal:
          {open: true, message: tag.friendlyName + " has already been added to this project"}
      });
    }
  }

  removeProjectTag(index) {
    var projectNewState = this.state.project;
    projectNewState.techTags.splice(index, 1);
    this.setState({project: projectNewState});
  }

  removeUserProjectAssoc() {
    axios({
      method: 'delete',
      url: '/api/project/removeUserProjectAssoc',
      data: {
        projectId: this.state.project.id,
        userId: this.state.collabToRemove._id
      }
    })
    .then( (response) => {
      var newState = this.state;
      newState.project.builders.splice(this.state.collabToRemoveIndex, 1);
      newState.messageModal = {
        open: true,
        message: "Collaborator Removed"
      };
      newState.showRemoveCollabDialog = false;
      this.setState(newState);
    });
  }

  handleCloseDeleteDialog() {
    this.setState({
      showDeleteDialog: false
    });
  }

  handleDeleteColabInvite() {
    axios({
      method: 'delete',
      url: '/api/project/colabInvite/' + this.state.inviteToDeleteObject.id,
    })
    .then( (response) => {
      this.handleCloseInviteDeleteColaborator();
      // remove from current array
      var newState = this.state;
      newState.project.projectInvites.splice(this.state.inviteToDeleteIndex, 1);
      newState.messageModal = {
        open: true,
        message: "Invite Deleted"
      };
      this.setState(newState);
    });
  }

  handleCloseInviteDeleteColaborator() {
    this.setState({
      showInviteCollabDeleteDialog: false
    });
  }

  // Create an invite!
  handleSendColabInvite() {
    axios.post(
      '/api/currentUser/project/colabInvite/' + this.state.project.id,
      {inviteEmailAddress: this.state.inviteEmailAddress})
    .then( (response) => {
      this.handleCloseInviteColaborator();

      var newState = this.state;
      newState.messageModal = {
        open: true,
        message: response.data.msg
      };
      newState.project.projectInvites.push(response.data.projectInvite);
      this.setState(newState);
    });
  }

  handleCloseInviteColaborator() {
    this.setState({
      showInviteCollabDialog: false,
      inviteEmailAddress: ""
    });
  }

  handleTabUpdate(tabValue) {
    this.setState({
      tabToRenderValue: tabValue
    });
  }

  handleSnackBarClose() {
    this.setState({messageModal: {open: false}});
  }

  handleClose() {
    this.setState({showDeleteDialog: false});
  }

  handleProjectDelete() {
    axios({
      method: 'delete',
      url: '/api/currentUser/project/' + this.state.project.id,
    })
    .then( (response) => {
      this.setState({ messageModal: {
          open: true,
          message: "Project Successfully Updated",
          action: "Go to project"
        }
      });
      browserHistory.push("/projects");
    });
  }

  projectStatusToggleChangeHandler(checked) {
    var newState = this.state;
    newState.project.publicStatus = checked;
    this.setState(newState);
  }

  handleClick() {
    this.setState({
      open: true,
    });
  };

  // Setup errors for links
  getErrorLinkValue(index, label) {
    if (this.state.errorState.links[index] && this.state.errorState.links[index][label]) {
      return this.state.errorState.links[index][label];
    }
    return null;
  }

  getErrorDetailValue(index, label) {
    if (this.state.errorState.details[index] && this.state.errorState.details[index][label]) {
      return this.state.errorState.details[index][label];
    }
    return null;
  }

  /***** change handler for project */
  handleChangeInputField(event) {
    var newState = this.state;
    newState.project[event.target.name] = event.target.value;
    this.setState(newState);
  }

  /***** change handler for project */
  handleGenericChangeInputField(event) {
    var newState = this.state;
    newState[event.target.name] = event.target.value;
    this.setState(newState);
  }

  addDetailsSection() {
    var projectCurrentState = this.state.project;
    projectCurrentState.details.push({ media: []});
    this.setState({project: projectCurrentState})
  }

  removeDetailSection(index) {
    var projectCurrentState = this.state.project;
    if (index !== -1) {
      projectCurrentState.details.splice(index, 1);
    }
    this.setState({project: projectCurrentState})
  }

  removeMediaItem(index, mediaIndex) {
    var newStateProject = this.state.project;
    newStateProject.details[index].media.splice(mediaIndex, 1);

    this.setState({project: newStateProject})
  }

  handleDetailInput(detailsArrayIndex) {
    return (event, index, value) => {
      var newState = this.state;
      newState.project.details[detailsArrayIndex][event.target.name] = event.target.value;
      this.setState(newState);
    }
  }

  handleDetailBodyInput(detailsArrayIndex) {
    return (value) => {
      var newState = this.state;
      newState.project.details[detailsArrayIndex]['body'] = value;
      this.setState(newState);
    }
  }

  handleProjectUpdate() {
    event.preventDefault();
    var errorFree = true;

    // Error Checking
    // clear previous state
    var newState = this.state;
    newState.errorState = {
      details: {}
    }

    // Cannot be blank
    // check if first name is empty
    if (!this.state.project.title) {
      errorFree = false;
      newState.errorState.titleError = "Project title cannot be blank";
    }

    // check if last name is empty
    if (!this.state.project.shortDescription) {
      errorFree = false;
      newState.errorState.shortDescriptionError = "Short description cannot be blank";
    }

    // check if the user has uploaded a photo
    if (!this.state.project.heroImageUrl) {
      errorFree = false;
      newState.errorState.heroImageUrlError = "Please add a photo";
    }

    // check links
    newState.errorState.links = {0: {}}
    this.state.project.links.map ( (link, index) => {
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

    // check details
    newState.errorState.details = {0: {}}
    this.state.project.details.map ( (detail, index) => {
      newState.errorState.details[index] = {}

      if (!detail.title) {
        errorFree = false;
        newState.errorState.details[index]['titleError'] = "Please add a title";
      }
    })

    this.setState(newState);

    if (errorFree) {
      axios({
        method: 'put',
        url: '/api/currentUser/project/',
        data: {project: this.state.project}
      })
      .then( (response) => {
        if (this.state.project.publicStatus) {
          browserHistory.push("/project/" + response.data.slug);
        } else {
          this.setState({
            messageModal: {
              open: true,
              message: "Project Successfully Updated.",
              action: "Go to project"
            }
          });
        }
      });
    }
  }

  performSnackBarAction() {
    if (this.state.project.slug) {
      browserHistory.push("/project/" + this.state.project.slug);
    } else {
      browserHistory.push("/projects");
    }
  }

  render() {
    {/************ Hero Image ***************/}
    var heroImageSection;
    if (this.state && this.state.project.heroImageUrl) {
      heroImageSection = [
        <img className="cover-image-project-create" src = {this.state.project.heroImageUrl} />,
        <ReactFilestack
          apikey='A78lxkjwR2SEz9gHaIPOVz'
          options={options}
          onSuccess={(result) => {
            var mediaURL = result.filesUploaded[0].url;
            var newState = this.state;

            newState.project.heroImageUrl = mediaURL;
            this.setState(newState);
          }}
          render={({ onPick }) => (
            <div className="u-margin-top-small">
              <RaisedButton label="Update Hero Picture" primary={true} onClick={onPick} />
            </div>
          )}
        />
      ]
    } else {
      heroImageSection =
        <ReactFilestack
        apikey='A78lxkjwR2SEz9gHaIPOVz'
        options={options}
        onSuccess={(result) => {
          var mediaURL = result.filesUploaded[0].url;
          var newState = this.state;
          newState.project.heroImageUrl = mediaURL;
          this.setState(newState);
        }}
        render={({ onPick }) => (
          <div className="u-margin-top-small">
            <RaisedButton label="Update Hero Picture" primary={true} onClick={onPick} />
          </div>
        )}
      />
    }

    var projectLogoSection;
    if (this.state && this.state.project.projectLogo) {
      projectLogoSection = [
        <img className="project-logo-edit" src = {this.state.project.projectLogo} />,
        <ReactFilestack
          apikey='A78lxkjwR2SEz9gHaIPOVz'
          options={options}
          onSuccess={(result) => {
            var mediaURL = result.filesUploaded[0].url;
            var newState = this.state;

            newState.project.projectLogo = mediaURL;
            this.setState(newState);
          }}
          render={({ onPick }) => (
            <div className="u-margin-top-small">
              <RaisedButton label="Update your project logo" primary={true} onClick={onPick} />
            </div>
          )}
        />
      ]
    } else {
      projectLogoSection =
        <ReactFilestack
        apikey='A78lxkjwR2SEz9gHaIPOVz'
        options={options}
        onSuccess={(result) => {
          var mediaURL = result.filesUploaded[0].url;
          var newState = this.state;
          newState.project.projectLogo = mediaURL;
          this.setState(newState);
        }}
        render={({ onPick }) => (
          <div className="u-margin-top-small">
            <RaisedButton label="Add a project logo" primary={true} onClick={onPick} />
          </div>
        )}
      />
    }

    {/************ Section Description ***************/}
    var projectDescriptionSection = this.state.project.details.map( (detail, index) => {
      return (
        <div className='links-input-container u-margin-top-medium row'>
          {/* Add Close Button, Move to second column */}

          {/* Remove cancel button on first panel. */}
          { index ?
              <div className='col-xs-12 links-cancel-button'>
                <FontIcon onClick={ () => this.removeDetailSection(index)} className="material-icons u-pointer-cursor">highlight_off</FontIcon>
              </div> : ""
          }
          <div className='col-xs-12'>
            {/* title */}
            <div className='link-section'>
              <div className='col-md-4'>
                <p>
                  <b>Section title?</b>
                </p>
              </div>
              <TextField
                className='col-md-8'
                name="title"
                onChange={this.handleDetailInput(index)}
                value={detail.title}
                floatingLabelText="Section Title"
                errorText = { this.getErrorDetailValue(index, "titleError") }
              />
            </div>

            {/* description */}
            <div className='link-section'>
              <div className='col-md-4'>
                <p>
                  <b>Describe the details</b>
                </p>
              </div>
              <div className="col-md-8 quill-container">
                <ReactQuillServerSafe
                  value = {detail.body}
                  onChange = {this.handleDetailBodyInput(index)}
                />
              </div>
            </div>

            {/* Media Links and Description */}
            <div className='link-section'>
              <div className='col-md-4'>
                <p>
                  <b>Show the details</b> Add some pictures.
                </p>
              </div>

              <div className="section-media col-md-8">
                { detail.media.map( (mediaItem, mediaIndex) => {
                  return (
                    <div className="section-media-item media-item-container">
                      {/* remove photo container */}
                      <div className="remove-picture-div" onClick={()=>this.removeMediaItem(index, mediaIndex)}>
                        <FontIcon  className="material-icons u-pointer-cursor close-icon-color">highlight_off</FontIcon>
                      </div>
                      <img className="section-media-image-container" src={mediaItem.mediaURL} />
                      <div className="section-media-item-caption">
                        {mediaItem.mediaDescription}
                      </div>
                    </div>
                  )
                  })
                }

                <ReactFilestack
                  apikey='A78lxkjwR2SEz9gHaIPOVz'
                  options={options}
                  onSuccess={(result) => {
                    var mediaURL = result.filesUploaded[0].url;
                    var newState = this.state;

                    newState.project.details[index].media.push({mediaURL});
                    this.setState(newState);
                  }}
                  render={({ onPick }) => (
                    <div className="add-picture-container" onClick={onPick}>
                      <FontIcon className="material-icons add-picture-icon">camera_enhance</FontIcon>
                    </div>
                  )}
                />
              </div>
            </div>

          </div>
        </div>
      )
    });

    var deleteButton = "";
    var projectURLView = [];
    if(!this.state.newProject) {
      deleteButton = <RaisedButton label="Delete Project" secondary={true} onClick={() => {this.setState({showDeleteDialog: true})}}/>
      projectURLView = [
        <div className='vertically-center links-label'>
          Project URL:
        </div>,
        <div>
          http://www.thehackhive.com/project/{this.state.project.slug}
        </div>
      ];
    }

    const styles = {
      headline: {
        fontSize: 24,
        paddingTop: 16,
        marginBottom: 12,
        fontWeight: 400,
      },
    };

    {/************ Project Tags ***************/}
    var projectTags = [];

    projectTags = this.state.project.techTags.map ( (tag, index) => {
      return (
        <Tag tag={tag} addRemoveButton={true} removeHandler = { () => this.removeProjectTag(index)} />
      );
    });

/************************ Project Details Tab ***************************/
    var projectInfoTab = [
      /************************* Project Info Section **************/
      <Paper className="section-container-padding u-margin-top-small">
        <div className="section-item-full-column left-content section-content-header">
          Project Info
        </div>

        {/* Project Title and Description */}
        <TextField
          name="title"
          type="text"
          value={this.state.project.title}
          onChange={this.handleChangeInputField}
          errorText = {this.state.errorState.titleError}
          fullWidth={true}
          floatingLabelText="Project Title"
        />
        <TextField
          name="shortDescription"
          value={this.state.project.shortDescription}
          onChange={this.handleChangeInputField}
          errorText = {this.state.errorState.shortDescriptionError}
          type="text"
          fullWidth={true}
          floatingLabelText="Project Description"
        />
        <br/>
        <div className="section-item-col-1">
          <label className='label-main'>Project Logo</label>
          <p>
            Please make sure the image is a square, and atleast 512x512. Otherwise it'll look terrible. You don't want that.
          </p>
        </div>
        <div className='section-item-col-2'>
          <p className="error-text-form" >
            {this.state.errorState.projectLogoError}
          </p>
          {projectLogoSection}
        </div>
        <br/>
        <div className="section-item-col-1">
          <label className='label-main'>Hero Image</label>
        </div>
        <div className='section-item-col-2'>
          <p className="error-text-form" >
            {this.state.errorState.heroImageUrlError}
          </p>
          {heroImageSection}
        </div>
      </Paper>,
      /************************* Project Details Section **************/
      <Paper className="section-container-padding u-margin-top-small">
        <div className="section-item-full-column left-content section-content-header">
          Project Details
        </div>
        <div className='link-form-container u-margin-top-small'>
          {/* Project Status */}
          <div className='vertically-center links-label'>
            <p>
              Public Status?
            </p>
          </div>
          <Switch
            label="Simple"
            value="Send To Output"
            onChange = { this.projectStatusToggleChangeHandler }
            checked = { this.state.project.publicStatus }
          />
          {/* Project URL */}
          {projectURLView}
        </div>
      </Paper>,
      /************************* Project Links Section **************/
      <Paper className="section-container-padding u-margin-top-small">
        <div className="section-item-full-column left-content section-content-header">
          Project Links
        </div>
        <LinksSectionInput
          links= {this.state.project.links}
          errorState =  {this.state.errorState}
          getLinkSectionStateFunction = { (linksState) => {
            var newState = this.state;
            newState.project.links = linksState.links;
            this.setState(newState);
          }}
       />
      </Paper>,
      /************************* Project Description Section **************/
      <Paper className="section-container-padding u-margin-top-small">
        <div className="section-item-full-column left-content section-content-header">
          Project Description
        </div>
        <div>
          {projectDescriptionSection}
        </div>
        <div className="center-content u-margin-top-small">
          <RaisedButton
            label="+ Add another section"
            primary={true}
            onClick={this.addDetailsSection} />
        </div>
      </Paper>,
      /************************* Project Tags **************/
      <Paper className="section-container-padding u-margin-top-small">
        <div className="section-item-full-column left-content section-content-header">
          Project Tags
        </div>
        <p>
          Describe the technology you used.
        </p>
        {projectTags}
        <TagDropDownAutoComplete elementClick={this.addProjectTag} />
      </Paper>,
      /************************* Project Update Button Section **************/
      <Paper className="section-container-padding u-margin-top-small">
        <div className="section-item-full-column center-content">
          <button className="btn btn-default__primary" onClick={this.handleProjectUpdate}> {this.state.submitButtonTitle} </button>
        </div>
      </Paper>
    ];

/************************ Collaborators Tab ***************************/
      // Username views
      var raisedButton = "";
      var buildersSection = this.state.project.builders.map( (user, index) => {
        if (this.state.project.builders.length > 1) {
          raisedButton = <RaisedButton label="Remove" secondary={true} onClick={ () => {super.setState({showRemoveCollabDialog: true, collabToRemove: user, collabToRemoveIndex: index}) } } />
        }

        return (
          <div className="project_collab_remove">
            <div style={ {display: "flex"} }>
              <DropDownMenu value={user.userOnProjectOrder} onChange={ this.handleUserOnProjectOrderChange(index) }>
                {
                  this.state.project.builders.map( (user, index) => {
                    return <MenuItem value={index} primaryText={index+1} />
                  })
                }
              </DropDownMenu>
              <UsernamePhoto
                user={user}
                key={user._id}

                usernameSubtext={
                  user.userOnProjectRole ?
                  <p className="mini-user-name-sub-text">
                    {user.userOnProjectRole}
                  </p> : null
                }
              />
            </div>
            {raisedButton}
          </div>
        )
      })

      var collaboratorsSection = [
        <Paper className="section-container-padding u-margin-top-small">
          <div className="section-item-full-column left-content section-content-header">
            Invites
          </div>

          {/* Invite Button */}
          <RaisedButton
            label="+ Invite a Collaborator"
            primary={true}
            onClick={() => {this.setState({showInviteCollabDialog: true})} }
          />

          {/* Collaborator Invite Table */}
          <div className="section-item-col-1 u-margin-top-small">
            <label className='label-main'>Current Invites</label>
          </div>

          <Table adjustForCheckbox={false}>
            <TableHeader>
             <TableRow>
               <TableHeaderColumn>Email Address</TableHeaderColumn>
               <TableHeaderColumn>Invite Code</TableHeaderColumn>
               <TableHeaderColumn>Date</TableHeaderColumn>
               <TableHeaderColumn></TableHeaderColumn>
             </TableRow>
            </TableHeader>
              <TableBody displayRowCheckbox={false}>
               {this.state.project.projectInvites.map( (projectInvite, index) => {
                 return (
                   <TableRow>
                      {/* Email Address */}
                      <TableRowColumn>
                        {projectInvite.inviteEmailAddress}
                      </TableRowColumn>

                      {/* Invite Code */}
                      <TableRowColumn>
                        {projectInvite.inviteCode}
                      </TableRowColumn>

                      {/* Date */}
                      <TableRowColumn>
                        <Moment fromNow>{projectInvite.createdAt}</Moment>
                      </TableRowColumn>

                      {/* Delete */}
                      <TableRowColumn><a onClick={ () => { this.setState({showInviteCollabDeleteDialog: true, inviteToDeleteIndex: index, inviteToDeleteObject: projectInvite}) } }> Remove Invite </a></TableRowColumn>
                   </TableRow>
                 )
               })}
             </TableBody>
          </Table>
        </Paper>,
        <Paper className="section-container-padding u-margin-top-small">
          <div className="section-item-full-column left-content section-content-header">
            Collaborators
          </div>
          <div className="section__content">
            {buildersSection}
            <RaisedButton label="Save Order" primary={true} onClick={ this.updateUserOrderOnProject } />
          </div>
        </Paper>
      ]

/************************ Project Management Tab ***************************/
    var managmentSection = [
      <Paper className="section-container-padding u-margin-top-small">
        <div className="section-item-full-column left-content section-content-header">
          Danger Zone
        </div>
        {deleteButton}
      </Paper>
    ];

/************************ Loading Section ***************************/
    var loadingSection = [
      <div className="loading-spinner">
        <DotLoader />
      </div>
    ];

/************************* Tab Content Selector **************/
    var tabContentsJSX = "";

    switch (this.state.tabToRenderValue) {
      case 0:
        tabContentsJSX = projectInfoTab;
        break;
      case 1:
        tabContentsJSX = collaboratorsSection;
        break;
      case 2:
        tabContentsJSX = managmentSection;
        break;
      case 42:
        tabContentsJSX = loadingSection;
        break;
      default:
        tabContentsJSX = "";
    }

/************************ Page Setup ***************************/

    var sectionTitle = this.state.newProject ? "Create a new project" : this.state.project.title
    var sectionBottomRow = null;

    if(this.state.newProject) {
      sectionBottomRow = [
        <Messages messages={this.props.messages} />,
        <div>
          <Link to="/projects" >{this.props.user.firstName + "'s"} Projects </Link>
          <Link to={`/profile/${this.props.user.slug}`} >| {this.props.user.firstName + "'s"} Profile </Link>
        </div>,
        <br/>,
        <Tabs
          value={this.state.tabToRenderValue}
          onChange={this.handleTabUpdate}
          >
          <Tab value={0} label="Project Details" />
          <Tab value={1} label="Collaborators" />
          <Tab value={2} label="Management" />
        </Tabs>
      ]
    } else {
      sectionBottomRow = [
        <Messages messages={this.props.messages} />,
        <div>
          <Link to={`/project/${this.state.project.slug}`} > View {this.state.project.title} </Link>
          <Link to="/projects" > | {this.props.user.firstName + "'s"} Projects </Link>
          <Link to={`/profile/${this.props.user.slug}`} >| {this.props.user.firstName + "'s"} Profile </Link>
        </div>,
        <br/>,
        <Tabs
          value={this.state.tabToRenderValue}
          onChange={this.handleTabUpdate}
          >
          <Tab value={0} label="Project Details" />
          <Tab value={1} label="Collaborators" />
          <Tab value={2} label="Management" />
        </Tabs>
      ]
    }

/************************ Render Return ***************************/
    return (
      <MuiThemeProvider>
        <div className="main-container-v2">
          <Snackbar
            open={this.state.messageModal.open}
            message={this.state.messageModal.message}
            action={this.state.messageModal.action}
            autoHideDuration={4000}
            onActionClick={this.performSnackBarAction}
            onRequestClose={this.handleSnackBarClose}
          />

          <ConfirmDialog
            dialogViewStatus = {this.state.showDeleteDialog}
            handleClose={this.handleCloseDeleteDialog}
            handleConfirm={this.handleProjectDelete}
          >
            <div className="modal_content_container">
              <div className="modal_image_description">
                Are you sure you want to delete this project?! You can''t undo this, unless you build a time machine. If you do build a time machine, please be sure to create project on HackHive about the Time Machine.
              </div>
            </div>
          </ConfirmDialog>

          {/* Confirm user invite delete */}
          <ConfirmDialog
            dialogViewStatus = {this.state.showRemoveCollabDialog}
            handleClose={ () => { super.setState({showRemoveCollabDialog: false}) } }
            handleConfirm={this.removeUserProjectAssoc}
          >
            <div className="modal_content_container">
              <div className="modal_image_description">
                Are you sure you want to remove this collaborator?!
              </div>
            </div>
          </ConfirmDialog>

          {/* Send Invite Dialog */}
          <ConfirmDialog
            dialogViewStatus = {this.state.showInviteCollabDialog}
            handleClose= {this.handleCloseInviteColaborator}
            handleConfirm= {this.handleSendColabInvite}
          >
            <div className="modal_content_container">
              Please enter the email of the person you to add to the project!
              <TextField
                className='vertically-center'
                name="inviteEmailAddress"
                onChange={this.handleGenericChangeInputField}
                value={this.state.inviteEmailAddress}
                floatingLabelText="Collaborator Email Address"
                fullWidth={true}
                errorText = { this.state.errorState.inviteEmailAddressError }
              />
            </div>
          </ConfirmDialog>

          {/* Confirm user invite delete */}
          <ConfirmDialog
            dialogViewStatus = {this.state.showInviteCollabDeleteDialog}
            handleClose={this.handleCloseInviteDeleteColaborator}
            handleConfirm={this.handleDeleteColabInvite}
          >
            <div className="modal_content_container">
              Are you sure you want to delete an invite to {this.state.inviteToDeleteObject.inviteEmailAddress ? this.state.inviteToDeleteObject.inviteEmailAddress : "" }?
            </div>
          </ConfirmDialog>

          <div className="width-section-70-v2">

          <SectionHeader
            titleText={ sectionTitle }
            bottomRow = { sectionBottomRow }
          />
          {tabContentsJSX}
        </div>
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

export default connect(mapStateToProps, { updateProject })(ProjectEdit);
