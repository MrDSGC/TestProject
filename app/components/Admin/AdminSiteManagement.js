import React from 'react';
import { DotLoader } from 'react-spinners';
import { browserHistory } from 'react-router';
import axios from 'axios';
import _ from 'lodash';

import { connect } from 'react-redux';
import ReactFilestack, { client } from 'filestack-react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import AdminHeader from './AdminHeader'
import GenericJSONViewer from './GenericJSONViewer'

class AdminSiteManagement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      siteUrlRedirectObjects: []
    }
  }

  componentDidMount() {
    // get all site url redirect objects
    axios.get(`/api/siteManagement/urlRedirect/allUrlRedirects`)
    .then ((response) => {
      var newState = this.state;
      newState.siteUrlRedirectObjects = response.data.siteURLObjects;
      newState.isLoading = false;
      this.setState(newState);
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

    return (
      <MuiThemeProvider>
        <div className="main-container-v2">
          <div className="width-section-70-v2">
            <AdminHeader titleText="Site Management Settings" />
            <GenericJSONViewer title="Site Redirect URLs" JSONtoRender={this.state.siteUrlRedirectObjects} />
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(AdminSiteManagement);
