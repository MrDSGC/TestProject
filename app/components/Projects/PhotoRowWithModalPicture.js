import React from 'react';
import { Link } from 'react-router';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import LightBoxDialog from '../CommonComponents/LightBoxDialog'
//*********** Render a thumbnail row and modal for images **************/

class PhotoRowWithModalPicture extends React.Component {
  constructor(props) {
    super(props)

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePrevious = this.handlePrevious.bind(this);
    this.handleNext = this.handleNext.bind(this);

    /* Data Format for media
    media: [{
      mediaURL: String,
      mediaDescription: String
    */

    this.state = {
      mediaArray: this.props.mediaArray,
      pictureViewDialogStatus: false,
      mediaToRender: {},
      currentIndex: 0
    }
  }

  handleClose () {
    this.setState({pictureViewDialogStatus: false});
  };

  handleOpen (index) {
    this.setState({
      pictureViewDialogStatus: true,
      mediaToRender: this.state.mediaArray[index],
      currentIndex: index
    });
  };

  handlePrevious () {
    if(this.state.currentIndex - 1 < 0){
      this.setState({
        mediaToRender: this.state.mediaArray[this.state.mediaArray.length - 1],
        currentIndex: this.state.mediaArray.length - 1
      })
    } else {
      this.setState({
        mediaToRender: this.state.mediaArray[this.state.currentIndex - 1],
        currentIndex: this.state.currentIndex - 1
      })
    }
  };

  handleNext () {
    if(this.state.currentIndex >= this.state.mediaArray.length - 1){
      this.setState({
        mediaToRender: this.state.mediaArray[0],
        currentIndex: 0
      })
    } else {
      this.setState({
        mediaToRender: this.state.mediaArray[this.state.currentIndex + 1],
        currentIndex: this.state.currentIndex + 1
      })
    }
  };
  render() {
    var mediaRow = this.state.mediaArray.map( (mediaItem, index) => {
      return (
        <div className="section-media-item">
          <img className="section-media-image-container" src={mediaItem.mediaURL} onClick={ ()=>this.handleOpen(index) } />
          <div className="section-media-item-caption">
            {mediaItem.mediaDescription}
          </div>
        </div>
      )
    });

    return (
      <MuiThemeProvider>
        <div>
          <LightBoxDialog
            pictureViewDialogStatus = {this.state.pictureViewDialogStatus}
            handleClose = {this.handleClose}
            mediaToRender = {this.state.mediaToRender}
            index = {this.state.index}
            handleNext = {this.handleNext}
            handlePrevious = {this.handlePrevious}
          />

          <div className="section-media">
            {mediaRow}
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default PhotoRowWithModalPicture;
