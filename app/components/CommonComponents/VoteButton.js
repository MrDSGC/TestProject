import React from 'react';
import { DotLoader } from 'react-spinners';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import axios from 'axios';
import _ from 'lodash';

import ReactFilestack, { client } from 'filestack-react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';

class VoteButton extends React.Component {
  constructor(props) {
    super(props);
    this.voteOnProject = this.voteOnProject.bind(this);
    this.handleDialogClose = this.handleDialogClose.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.submitVoteToServer = this.submitVoteToServer.bind(this);

    this.voteButtonOnEmailDialogSubmit = this.voteButtonOnEmailDialogSubmit.bind(this);

    this.state = {
      isLoading: false,
      voteCountToRender: 0,

      showEmailDialog: false,
      emailVote: "",

      alreadyVoted: false,

      messageSnackBar: {
        open: false,
        msg: ""
      }
    }
  }

  componentDidMount() {
    var voteCountToRender = 0;
    if (this.props.project) {
      voteCountToRender = this.props.project.voteCount ? this.props.project.voteCount : 0;
    }

    var alreadyVoted = false;
    if (this.props.project && this.props.project.currentUserAlreadyVoted) {
      alreadyVoted = true;
    }

    this.setState({
      voteCountToRender,
      alreadyVoted
    });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleDialogClose() {
    this.setState({showEmailDialog: false});
  }

  submitVoteToServer() {
    this.setState({isloading: true});
    axios.post(
      '/api/vote/projectVote',
      {
        projectId: this.props.project.id,
        emailAddress: this.state.emailVote
      }
    ).then( (response) => {
      var newState = this.state;
      newState.isloading = false;

      if (response.data.status == 'validAndAdded') {
        // Vote Added! Increment the count and add
        newState.voteCountToRender = newState.voteCountToRender + 1;
        newState.alreadyVoted = true;
        newState.showEmailDialog = false;

        var returnMsg = "Yay - vote added!"
        if(this.props.voteMessageCallback) {
          this.props.voteMessageCallback(returnMsg)
        }

      } else if (response.data.status == 'validAndNeedToConfirm') {
        newState.alreadyVoted = true;
        newState.showEmailDialog = false;

        var returnMsg = "Yay - please confirm your email to add your vote."
        if(this.props.voteMessageCallback) {
          this.props.voteMessageCallback(returnMsg)
        }

      } else if (response.data.status == 'invalid') { // already voted.

        // Already voted
        newState.alreadyVoted = true;
        newState.showEmailDialog = false;

        var returnMsg = "You already voted!"
        if(this.props.voteMessageCallback) {
          this.props.voteMessageCallback(returnMsg)
        }
      }
      this.setState(newState);
    });
  }

  voteOnProject() {
    // vote on project button clicked
    this.setState({isLoading: true})

    if (!this.props.user) {
      // user does not exist
      this.setState({showEmailDialog: true});
    } else {
      this.submitVoteToServer();
    }
  }

  voteButtonOnEmailDialogSubmit() {
    this.submitVoteToServer();
  }

  render() {
    var notVotedCheckBox =
        <FontIcon className="material-icons u-pointer-cursor">check_circle</FontIcon>

    if (this.state.isLoading) {
      notVotedCheckBox = <CircularProgress size={20}/>
    }

    // vote enabled box
    var userNotVoted =
      <div className="vote-container" onClick={ this.voteOnProject } style={ {cursor: "pointer"} }>
        <div className="vote-inner-container">
          <div className="vote-check-box-container">
            <div className="vote-check-box">
              {notVotedCheckBox}
            </div>
            <div className="vote-text">
              Vote
            </div>
          </div>
          <div className="vote-count-box">
            {this.state.voteCountToRender}
          </div>
        </div>
      </div>

      // disable vote box
      var userVoted =
        <div className="vote-container-disabled" onClick={ this.AlreadyVoted }>
          <div className="vote-inner-container-disabled">
            <div className="vote-check-box-container">
              <div className="vote-check-box">
                <FontIcon color={"#00FF00"} className="material-icons u-pointer-cursor">check_circle</FontIcon>
              </div>
              <div className="vote-text-disabled">
                Voted
              </div>
            </div>
            <div className="vote-count-box">
              {this.state.voteCountToRender}
            </div>
          </div>
        </div>


    var voteButtonStateToRender = userNotVoted; //enabled by default

    if (this.state.alreadyVoted) {
      voteButtonStateToRender = userVoted;
    }

    return (
      <MuiThemeProvider>
        <div>
          {/* enter email to vote */}
          <Dialog
            modal={false}
            open={ this.state.showEmailDialog }
            onRequestClose={ this.handleDialogClose }
            actions = {
              <FlatButton
                  label="Vote"
                  onClick={ ()=> { this.voteButtonOnEmailDialogSubmit()} }
              />
            }
          >
            <b>Enter your email to vote.</b> We will send you an email to confirm your vote.

            <div className="section-container-content u-center-text">
              <TextField
                type="email"
                name="emailVote"
                floatingLabelText="Email"
                value={this.state.emailVote}
                onChange={this.handleChange}
                errorText={this.state.emailError}
                fullWidth={false}
              />
            </div>

          </Dialog>
          {voteButtonStateToRender}
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

export default connect(mapStateToProps)(VoteButton);
