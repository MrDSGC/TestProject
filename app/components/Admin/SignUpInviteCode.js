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
import AdminHeader from './AdminHeader'

var signUpInviteCodeEmpty = () => {
  return {
    inviteCode: "",
    type: "",
    claimedStatus: "",
    description: "",
    title: "",
    helperFirstName: "",
    helperLastName: "",
    helperProfilePic: "",
  }
}

class SignUpInviteCode extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);

    this.signUpInviteCodeEdit = this.signUpInviteCodeEdit.bind(this);
    this.closeSignUpInviteCodeDialog = this.closeSignUpInviteCodeDialog.bind(this);
    this.submitSignUpInviteCodeUpdate = this.submitSignUpInviteCodeUpdate.bind(this);

    this.state = {
      signUpInviteCodes: [],
      isLoading: true,
      editsignUpInviteCodeDialogStatus: false,
      signUpInviteCodeToEdit: signUpInviteCodeEmpty()
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    axios.get('/api/admin/signUpInviteCodes')
    .then ((response) => {
      this.setState({
        signUpInviteCodes: response.data,
        isLoading: false
      })
    })
  }

  handleChange(event) {
    var newState = this.state;
    newState.signUpInviteCodeToEdit[event.target.name] = event.target.value;
    this.setState(newState);
  }

  signUpInviteCodeEdit(signUpInviteCode) {
    // Open Edit Dialog with selected signUpInviteCodeToEdit
    this.setState({
      signUpInviteCodeToEdit: signUpInviteCode,
      editsignUpInviteCodeDialogStatus: true
    })
  }

  closeSignUpInviteCodeDialog() {
    this.setState({
      signUpInviteCodeToEdit: signUpInviteCodeEmpty(),
      editsignUpInviteCodeDialogStatus: false
    });
  }

  submitSignUpInviteCodeUpdate() {
    var signUpInviteCodeToSubmit = this.state.signUpInviteCodeToEdit;
    delete signUpInviteCodeToSubmit.__v;
    delete signUpInviteCodeToSubmit.updatedAt;
    delete signUpInviteCodeToSubmit.createdAt;

    axios.post(
      '/api/admin/signUpInviteCode',
      {signUpInviteCodeToSubmit}
    ).then( (response) => {
      if (response.data.state == "newSignUpInviteCode") {
        var newState = this.state;

        var addSignUpInviteCodeObject = response.data.signUpInviteCode;
        addSignUpInviteCodeObject.usersWithSignUpInviteCode = []
        newState.signUpInviteCodes.push(addSignUpInviteCodeObject);

        this.setState({
          signUpInviteCodes: newState.signUpInviteCodes,
          signUpInviteCodeToEdit: signUpInviteCodeEmpty()
        });
      }

      // close dialogue and empty edit array.
      this.setState({
        signUpInviteCodeToEdit: signUpInviteCodeEmpty(),
        editsignUpInviteCodeDialogStatus: false
      });
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

    var signUpInviteCodeSection = [];
    _.forEach(this.state.signUpInviteCodes, (signUpInviteCode) => {
        signUpInviteCodeSection.push(<hr/>);

        console.log("signUpInviteCode ", signUpInviteCode)

        _.forEach(signUpInviteCode, (value, key) => {

          if (key == "usersWithSignUpInviteCode") {
            signUpInviteCode[key].map( (user)=> {
              signUpInviteCodeSection.push(
                <div className="row">
                  <div className="col-xs-12 col-md-3 u-center-right">
                    User
                  </div>
                  <div className="col-xs-12 col-md-7">
                    <UsernamePhoto user={user} />
                  </div>
                </div>
              );
            })
          } else {
            signUpInviteCodeSection.push(
              <div className="row">
                <div className="col-xs-12 col-md-3 u-center-right">
                  {key}
                </div>
                <div className="col-xs-12 col-md-7">
                  {value}
                </div>
              </div>
            );
          }

        });

        signUpInviteCodeSection.push(
          <div className="row u-center-text">
            <RaisedButton label="Edit Sign Up Inivte Code" primary={true} onClick={ ()=>{ this.signUpInviteCodeEdit(signUpInviteCode) } } />
          </div>
        );
      });

    var signUpInviteCodeFormSection = [];
    _.forEach(this.state.signUpInviteCodeToEdit, (value, key) => {
        signUpInviteCodeFormSection.push(
          <div className="row">
            <div className="col-xs-12 col-md-3 u-center-right">
              {key}
            </div>
            <div className="col-xs-12 col-md-7">
              <TextField
                className='vertically-center'
                name={key}
                onChange={this.handleChange}
                value={value}
                floatingLabelText={key}
                fullWidth={true}
              />
            </div>
          </div>
      );
    });

    return (
      <MuiThemeProvider>
        <div className="main-container-v2">
          <div className="width-section-70-v2">

            {/* Edit Dialog */}
            <ConfirmDialog
              dialogViewStatus={this.state.editsignUpInviteCodeDialogStatus}
              handleClose = { this.closeSignUpInviteCodeDialog }
              handleConfirm = { this.submitSignUpInviteCodeUpdate }
            >
              <h3>
                Edit {this.state.signUpInviteCodeToEdit.title}
              </h3>

              <div className="container-fluid">
                {signUpInviteCodeFormSection}
              </div>
            </ConfirmDialog>
            <AdminHeader titleText="Sign Up Invite Code" />
            <Paper className="section-container-padding u-margin-top-small">
              <RaisedButton primary={true} label="Create a new sign up code" onClick={() => this.signUpInviteCodeEdit(signUpInviteCodeEmpty())} />
              <br/>
              <br/>
              {signUpInviteCodeSection}
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default SignUpInviteCode;
