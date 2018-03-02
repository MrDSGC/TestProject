import React from 'react';

import axios from 'axios';
import { DotLoader } from 'react-spinners';
import { browserHistory } from 'react-router';

import ProjectMiniView from '../Projects/ProjectMiniView';
import ProjectSidebar from './ProjectSidebar';
import ProjectDetails from './ProjectDetails';

import SnackBarHelper from '../CommonComponents/SnackBarHelper';

class ProjectMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isCollab: false,
    }
  }

  fetchFromServer(projectSlug) {
    // Get referer from the document if it exists.
    var referUrlParam = "";
    // protect from server side rendering
    if (typeof window !== 'undefined') {
      if (window.document.referrer) {
        referUrlParam = "?referer=" + window.document.referrer;
      }
    }

    this.setState({
      isLoading: true
    })

    axios.get('/api/project/' + projectSlug + referUrlParam)
    .then ((response) => {
      this.setState({
        projectToRender: response.data.project,
        isCollab: response.data.isCollab,
        isLoading: false,
      })
    })
    .catch((error) => {
      browserHistory.push("/404")
    })
  }

  componentDidMount() {
    if (this.props.params.projectSlug) {
      this.fetchFromServer(this.props.params.projectSlug)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.projectSlug) {
      this.fetchFromServer(nextProps.params.projectSlug);
    }
  }

  render() {
    if(this.state.isLoading){
      return (
        <div className="loading-spinner">
          <DotLoader />
        </div>
      )
    }

    var messageCallBack = (message)=> {
      this.setState({snackBarMessage: message})
    }

    return (
      <div className="container-w-side">
        <SnackBarHelper message={this.state.snackBarMessage} />
        <ProjectSidebar messageCallBack={ messageCallBack } project={this.state.projectToRender} linkToEditing={this.state.isCollab} />
        <ProjectDetails project={this.state.projectToRender}/>
      </div>
    )
  }
}

export default ProjectMain;
