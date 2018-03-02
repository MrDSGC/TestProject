import _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import ReactFilestack, { client } from 'filestack-react';
import axios from 'axios';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
import { DotLoader } from 'react-spinners';
import { createProject } from '../../actions/project_actions';
import Messages from '../Messages';

import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import DropDownMenu from 'material-ui/DropDownMenu';

import ProjectTableRow from '../CommonComponents/ProjectTableRow'
import SectionHeader from '../CommonComponents/SectionHeader'

const options = {
  accept: 'image/*',
  maxFiles: 5,
  storeTo: {
    location: 's3',
  },
};

class UserProjectList extends React.Component {
  constructor(props) {
    super(props);

    this.handleOrderChange = this.handleOrderChange.bind(this);
    this.handleChangeInputField = this.handleChangeInputField.bind(this);
    this.addProjectClick = this.addProjectClick.bind(this);
    this.updateUserProjectOrderAndRole = this.updateUserProjectOrderAndRole.bind(this);
    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);

    this.state = {
      isLoading: true,
      userProjects: [],
      messageModal: {open: false, message: ""}
    }
  }

  // get user projects, regardless of public settings.
  componentDidMount() {
    axios.get('/api/user/projects/')
    .then((response) => {

      //make a hard copy
      var returnedProjects = JSON.parse(JSON.stringify(response.data));

      // sort the user projects
      var sortedProjects = [];
      sortedProjects = returnedProjects.sort( (a, b) => {
        return (a.userProfileOrder - b.userProfileOrder);
      })

      this.setState({
        isLoading: false,
        userProjects: sortedProjects
      })
    })
  }

  updateUserProjectOrderAndRole() {
    axios.post(
      '/api/currentUser/updateProjectOrder',
      {userProjectState: this.state.userProjects}
    ).then( (response) => {

      this.setState({
        messageModal: {
          open: true,
          message: response.data.msg
        }
      })
    });
  }

  handleSnackBarClose() {
    this.setState({messageModal: {open: false}});
  }

  handleChangeInputField(event) {
    var updateInput = {};
    updateInput[event.target.name] = event.target.value;
    this.setState(updateInput);
  }

  addProjectClick() {
    // InviteCodeSend to match with project
    axios.post(
      '/api/currentUser/project/invite/inviteCode',
      {inviteCode: this.state.inviteCode})
      .then( (response) => {

        // Success Invite Code Added
        if (response.data.status == "success") {
          this.setState({
            messageModal:
            {
              open: open,
              message: response.data.msg
            }
          });
          browserHistory.push("/project/" + response.data.projectAdded.slug);
        } else {
          this.setState({messageModal:
            {open: open,
            message: response.data.msg}
          });
        }
      });
  }

  friendlyProjectStatusString(publicStatus) {
    if(publicStatus) {
      return "Public";
    } else {
      return "Private"
    }
  }

  handleOrderChange(currentIndexLocationofElement) {
    return (event, index, value) => {

      var elementToMove = JSON.parse(JSON.stringify(this.state.userProjects[currentIndexLocationofElement]));
      var newArrayToReturn = JSON.parse(JSON.stringify(this.state.userProjects));

      if (index > currentIndexLocationofElement) { // move to is greater
        newArrayToReturn.splice(index+1, 0, elementToMove)
        newArrayToReturn.splice(currentIndexLocationofElement, 1)
      } else if (index < currentIndexLocationofElement) {
        newArrayToReturn.splice(index, 0, elementToMove) // insert element
        newArrayToReturn.splice(currentIndexLocationofElement+1, 1)  //delete the element
      }
      //renormalize location
      newArrayToReturn = newArrayToReturn.map( (project, index) => {
        project.userProfileOrder = index;
        return project;
      });
      this.setState({userProjects: newArrayToReturn});
    }
  }

  render() {
    var userProjectSection = ""
    if (!this.state.isLoading) {
      // Sort projects according to the userProfileOrderField.

      userProjectSection = this.state.userProjects.map( (project, projectIndex) => {
        var editButton =
          <RaisedButton
            label="Edit"
            primary={true}
            style={ {marginLeft: "5px"} }
            onClick={ ()=>browserHistory.push("/project/edit/" + project.slug ) }
          />

        var leftLocationOrderSelectionDropdown =
        <DropDownMenu value={project.userProfileOrder} onChange={ this.handleOrderChange(projectIndex) }>
          {
            this.state.userProjects.map( (project, index) => {
              return <MenuItem value={index} primaryText={index+1} />
            })
          }
        </DropDownMenu>
        return (
          <ProjectTableRow key={project.id} project={project} leftLocation={leftLocationOrderSelectionDropdown} rightLocation={editButton} />
        )
      })
    }

    return this.state.isLoading ?
      <div className="loading-spinner">
        <DotLoader />
      </div>
      :
      <MuiThemeProvider>
        <div className="main-container-v2">
          <div className="width-section-70-v2">
            <Snackbar
              open={this.state.messageModal.open}
              message={this.state.messageModal.message}
              action={this.state.messageModal.action}
              autoHideDuration={4000}
              onActionClick={this.performSnackBarAction}
              onRequestClose={this.handleSnackBarClose}
            />

            <SectionHeader
              titleText="Your Projects"
              bottomRow = {
                [
                  <Messages messages={this.props.messages} />,
                  <Link to={`/profile/${this.props.user.slug}`} > {this.props.user.firstName + "'s"} Profile </Link>
                ]
              }
            />

            <Paper className="section-container-padding u-margin-top-small">
              <RaisedButton
                className="u-margin-top-small"
                label="+ Create a new project"
                primary={true}
                onClick={() => browserHistory.push('/newProject')}
              />

              <div className="u-margin-top-medium">
                {userProjectSection}
              </div>

              <RaisedButton
                className="u-margin-top-small"
                label="Save Order"
                primary={true}
                onClick={this.updateUserProjectOrderAndRole}
              />
            </Paper>

            {/* Invite Area */}
            <Paper className="section-container-padding u-margin-top-small">
              <div className="section-item-full-column left-content section-content-header">
                Project Invites
              </div>

              <div>
                <p>
                  Collaborate with others on projects. Simply enter the invite code from the project.
                </p>

                {/* Enter Invite Code */}
                <TextField
                  name="inviteCode"
                  type="text"
                  value={this.state.inviteCode}
                  onChange={this.handleChangeInputField}
                  errorText = {this.state.inviteCodeError}
                  floatingLabelText="Project Invite Code"
                />

                <RaisedButton
                  label="+ Add Project"
                  primary={true}
                  onClick={this.addProjectClick}
                />
              </div>
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.user,
    messages: state.messages,
    token: state.auth.token
  };
};

export default connect(mapStateToProps)(UserProjectList);

var publicStatusText = function(publicStatus) {
  if (publicStatus) {
    return "Public"
  } else {
    return "Private"
  }
}
