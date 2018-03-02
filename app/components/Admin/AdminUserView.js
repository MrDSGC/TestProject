import React from 'react';
import { DotLoader } from 'react-spinners';
import { browserHistory } from 'react-router';
import axios from 'axios';
import _ from 'lodash';
import ReactFilestack, { client } from 'filestack-react';
import Moment from 'react-moment';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AdminHeader from './AdminHeader';
import GenericJSONViewer from './GenericJSONViewer'

import ProjectTableRow from '../CommonComponents/ProjectTableRow';
import AdminUserAnalytics from './AdminUserAnalytics'

class AdminUserView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userToRender: {},
      isLoading: true
    }
  }

  fetchUserFromAPI(userSlug) {
    this.setState({
      isLoading: true
    });
    axios.get('/api/admin/user/' + userSlug)
    .then ((response) => {
      console.log(response)

      var userState = {
        userToRender: response.data.user,
        isLoading: false
      }
      this.setState(userState);
    })
  }

  componentDidMount() {
    this.fetchUserFromAPI(this.props.params.userSlug);
  }

  render() {
    if(this.state.isLoading){
      return (
        <div className="loading-spinner">
          <DotLoader />
        </div>
      )
    }

    var projectsSection = ""

    projectsSection = this.state.userToRender.projects.map( (project) => {
      // Project Rows
      var adminProjectViewButton =
      <RaisedButton
        label="Admin View"
        primary={true}
        style={ {marginLeft: "5px"} }
        onClick={ ()=>browserHistory.push("/admin/project/" + project.slug ) }
      />

      return (
        <ProjectTableRow
          project={project}
          tagClickHandler={ (tag)=> { browserHistory.push("/admin/tags/" + tag.slug) } }
          rightLocation={adminProjectViewButton}
          />
      )
    })

    var votesSection = ""

    votesSection = this.state.userToRender.votes.map( (vote) => {

      var adminProjectViewButton =
      <RaisedButton
        label="Admin View"
        primary={true}
        style={ {marginLeft: "5px"} }
        onClick={ ()=>browserHistory.push("/admin/project/" + vote.project.slug ) }
      />

      return (
        <div>
          <ProjectTableRow
            project={vote.project}
            tagClickHandler={ (tag)=> { browserHistory.push("/admin/tags/" + tag.slug) } }
            rightLocation={adminProjectViewButton}
            />
          <Moment fromNow>{vote.createdAt}</Moment>
        </div>
      )
    })

    return (
      <MuiThemeProvider>
        <div className="main-container-v2">
          <div className="width-section-70-v2">

            <AdminHeader titleText={this.state.userToRender.firstName + " " + this.state.userToRender.lastName} />

            <Paper className="section-container-padding u-margin-top-small">
              <h3>
                Projects
              </h3>
              {projectsSection}
            </Paper>

            <Paper className="section-container-padding u-margin-top-small">
              <h3>
                Votes
              </h3>
              {votesSection}
            </Paper>

            <AdminUserAnalytics
              title="User Analytics"
              user={this.state.userToRender}
            />

            <GenericJSONViewer
              title="User Object"
              JSONtoRender={this.state.userToRender}
            />

          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default AdminUserView;
