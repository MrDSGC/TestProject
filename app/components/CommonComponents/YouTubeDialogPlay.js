import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

const YouTubeDialogPlay = (props) => {
  const actions =
    <FlatButton
      label="Close"
      primary={true}
      onClick={ ()=>{ props.handleClose() } }
    />

  return (
    <MuiThemeProvider>
      <Dialog
        modal={false}
        open={ props.showDialogYouTube }
        actions = {actions}
        autoScrollBodyContent={true}
        onRequestClose={ props.handleClose}
      >
        <center>
          <iframe
            src= { parseYouTubeUrlToEmbedURL(props.youtubeUrl) }
            frameborder="0"
            width="560"
            height="315"
            allow="autoplay; encrypted-media"
            allowfullscreen>
          </iframe>
          <br/>
          <a href={props.youtubeUrl} target="_black"> YouTube Link </a>
        </center>
      </Dialog>
    </MuiThemeProvider>
  )
}

export default YouTubeDialogPlay;

var parseYouTubeUrlToEmbedURL = (youTubeUrlToParse) => {
  var youTubeVideoId = ""

  var locVideoIdStart = youTubeUrlToParse.indexOf("?v=");
  youTubeVideoId = youTubeUrlToParse.slice(locVideoIdStart + 3)
  var locVideoIdSEnd = youTubeVideoId.indexOf("&");

  // in case there are no url params at the end.
  if (locVideoIdSEnd != -1) {
    youTubeVideoId = youTubeVideoId.slice(0, locVideoIdSEnd);
  }

  //YouTube Embed Base URL
  var youTubeBaseUrl = "https://www.youtube.com/embed/";
  var autoPlayExtension = "?rel=0&autoplay=1";

  return youTubeBaseUrl + youTubeVideoId + autoPlayExtension;
}
