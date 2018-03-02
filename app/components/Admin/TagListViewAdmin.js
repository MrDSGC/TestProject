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

import Tag from '../CommonComponents/Tag';
import ConfirmDialog from '../CommonComponents/ConfirmDialog';
import AdminHeader from './AdminHeader';

var tagInitEmpty = () => {
  return {
    slug: "",
    friendlyName: "",
    type: "",
    description: "",
    logoURL: "",
    links: [{
      linkType: "",
      friendlyLabel: "",
      url: "",
      order: ""
    }]
  }
}

class TagListViewAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.tagEdit = this.tagEdit.bind(this);
    this.closeTagDialog = this.closeTagDialog.bind(this);
    this.submitTagUpdate = this.submitTagUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeArray = this.handleChangeArray.bind(this);
    this.addLinkToTagEdit = this.addLinkToTagEdit.bind(this);

    this.state = {
      tags: [],
      isLoading: true,
      editTagDialogStatus: false,
      tagToEdit: tagInitEmpty()
    }
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });
    axios.get('/api/tags/')
    .then ((response) => {
      this.setState({
        tags: response.data,
        isLoading: false
      })
    })
  }

  handleChange(event) {
    var newState = this.state;
    newState.tagToEdit[event.target.name] = event.target.value;
    this.setState(newState);
  }

  handleChangeArray(index) {
    return (event) => {
      var newState = this.state;
      newState.tagToEdit.links[index][event.target.name] = event.target.value;
      this.setState(newState);
    }
  }

  tagEdit(tag) {
    // Open Edit Dialog with selected Tag
    this.setState({
      tagToEdit: tag,
      editTagDialogStatus: true
    })
  }

  closeTagDialog() {
    this.setState({
      tagToEdit: tagInitEmpty(),
      editTagDialogStatus: false
    });
  }

  addLinkToTagEdit() {
    var tagNewState = this.state.tagToEdit;
    tagNewState.links.push(tagInitEmpty().links[0]);

    this.setState({
      tagToEdit: tagNewState
    });
  }

  submitTagUpdate() {
    var tagToSubmit = this.state.tagToEdit;
    delete tagToSubmit.__v;
    delete tagToSubmit.updatedAt;
    delete tagToSubmit.createdAt;

    axios.post(
      '/api/admin/tag',
      {tagToSubmit}
    ).then( (response) => {
      if (response.data.state == "newTag") {
        var newState = this.state;
        newState.tags.push(response.data.tag);

        this.setState({
          tags: newState.tags,
          tagToEdit: tagInitEmpty
        });
      }

      // close dialogue and empty edit array.
      this.setState({
        tagToEdit: tagInitEmpty(),
        editTagDialogStatus: false
      });
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

    var tagSection = [];
    tagSection = this.state.tags.map( (tag) => {
      return (
        <Tag tag={tag} tagClickHandler={() => this.tagEdit(tag)} />
      );
    });

    var tagFormSection = [];
    var linksSection = [];
    _.forEach(this.state.tagToEdit, (value, key) => {
      if (key == "links") {
        this.state.tagToEdit[key].map( (linkSectionFromState, index) => {
          _.forEach(linkSectionFromState, (value, key) => {
            linksSection.push(
              <div className="row">
                <div className="col-xs-12 col-md-3 u-center-right">
                  {key}
                </div>
                <div className="col-xs-12 col-md-7">
                  <TextField
                    className='vertically-center'
                    name={key}
                    onChange={this.handleChangeArray(index)}
                    value={value}
                    floatingLabelText={key}
                    fullWidth={true}
                  />
                </div>
              </div>
            );
          }); // for each link property
          tagFormSection.push(<hr/>);
          tagFormSection.push(linksSection);
          linksSection = []; // clear linksSection
        }); // all links

        // one button
        tagFormSection.push(
          <RaisedButton label="Add Link" primary={true} onClick={this.addLinkToTagEdit } />
        );

      } else {
        tagFormSection.push(
          <div className="row">
            <div className="col-xs-12 col-md-3 u-center-right">
              {key}
            </div>
            <div className="col-xs-12 col-md-7">
              <TextField
                className='vertically-center'
                name={key}
                onChange={this.handleChange}
                value={value}
                floatingLabelText={key}
                fullWidth={true}
              />
            </div>
          </div>
        );
      }
    });

    return (
      <MuiThemeProvider>
        <div className="main-container-v2">
          <div className="width-section-70-v2">

            {/* Edit Dialog */}
            <ConfirmDialog
              dialogViewStatus={this.state.editTagDialogStatus}
              handleClose = { this.closeTagDialog }
              handleConfirm = { this.submitTagUpdate }
            >
              <h3>
                Edit {this.state.tagToEdit.friendlyName}
              </h3>
              <Tag tag={this.state.tagToEdit} tagClickHandler={ ()=>browserHistory.push("/admin/tags/" + this.state.tagToEdit.slug) } />
              <ReactFilestack
                apikey='A78lxkjwR2SEz9gHaIPOVz'
                options={{
                  accept: 'image/*',
                  maxFiles: 5,
                  storeTo: {
                    location: 's3'
                  }
                }}
                onSuccess={(result) => {
                  var mediaURL = result.filesUploaded[0].url;
                  var newState = this.state;
                  newState.tagToEdit.logoURL = mediaURL;
                  this.setState(newState);
                }}
                render={({ onPick }) => (
                  <div className="u-margin-top-small">
                    <RaisedButton label="Add Logo" primary={true} onClick={onPick} />
                  </div>
                )}
              />

              <div className="container-fluid">
                {tagFormSection}
              </div>

            </ConfirmDialog>

            <AdminHeader title="Tag List" />

            <Paper className="section-container-padding u-margin-top-small">
              <a onClick={() => this.tagEdit(tagInitEmpty())}> Create a new tag </a>
              <br/>
              <br/>
              {tagSection}
            </Paper>
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default TagListViewAdmin;
