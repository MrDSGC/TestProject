import React from 'react';
import { browserHistory } from 'react-router';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';

import SectionHeader from './CommonComponents/SectionHeader'

const NotFound = (props) => {
  var catsArray = [
    "liveLongandProsperPURR.jpg",
    "partyCat.gif",
    "shockedCat.gif",
    "sleepingCat.gif",
    "catcrazy.gif",
    "chasing.gif",
    "cleaning.gif",
    "glasses.gif",
    "hardcoretyping.gif",
    "linda.gif",
    "liveLongandProsperPURR.jpg",
    "looking.gif",
    "massage.gif",
    "massageme.gif",
    "matrix.gif",
    "money.gif",
    "partyCat.gif",
    "petme.gif",
    "pokeball.gif",
    "push.gif",
    "rabbit.gif",
    "reindeer.jpg",
    "shaq.gif",
    "shockedCat.gif",
    "sleepingCat.gif",
    "sleepy.gif",
    "swat.gif",
    "trump.gif",
    "turntable.gif",
    "typing.gif",
    "yoga.gif",
    "loaf.jpg",
    "airplane.jpg",
    "baby.jpg",
    "Cocaine.jpg",
    "dot.jpg",
    "funny-cat-gif-2.gif"];

    var catImage = "/assets/img/catImages/" + catsArray[Math.floor(Math.random() * catsArray.length)];

  return (
    <MuiThemeProvider>
      <div className="main-container-v2">
        <div className="width-section-70-v2">
          <SectionHeader titleText="We couldn't find what you're looking for 😿" />

          <Paper className="section-container-padding u-margin-top-small">
            <div className="section-item-full-column left-content section-content-header">
              Sorry about that :(
            </div>

            <p className="text-section-header-color">
              This is likely our fault. However, you might have access to the page you're trying to access. The project maybe be private. In that case, it's your fault. But that's ok. We'll take the blame. Please enjoy this cat meme.
            </p>
            <div className="section-item-full-column u-center-text">
              <center>
                <FlatButton primary={true} label="Another Cat" onClick={ ()=> browserHistory.push("/404") } />
                <br/>
                <img src={catImage} className="cat-image" />
              </center>
            </div>
          </Paper>

        </div>
      </div>
    </MuiThemeProvider>
  );
};

export default NotFound;
