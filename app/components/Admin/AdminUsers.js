import React from 'react';
import { DotLoader } from 'react-spinners';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux'
import { adminLoginAs } from '../../actions/auth';

import axios from 'axios';
import _ from 'lodash';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import UsernamePhoto from '../CommonComponents/UsernamePhoto';
import AdminHeader from './AdminHeader'
import AdminUserAnalytics from './AdminHeader'

class AdminUsers extends React.Component {
  constructor(props) {
    super(props);

    this.loginAsFunction = this.loginAsFunction.bind(this);

    this.state = {
      usersToRender: [],
      errorMessage: {},
      isLoading: true
    }
  }

  componentDidMount() {
    axios.get('/api/admin/allUsers')
    .then( (response) => {
      if (response.statusText == "OK") {
        this.setState({
          usersToRender: response.data,
          isLoading: false
        })
      } else {
        this.setState({
          errorMessage: response.data
        })
      }
    })
  }

  loginAsFunction(user) {
    axios.post('/api/admin/loginAs',
    {userParamToMatch: user._id})
    .then( (response) => {
      if (response.statusText == "OK") {
        this.props.adminLoginAs(response);
      } else {
        this.setState({
          errorMessage: response.data
        })
      }
    })
  }

  handleChange(event) {
    var newState = this.state;
    newState.tagToEdit[event.target.name] = event.target.value;
    this.setState(newState);
  }

  render() {
    var allUsers = this.state.usersToRender.map( (user, index) => {
      return (
        <div className="user-list-item">
          <UsernamePhoto user={user} />
          <div>
            <RaisedButton
              label="Login As"
              primary={true}
              onClick={ ()=>this.loginAsFunction(user) }
            />
            <RaisedButton
              label="Admin View"
              primary={true}
              onClick={ ()=> {browserHistory.push("/admin/user/" + user.slug)} }
            />
          </div>
        </div>
      );
    });

    if (this.state.isLoading) {
      return (
        <div className="loading-spinner">
          <DotLoader />
        </div>
      );
    }

    return (
      <MuiThemeProvider>
        <div className="main-container-v2">
          <div className="width-section-70-v2">
            {/* Users */}

            <AdminHeader titleText="Users" />

            <Paper className="section-container-padding u-margin-top-small">
              <h4>
                Login as a user
              </h4>
              <br/>
              <br/>
              {allUsers}
              <br/>
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    messages: state.messages
  };
};

export default connect(mapStateToProps, {adminLoginAs})(AdminUsers);
