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
import FontIcon from 'material-ui/FontIcon';

import ProjectMiniView from '../Projects/ProjectMiniView';
import Tag from '../CommonComponents/Tag';
import SubscribeButton from '../CommonComponents/SubscribeButton';
import ImInterestedButton from '../CommonComponents/ImInterestedButton';
import SnackBarHelper from '../CommonComponents/SnackBarHelper';

class CareersPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      hackHiveCareerImInterestedEvent: {},
      eventObjectToSubscribe: {},
      snackBarMessage: null
    }
  }

  componentDidMount() {

    // setup subscribe button setup. Get eventObject
    axios.get(`/api/eventObject/5a7ea383734d1d2645e98fba`)
    .then ((response) => {
      var newState = this.state;
      newState.eventObjectToSubscribe = response.data.eventObject;
      newState.isLoading = false;
      this.setState(newState);
    });

    // setup im interested button. Get eventObject
    axios.get(`/api/eventObject/5a7f1a62734d1d2645e9af02`)
    .then ((response) => {
      var newState = this.state;
      newState.hackHiveCareerImInterestedEvent = response.data.eventObject;
      newState.isLoading = false;
      this.setState(newState);
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

    var messageCallBack = (message)=> {
      this.setState({snackBarMessage: message})
    }

    return (
      <MuiThemeProvider>

        <div>
          <SnackBarHelper message={this.state.snackBarMessage} />
          {/******* Banner Image ******/}
          <div className="landing-page-full-width-container">
            <img src="/assets/img/HackHiveAssets/wood-background.jpeg" style={ {position:"absolute", zIndex: "-500", width: "100%", height: "100%", objectFit: "cover"} } />
            <div className="landing-page-main-container">

              {/* Page Header Container */}
              <div className="landing-page-page-header-container">
                <span className="landing-page-hack-hive-logo">
                  HackHive &nbsp;
                </span>
                <span className="landing-page-page-text">
                  Careers
                </span>

                <div className="landing-page-page-subtitle">
                  Full-time and internship opportunities at companies in the Bay Area and US
                </div>

                {/* Header Subtext */}
                <div className="landing-page-header-content">
                  <p className="landing-page-page-helper-text">
                    Simple, Fast, Easy to use -- just create a HackHive profile with projects.
                  </p>
                  <p className="landing-page-page-helper-text">
                    Exclusive AMA&apos;s with recruiters and hiring managers. Create the best profile possible.
                  </p>
                  <p className="landing-page-page-helper-text">
                    Launching soon! &nbsp; <b> Get notified below.</b>
                  </p>

                  <div className="u-margin-top-medium">
                    <ImInterestedButton
                      subscribeMessageCallback={ messageCallBack }
                      eventObject={this.state.hackHiveCareerImInterestedEvent}
                    />
                  </div>

                </div>
              </div>

              {/* Main Value Props */}

              {/* How it works */}
              <div className="project-content u-margin-top-medium">
                <div className="section-header">
                  How it Works
                </div>
                <br/>
                <div className="section-content landing-page-3-tile-layout">

                  <div className="landing-page-tile-item">
                    <FontIcon
                      className="material-icons item-icon-size u-margin-bottom-medium"
                    >
                      extension
                    </FontIcon>
                    <p>
                      HackHive partners with hundreds of companies to help them find amazing people.
                    </p>
                  </div>

                  <div className="landing-page-tile-item">
                    <FontIcon className="material-icons item-icon-size u-margin-bottom-medium">cached</FontIcon>
                    <p>
                      We send your portfolio with your projects and accomplishments to recruiters and hiring managers.
                    </p>
                  </div>

                  <div className="landing-page-tile-item">
                    <FontIcon className="material-icons item-icon-size u-margin-bottom-medium">tag_faces</FontIcon>
                    <p>
                      That&apos;s it! HackHive does the hardwork to find you amazing opportunities. You work hard and start an amazing career.
                    </p>
                  </div>

                </div> {/* How it works container */}
              </div>


              {/* Upcoming */}
              <div className="project-content u-margin-top-small">
                <div className="section-header">
                  Upcoming Events
                </div>
                <br/>
                <div className="landing-page-centered-layout">
                  <div className="landing-page-tile-large">
                    <img className="img-circle-upcoming" src="https://cdn.filestackcontent.com/tyEqmZdTnGXXTAhLQmbw" />
                    <p className="upcoming-header-text">
                      <b>AMA with <a href="/profile/vbhartia"> Varun Bhartia </a></b> @ Noon PST, Feb 15th
                    </p>
                    <p className="upcoming-body-text">
                      <b>Ask Varun anything!</b> Get inside tips on getting hired! Varun has worked at Facebook, Uber, Microsoft (as a PM), and created a half a dozen apps for fun. He has also had offers to lead teams at Apple, Google, Samsung and Amazon.
                      He has a ton of experience recruiting and loves helping others. Ask him anything on Thursday, Feb 15th.
                    </p>
                    <SubscribeButton
                      subscribeMessageCallback={ messageCallBack }
                      eventObject={ this.state.eventObjectToSubscribe }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default CareersPage;
