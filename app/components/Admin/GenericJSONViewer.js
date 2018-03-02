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

var JSONParser = (JSONObjectToParse, depthLevel) => {
  // strip out addition fields.
  var JSONObjectToParse = JSON.parse(JSON.stringify(JSONObjectToParse))

  var returnObject = [];

  // prevent long call stacks
  if (depthLevel > 9) {
    return (
      <div style={ {backgroundColor: "blue"} }>
        end
      </div>
    );

  } else {
    _.forEach(JSONObjectToParse, (value, key) => {
      if (value instanceof Object) {
        returnObject.push(
          <div>
            <div className="row key-value-border">
              <div className="col-xs-12 col-md-2 u-center-right">
                {JSON.stringify(key)}
              </div>
              <div className="col-xs-12 col-md-10" style={ {marginLeft: "10px"} } >
                {JSONParser(value, depthLevel+1)}
              </div>
            </div>
          </div>
        );

      } else {
        returnObject.push(
          <div className="row key-value-border">
            <div className="col-xs-12 col-md-2 u-center-right">
              {JSON.stringify(key)}
            </div>
            <div className="col-xs-12 col-md-10">
              <TextField
                className='vertically-center'
                name={JSON.stringify(key)}
                value={value}
                floatingLabelText={JSON.stringify(key)}
                fullWidth={true}
              />
            </div>
          </div>
        );
      }
    });
    return returnObject;
  }
}

class GenericJSONViewer extends React.Component {
  constructor(props) {
    super(props);

    this.changeDialogState = this.changeDialogState.bind(this);

    this.state = {
      JSONtoRender: this.props.JSONtoRender,
      dialogueOpenStatus: false,
    }
  }

  changeDialogState() {
    this.setState({dialogueOpenStatus: !this.state.dialogueOpenStatus});
  }

  render() {
    var JSONSection = [];

    if (this.state.dialogueOpenStatus) {
      JSONSection = JSONParser(this.state.JSONtoRender, 0);
    } else {
      JSONSection = [];
    }

    return (
      <Paper className="section-container-padding u-margin-top-small">
        <h3>
          {this.props.title ? this.props.title : ""}
        </h3>

        <RaisedButton
          label="View JSON"
          primary={true}
          style={ {marginLeft: "5px"} }
          onClick={ ()=>this.changeDialogState() }
        />
        <div>
          {JSONSection}
        </div>
      </Paper>
    )
  }
}

export default GenericJSONViewer;
