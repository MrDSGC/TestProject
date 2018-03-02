import React from 'react';
import axios from 'axios';
import _ from "lodash";

import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class SearchProjectDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.handleSearchProjectInputField = this.handleSearchProjectInputField.bind(this);
    this.handleElementClick = this.handleElementClick.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      returnedProjectsFromSearch: [],
      searchString: "",
      showDropdown: false
    }
  }

  handleClick() {
   if (!this.state.showDropdown) {
     // attach/remove event handler
     document.addEventListener('click', this.handleOutsideClick, false);
   } else {
     document.removeEventListener('click', this.handleOutsideClick, false);
   }

   this.setState({
      showDropdown: !this.state.showDropdown,
   });
 }

 handleElementClick(searchResult) {
   this.props.projectClick(searchResult)
   this.handleClick();
   this.setState({searchString: ""});
 }

 handleOutsideClick(e) {
   // ignore clicks on the component itself
   if (this.node.contains(e.target)) {
     return;
   }
   this.handleClick();
 }

  handleSearchProjectInputField(event) {
    this.setState({
      searchString: event.target.value
    });

    var searchValue = event.target.value;

    if (searchValue.length == "") {
      this.setState({returnedProjectsFromSearch: []});
    } else {
      _.debounce(
        () => makeRequest(),
        1000
      )();
    }

    var makeRequest = () => {
      axios.get('/api/projects/search/' + searchValue)
      .then ((response) => {
        if (response.data.length && this.state.searchString.length) {
          document.addEventListener('click', this.handleOutsideClick, false);
          this.setState({
            returnedProjectsFromSearch: response.data,
            showDropdown: true
          });
        } else {
          this.setState({returnedProjectsFromSearch: []});
        }
      })
    }
  }

  render() {
    var searchResults = "";

    if (this.state.showDropdown) {
      searchResults = this.state.returnedProjectsFromSearch.map( (searchResult) => {
        return (
          <div className="project-search-result-item" onClick={ () => this.handleElementClick(searchResult) } >
            <div className="project-search-result-item__thumbnail-name-container">
              <img src={searchResult.heroImageUrl} className="project-search-result-item__thumbnail-container" />
              <div className="project-search-result-item__project-title-container">
                <div>
                  {searchResult.title}
                </div>
              </div>
            </div>
            <div>
              {searchResult.builders.length}
            </div>
          </div>
        )
      });
    } else {
      searchResults = "";
    }

    return (
      <div>
        <MuiThemeProvider>
          <TextField
            name="searchString"
            value={this.state.searchString}
            onChange={this.handleSearchProjectInputField}
            onClick = { ()=> this.handleClick() }
            type="text"
            floatingLabelText="Search a project"
          />
        </MuiThemeProvider>
        <div className="project-results-dropdown-container" ref={node => { this.node = node; }}>
          {searchResults}
        </div>
      </div>
    )
  }
}

export default SearchProjectDropdown;
