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
import UsernamePhoto from '../CommonComponents/UsernamePhoto';
import TagList from '../CommonComponents/TagList';
import UserList from '../CommonComponents/UserList';
import ProjectTableRow from '../CommonComponents/ProjectTableRow';
import AdminHeader from './AdminHeader';
import GenericJSONViewer from './GenericJSONViewer'

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

class TagView extends React.Component {
  constructor(props) {
    super(props);
    this.tagEdit = this.tagEdit.bind(this);
    this.closeTagDialog = this.closeTagDialog.bind(this);
    this.submitTagUpdate = this.submitTagUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeArray = this.handleChangeArray.bind(this);
    this.addLinkToTagEdit = this.addLinkToTagEdit.bind(this);
    this.fetchTagFromAPI = this.fetchTagFromAPI.bind(this);

    this.state = {
      tagToRender: {},
      isLoading: true,
      editTagDialogStatus: false,
      tagProjects: [],
      tagPeople: [],
    }
  }

  fetchTagFromAPI(tagSlug) {
    this.setState({
      isLoading: true
    });
    axios.get('/api/admin/tags/' + tagSlug)
    .then ((response) => {
      var tagState = {
        tagToRender: response.data.tag,
        tagProjects: response.data.projects,
        tagPeople: response.data.people,
        isLoading: false
      }

      delete tagState.tagToRender.projects;
      delete tagState.tagToRender.users;

      this.setState(tagState);
    })
  }

  componentWillReceiveProps(nextProps) {
    this.fetchTagFromAPI(nextProps.params.tagSlug);
  }

  componentDidMount() {
    this.fetchTagFromAPI(this.props.params.tagSlug);
  }

  handleChange(event) {
    var newState = this.state;
    newState.tagToRender[event.target.name] = event.target.value;
    this.setState(newState);
  }

  handleChangeArray(index) {
    return (event) => {
      var newState = this.state;
      newState.tagToRender.links[index][event.target.name] = event.target.value;
      this.setState(newState);
    }
  }

  tagEdit(tag) {
    // Open Edit Dialog with selected Tag
    this.setState({
      tagToRender: tag,
      editTagDialogStatus: true
    })
  }

  closeTagDialog() {
    this.setState({
      editTagDialogStatus: false
    });
  }

  addLinkToTagEdit() {
    var tagNewState = this.state.tagToRender;
    tagNewState.links.push(tagInitEmpty().links[0]);

    this.setState({
      tagToRender: tagNewState
    });
  }

  submitTagUpdate() {
    var tagToSubmit = this.state.tagToRender;
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
          tagToRender: tagInitEmpty
        });
      }

      // close dialogue and empty edit array.
      this.setState({
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

    var tagFormSection = [];
    var linksSection = [];
    _.forEach(this.state.tagToRender, (value, key) => {
      if (key == "links") {
        this.state.tagToRender[key].map( (linkSectionFromState, index) => {
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

    var projectsSection = ""
    projectsSection = this.state.tagProjects.map( (project) => {
      // Project Rows
      var adminProjectViewButton =
      <RaisedButton
        label="Admin View"
        primary={true}
        style={ {marginLeft: "5px"} }
        onClick={ ()=>browserHistory.push("/admin/project/" + project.slug ) }
      />

      return (
        <ProjectTableRow
          project={project}
          tagClickHandler={ (tag)=> { browserHistory.push("/admin/tags/" + tag.slug) } }
          rightLocation={adminProjectViewButton}
          />
      )
    })

    var peopleSection = ""

    peopleSection = this.state.tagPeople.map( (user) => {
      return (
        <div className="user-list-item">
          <UsernamePhoto user={user} />
          <RaisedButton
            label="Profile"
            primary={true}
            onClick={ ()=> browserHistory.push("/profile/" + user.slug) }
          />
        </div>
      )
    })

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
                Edit {this.state.tagToRender.friendlyName}
              </h3>
              <Tag tag={this.state.tagToRender} />

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
                  newState.tagToRender.logoURL = mediaURL;
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

            <AdminHeader titleText={this.state.tagToRender.friendlyName} bottomRow={
              <Tag tag={this.state.tagToRender} tagClickHandler={() => this.tagEdit(this.state.tagToRender)} />
            }
            />

            <Paper className="section-container-padding u-margin-top-small">
              <h3>
                Projects
              </h3>
              {projectsSection}
            </Paper>

            <Paper className="section-container-padding u-margin-top-small">
              <h3>
                People
              </h3>
              {peopleSection}
            </Paper>

            <GenericJSONViewer title="Tag Object" JSONtoRender={this.state.tagToRender} />

          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default TagView;
