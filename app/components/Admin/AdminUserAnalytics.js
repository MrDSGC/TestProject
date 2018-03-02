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
import GenericJSONViewer from './GenericJSONViewer';

class AdminUserAnalytics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userAnalyticsEvents: [],
      isLoading: true,
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    axios.get('/api/analytics/user/' + this.props.user._id)
    .then ((response) => {
      this.setState({
        userAnalyticsEvents: response.data,
        isLoading: false
      })
    }).catch( (response) => {
      this.setState({
        userAnalyticsEvents: null,
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
      <GenericJSONViewer JSONtoRender={this.state.userAnalyticsEvents} title="Analytics Events" />
    )
  }
}

export default AdminUserAnalytics;
