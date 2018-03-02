import React from 'react';
import { connect } from 'react-redux';
import { DotLoader } from 'react-spinners';
import { browserHistory, Link } from 'react-router';
import axios from 'axios';

import ProjectMiniView from '../Projects/ProjectMiniView';
import ProfileSidebar from '../Profile/ProfileSidebar';
import SnackBarHelper from '../CommonComponents/SnackBarHelper';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';

class ProfileMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      linkToEditing: false
    }
  }

  fetchTagFromAPI(usernameSlug) {
    if (usernameSlug) {
      this.setState({
        isLoading: true
      });

      // Get referer from the document if it exists.
      var referUrlParam = "";
      // protect from server side rendering
      if (typeof window !== 'undefined') {
        if (window.document.referrer) {
          referUrlParam = "?referer=" + window.document.referrer;
        }
      }

      axios.get('/api/profile/' + usernameSlug + referUrlParam)
      .then ((response) => {
        var linkToEditing = false;
        if (this.props.user && this.props.user._id) {
          // logged in
          if (this.props.user._id == response.data._id) {
            // is the user profile
            linkToEditing = true;
          } else {
            linkToEditing = false;
          }
        }

        this.setState({
          profileToRender: response.data,
          isLoading: false,
          linkToEditing
        })
      })
      .catch((error) => {
        browserHistory.push("/404")
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    this.fetchTagFromAPI(nextProps.params.usernameSlug);
  }

  componentDidMount() {
    this.fetchTagFromAPI(this.props.params.usernameSlug);
  }

  userProjects() {
    if (this.state.profileToRender.projects) {

      // Sort projects according to the userProfileOrderField.
      var sortedProjects = [];
      sortedProjects = this.state.profileToRender.projects.sort( (a, b) => {
        return (a.userProfileOrder - b.userProfileOrder);
      })

      return sortedProjects.map( (project) => {
        var messageCallBack = (message)=> {
          this.setState({snackBarMessage: message})
        }
        return (
          <ProjectMiniView project={project} messageCallBack={messageCallBack}/>
        )
      })

    } else {
      return null;
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

    var welcomeMessage =
      <div className="main-container">
        <Paper className="section-container-padding welcome-message-profile">
          <h4>
            Welcome to your page! Let&apos;s fill it out! <b><Link to="/newProject"> Start by adding your first project here. </Link></b>
          </h4>
        </Paper>
      </div>

    var mainContents = this.state.profileToRender.projects.length ?
      <div className="main-container">
        {this.userProjects()}
      </div> :
      welcomeMessage

    return (
      <MuiThemeProvider>
        <div className="container-w-side">
          <SnackBarHelper message={this.state.snackBarMessage} />
          <ProfileSidebar
            user={this.state.profileToRender}
            linkToEditing={this.state.linkToEditing}
            messageCallBack={ (message)=> { this.setState({snackBarMessage: message}) } }
          />
          {mainContents}
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

export default connect(mapStateToProps)(ProfileMain);
