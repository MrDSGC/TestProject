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

import ConfirmDialog from '../CommonComponents/ConfirmDialog';
import UsernamePhoto from '../CommonComponents/UsernamePhoto';
import SectionHeader from '../CommonComponents/SectionHeader';

import AdminHeader from './AdminHeader';
import GenericJSONViewer from './GenericJSONViewer'

class InviteRequest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    axios.get('/api/admin/inviteRequests')
    .then ((response) => {
      this.setState({
        inviteRequests: response.data,
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

    return (
      <MuiThemeProvider>
        <div className="main-container-v2">
          <div className="width-section-70-v2">

            <AdminHeader titleText="Invite Request"/>
            <GenericJSONViewer
              title="Invite Request form, on sign up page"
              JSONtoRender={this.state.inviteRequests}
            />

          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default InviteRequest;
