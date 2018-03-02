import React from 'react';
import { browserHistory } from 'react-router';
import { DotLoader } from 'react-spinners';
import axios from 'axios';

import Dialog from 'material-ui/Dialog';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import ProjectMiniView from '../Projects/ProjectMiniView'

class VerifyVoteEmail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      dialogProjectViewStatus: false,
      dialogMsg: ""
    }

    this.handleDialogClose = this.handleDialogClose.bind(this);
  }

  componentDidMount() {
    axios.get('/api/vote/confirmEmailToken/' + this.props.params.emailVerifyToken,
    ).then( (response) => {

      browserHistory.push("/project/" + response.data.voteObject.project.slug)

      if (response.data.status == 'valid') {
        this.setState({
          isLoading: false,
          dialogProjectViewStatus: true,
          project: response.data.voteObject,
          dialogMsg: response.data.msg
        })

      } else if (response.data.status == 'notAddedButExists') {
        this.setState({
          isLoading: false,
          dialogProjectViewStatus: true,
          project: response.data.voteObject.project,
          dialogMsg: response.data.msg
        })
      }

    });
  }

  handleDialogClose() {
    this.setState({
      dialogProjectViewStatus: false
    })
  }

  render() {
    var loadingSection = ""

    if (this.state.isLoading) {
      loadingSection =
        <div className="loading-spinner">
          Verifying Email ...
          <DotLoader />
        </div>
    }

    return (
      <MuiThemeProvider>
        <div>
          <Dialog
            contentStyle={ {width: "30rem"} }
            modal={false}
            open={ this.state.dialogProjectViewStatus }
            onRequestClose={ this.handleDialogClose }
            autoScrollBodyContent={true}
          >
            <center>
              {this.state.dialogMsg}
              <ProjectMiniView project={this.state.project} />
            </center>
          </Dialog>
          {loadingSection}
        </div>
      </MuiThemeProvider>
    )
  }
}

export default VerifyVoteEmail;
