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

import Tag from '../CommonComponents/Tag';
import ConfirmDialog from '../CommonComponents/ConfirmDialog';
import UsernamePhoto from '../CommonComponents/UsernamePhoto';
import TagList from '../CommonComponents/TagList';
import UserList from '../CommonComponents/UserList';

import AdminHeader from './AdminHeader';
import GenericJSONViewer from './GenericJSONViewer';

import ProjectMiniView from '../Projects/ProjectMiniView';
import ProjectTableRow from '../CommonComponents/ProjectTableRow';

import AdminProjectAnalytics from './AdminProjectAnalytics'


var projectEmpty = () => {
  return {
    slug: "",
    title: "",
    heroImages: "",
    description: ""
  }
}

class AdminProjectView extends React.Component {
  constructor(props) {
    super(props);

    this.fetchProjectFromAPI = this.fetchProjectFromAPI.bind(this);
    this.deleteProject = this.deleteProject.bind(this);

    this.state = {
      projectToRender: {},
      isLoading: true,
      projectVotes: []
    }
  }

  fetchProjectFromAPI(projectSlug) {
    this.setState({
      isLoading: true
    });
    axios.get('/api/admin/project/' + projectSlug)
    .then ((response) => {
      var projectState = {
        projectToRender: response.data,
        projectVotes: response.data.votes,
        isLoading: false
      }

      this.setState(projectState);
    })
  }

  componentWillReceiveProps(nextProps) {
    this.fetchProjectFromAPI(nextProps.params.projectSlug);
  }

  componentDidMount() {
    this.fetchProjectFromAPI(this.props.params.projectSlug);
  }

  handleChange(event) {
    var newState = this.state;
    newState.projectToRender[event.target.name] = event.target.value;
    this.setState(newState);
  }

  deleteProject() {
    axios({
      method: 'delete',
      url: '/api/admin/project/' + this.state.projectToRender.id,
    })
    .then( (response) => {
      browserHistory.push("/admin/projects");
    });
  }

  render() {
    if(this.state.isLoading){
      return (
        <div className="loading-spinner">
          <DotLoader />
        </div>
      )
    }


    var votesSection = this.state.projectToRender.votes.map( (vote, index)=> {
      return(
        <tr>
          <td>
            {index}
          </td>
          <td>
            { vote.emailAddress ? vote.emailAddress : <UsernamePhoto user={vote.user} /> }
          </td>
          <td>
            { vote.emailConfirmed ? "true" : "false"}
          </td>
          <td>
            {vote.createdAt}
          </td>
        </tr>
      )
    })

    return (
      <MuiThemeProvider>
        <div className="main-container-v2">
          <div className="width-section-70-v2">

            <AdminHeader titleText={this.state.projectToRender.title}
            />
            <Paper className="section-container-padding u-margin-top-small">
              <h3>
                Project Table Row View
              </h3>
              <ProjectTableRow
                project={this.state.projectToRender}
                tagClickHandler={
                  (tag)=> { browserHistory.push("/admin/tags/" + tag.slug) }
                }
              />
            </Paper>
            <Paper className="section-container-padding u-margin-top-small">
              <h3>
                Project Mini View
              </h3>
              <ProjectMiniView project={this.state.projectToRender} />
            </Paper>
            <Paper className="section-container-padding u-margin-top-small">
              <h3>
                Votes
              </h3>
              <table className="table">
                {votesSection}
              </table>
            </Paper>
            <Paper className="section-container-padding u-margin-top-small">
              <h3>
                Project Management
              </h3>
              <RaisedButton
                label="Delete Project"
                primary={true}
                style={ {marginLeft: "5px"} }
                onClick={ ()=>this.deleteProject() }
              />
            </Paper>

            <AdminProjectAnalytics project={this.state.projectToRender} />

            <GenericJSONViewer
              title="Project Object"
              JSONtoRender={this.state.projectToRender}
            />

          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default AdminProjectView;
