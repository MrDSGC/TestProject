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

import ProjectMiniView from '../Projects/ProjectMiniView';
import Tag from '../CommonComponents/Tag';

class SloHacksLandingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sloProjectsVotingOrder: [],
      isLoading: true,
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    axios.get('/api/slohacks/projects')
    .then ((response) => {
      this.setState({
        sloProjectsVotingOrder: response.data,
        isLoading: false
      })
    })
  }

  render() {

    var centered ={
      position: "fixed",
      top: "50%",
      left: "50%",
      marginTop: "-50px",
      marginLeft: "-100px"
    }

    if(this.state.isLoading){
      return (
        <div style={centered} >
          <div style={ {display: "flex", flexDirection: "column", justifyContent: "center"} }>
            Counting Votes .....
            <img src="/assets/img/misc/countingFingers.gif" style={ {width: "20rem"} }/>
          </div>
        </div>
      )
    }

    var projectsVotedSection = [];

    if (this.state.sloProjectsVotingOrder.length == 0) {
      projectsVotedSection =
        <Paper className="slo-add-projects-cta">
          <center>
            <h3>
            Add Your Projects!
            </h3>
            <RaisedButton
              label="Sign Up and Add Your Project"
              primary={true}
              onClick={ ()=>browserHistory.push("/signup?inviteCode=slohacks") }
            />
          </center>
          <br/>
          <p>
            No projects yet! Be the first to add your project so that it can get voted up ;)
          </p>
        </Paper>

    } else {
      projectsVotedSection = this.state.sloProjectsVotingOrder.map( (project, index) => {
        var containerHeader = ""
        if (index == 0) {
          containerHeader =
            <h3>
              Highest Voted!
            </h3>
        } else if (index == 1) {
          containerHeader =
            <h3>
              Second Highest!
            </h3>
        }

        return (
          <Paper className="slo-indiv-project-container">
            <div className="slo-container-header">
              {containerHeader}
            </div>
            <div>
              <ProjectMiniView project={project} />
            </div>
          </Paper>
        )
      });
    }

    var sloTag = {
      friendlyName: "SloHacks",
      id: "5a7436250ea8e900136164ed",
      logoURL: "https://cdn.filestackcontent.com/SwNEu4pXS6m0z6n4dA5j",
      slug: "sloHacks",
    }

    return (
      <MuiThemeProvider>
        <div>
          {/******* Banner Image ******/}
          <div className="slo-full-width-container">
            <img src="/assets/img/misc/calPolySign.jpeg" style={ {position:"absolute", zIndex: "-500", width: "100%", height: "100%", objectFit: "cover"} } />
            <div className="slo-main-container">

              {/* Page Header Container */}
              <div className="slo-page-header-container">
                <div className="slo-page-text">
                  Slo Hacks
                </div>

                <div className="slo-page-subtitle">
                  Highest Voted Hacks
                </div>

                <div className="slo-page-header-content">
                  <RaisedButton
                    label="Sign Up and Add Your Project"
                    primary={true}
                    onClick={ ()=>browserHistory.push("/signup?inviteCode=sloHacks") }
                  />
                  <p className="slo-page-helper-text">
                    Please be sure to add the tag <div style={ {color: "black", display: "inline", margin: "0 .5rem"} }><Tag tag={sloTag} /></div> to your project.
                  </p>
                  <p className="slo-page-helper-text">
                    InviteCode: &nbsp; <b>"slohacks"</b>
                  </p>
                  <p className="slo-page-helper-text">
                    Anybody can vote, no account needed! Winner will be determined at 2 PM on Sunday Feb 4th.
                  </p>
                </div>
              </div>
              <div className="slo-projects-container" >
                {projectsVotedSection}
              </div>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default SloHacksLandingPage;
