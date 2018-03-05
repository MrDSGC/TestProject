import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const LightBoxDialog = (props) => {
  const actions = [
    <FlatButton
      label="Close"
      primary={true}
      onClick={ ()=> { props.handleClose()} }
    />
  ];
  return (
    <MuiThemeProvider>
      <Dialog
        modal={false}
        open={props.pictureViewDialogStatus}
        onRequestClose={ ()=> {props.handleClose()} }
        actions = {actions}
      >

        <div className="modal_content_container">
          <img className="modal_image_view" src={props.mediaToRender.mediaURL} />
          <div className="modal_image_description">
            {props.mediaToRender.mediaDescription}
          </div>
        </div>
        <img onClick={() => {props.handleNext()}} className="lightbox-right-arrow" src="/assets/img/arrow-147175_1280.png"/>
        <img onClick={() => {props.handlePrevious()}} className="lightbox-left-arrow" src="/assets/img/arrow-147173_1280.png"/>
      </Dialog>
    </MuiThemeProvider>
    )
}
export default LightBoxDialog;
