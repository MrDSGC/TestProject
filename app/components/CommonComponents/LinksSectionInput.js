import React from 'react';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';

class LinksSectionInput extends React.Component {
  constructor(props) {
    super(props);

    this.addLinkSection = this.addLinkSection.bind(this);
    this.handleSelectChangeLink = this.handleSelectChangeLink.bind(this);
    this.handleLinkInput = this.handleLinkInput.bind(this);
    this.removeLinkSection = this.removeLinkSection.bind(this);
    this.getErrorLinkValue = this.getErrorLinkValue.bind(this);

    this.state = {
      links: this.props.links,
      errorState: {links:{}}
    };
  }

  // Update Parent Component with State
  onChangeMappingToParent() {
    this.props.getLinkSectionStateFunction(this.state)
  }

  addLinkSection() {
    var linksState = this.state.links;
    linksState.push({});

    this.setState({links: linksState});
    this.onChangeMappingToParent()
  }

  removeLinkSection(index) {
    var linksState = this.state.links;
    if (index !== -1) {
      linksState.splice(index, 1);
    }
    this.setState({links: linksState});
    this.onChangeMappingToParent()
  }

  handleSelectChangeLink(linksArrayIndex) {
    return (event, index, value) => {
      var newState = this.state;
      newState.links[linksArrayIndex]['linkType'] = value;

      this.setState(newState);
      this.onChangeMappingToParent();
    }
  }

  handleLinkInput(linksArrayIndex) {
    return (event, index, value) => {
      var newState = this.state;
      newState.links[linksArrayIndex][event.target.name] = event.target.value;

      this.setState(newState);
      this.onChangeMappingToParent()
    }
  }

  getErrorLinkValue(index, label) {
    if (this.props.errorState && this.props.errorState.links[index] && this.props.errorState.links[index][label]) {
      return this.props.errorState.links[index][label];
    }
    return null;
  }

  render() {
    var linkOptions = [
      {value: 'web', name: 'Web'},
      {value: 'email', name: 'Email'},
      {value: 'github', name: 'Github'},
      {value: 'youtube', name: 'Youtube'},
      {value: 'twitter', name: 'Twitter'},
      {value: 'linkedin', name: 'Linkedin'}
    ]
    var profileLinksSection;

    profileLinksSection = this.state.links.map( (link, index) => {
      return (
        <div className='links-input-container u-margin-top-small row'>
          {/* Add Close Button, Move to second column */}

          {/* Remove cancel button on first panel. */}
          { index ?
              <div className='col-xs-12 links-cancel-button'>
                <FontIcon onClick={ () => this.removeLinkSection(index) } className="material-icons u-pointer-cursor">highlight_off</FontIcon>
              </div> : ""
          }
          <div className='col-xs-12'>

            {/* first link */}
            <div className='link-section'>
              <div className='col-md-4'>
                <p>
                  <b>What type of link is this?</b>
                </p>
              </div>
              {/*errorText = { this.getErrorLinkValue(index, "linkTypeError") } */}
              <SelectField
                name="linkType"
                className='col-md-8'
                onChange={this.handleSelectChangeLink(index)}
                value={link.linkType}
                fullWidth = {true}
                floatingLabelText="Link Type"
                errorText = { this.getErrorLinkValue(index, "linkTypeError") }
              >
                {linkOptions.map( (item) => {
                  return (<MenuItem value={item.value} primaryText={item.name} />)
                  })
                }
              </SelectField>
            </div>

            {/* second link */}
            <div className='link-section'>
              <div className='col-md-4'>
                <p>
                  <b>What should a person click on?</b>
                </p>
              </div>
              <TextField
                className='col-md-8'
                name="friendlyLabel"
                onChange={this.handleLinkInput(index)}
                value={link.friendlyLabel}
                floatingLabelText="Link Label"
                fullWidth = {true}
                errorText = { this.getErrorLinkValue(index, "friendlyLabelError") }
              />
            </div>

            {/* third link */}
            <div className='link-section'>
              <div className='col-md-4'>
                <p>
                  <b>Please provide the full URL</b>
                </p>
              </div>
              <TextField
                name="url"
                className='col-md-8'
                onChange={this.handleLinkInput(index)}
                value={link.url}
                floatingLabelText="Url"
                fullWidth = {true}
                errorText = { this.getErrorLinkValue(index, "urlError") }
              />
            </div>
          </div>
        </div>
      )
    });

    return (
      <MuiThemeProvider>
        <div className="">
          {profileLinksSection}
          <div className="center-content u-margin-top-small">
            <RaisedButton
              label="+ Add another link"
              primary={true}
              onClick={this.addLinkSection}
            />
          </div>
        </div>
      </MuiThemeProvider>
    )
  }
}

export default LinksSectionInput;
