import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const ConfirmDialog = (props) => {
  const actions = [
    <FlatButton
      label="Close"
      primary={true}
      onClick={ ()=> { props.handleClose()} }
    />,
    <FlatButton
      label="Confirm"
      onClick={ ()=> { props.handleConfirm()} }
    />
  ];
  return (
    <MuiThemeProvider>
    <Dialog
      modal={false}
      open={ props.dialogViewStatus }
      onRequestClose={ props.handleClose }
      actions = {actions}
      autoScrollBodyContent={true}
    >
      {props.children}
    </Dialog>
    </MuiThemeProvider>
    )
}
export default ConfirmDialog;
