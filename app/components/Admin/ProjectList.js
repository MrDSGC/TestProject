import React from 'react';
import { DotLoader } from 'react-spinners';
import { browserHistory } from 'react-router';
import axios from 'axios';
import _ from 'lodash';

import ReactFilestack, { client } from 'filestack-react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import AdminHeader from './AdminHeader';
import ProjectTableRow from '../CommonComponents/ProjectTableRow';
import SearchProjectDropdown from './SearchProjectDropdown';

class ProjectList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projects: [],
      isLoading: true,
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    axios.get('/api/admin/projects/')
    .then ((response) => {
      console.log(response.data);
      this.setState({
        projects: response.data,
        isLoading: false
      })
    })
  }

  render() {
    if(this.state.isLoading){
      return (
        <div className="loading-spinner">
          <DotLoader />
        </div>
      )
    }

    var projectsSection = [];
    projectsSection = this.state.projects.map( (project) => {

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
          tagClickHandler={
            (tag)=> { browserHistory.push("/admin/tags/" + tag.slug) }
          }
          rightLocation={adminProjectViewButton}
        />
      );
    });

    return (
      <MuiThemeProvider>
        <div className="main-container-v2">
          <div className="width-section-70-v2">

            <AdminHeader titleText="Project List" />

            <Paper className="section-container-padding u-margin-top-small">
              <h4>
                Project Search
              </h4>
              <SearchProjectDropdown projectClick={ (project)=> {browserHistory.push("/project/" + project.slug)} } />
            </Paper>

            <Paper className="section-container-padding u-margin-top-small">
              {projectsSection}
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default ProjectList;
