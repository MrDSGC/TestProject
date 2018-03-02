import React from 'react';
import Snackbar from 'material-ui/Snackbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class SnackBarHelper extends React.Component {
  constructor(props) {
    super(props);

    this.handleSnackBarClose = this.handleSnackBarClose.bind(this);

    this.state = {
      snackBarOpenStatus: false,
    }
  }

  handleSnackBarClose() {
    this.setState({snackBarOpenStatus: false});
  }

  componentWillReceiveProps(nextProps) {
    var newMessage = null;

    if (nextProps.message) {
      newMessage = nextProps.message;

      this.setState({
        message: newMessage,
        snackBarOpenStatus: true
      })
    }
  }

  render() {
    return (
      <MuiThemeProvider>
        <Snackbar
          open={this.state.snackBarOpenStatus}
          message={this.state.message}
          autoHideDuration={4000}
          onRequestClose={this.handleSnackBarClose}
        />
      </MuiThemeProvider>
    )
  }
}

export default SnackBarHelper;
