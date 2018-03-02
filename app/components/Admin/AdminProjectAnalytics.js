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

class AdminProjectAnalytics extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectAnalyticsEvents: [],
      isLoading: true,
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    axios.get('/api/analytics/project/' + this.props.project.id)
    .then ((response) => {
      this.setState({
        projectAnalyticsEvents: response.data,
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
      <GenericJSONViewer JSONtoRender={this.state.projectAnalyticsEvents} title="Analytics Events" />
    )
  }
}

export default AdminProjectAnalytics;
