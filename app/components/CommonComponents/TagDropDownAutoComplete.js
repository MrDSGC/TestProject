import React from 'react';
import axios from 'axios';
import _ from "lodash";

import Tag from './Tag';

import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class TagDropDownAutoComplete extends React.Component {
  constructor(props) {
    super(props);

    this.handleElementClick = this.handleElementClick.bind(this);
    this.handleTagSearchInputField = this.handleTagSearchInputField.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    this.handleClick = this.handleClick.bind(this);

    this.state = {
      returnedTagsFromSearch: [],
      tagInput: "",
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

 handleElementClick(tag) {
   this.props.elementClick(tag);
   this.handleClick();
   this.setState({tagInput: ""});
 }

 handleOutsideClick(e) {
   // ignore clicks on the component itself
   if (this.node.contains(e.target)) {
     return;
   }
   this.handleClick();
 }

  handleTagSearchInputField(event) {
    this.setState({
      tagInput: event.target.value
    });

    var makeRequest = () => {
      axios.get('/api/tags/search/' + searchValue)
      .then ((response) => {
        if (response.data.length && this.state.tagInput.length) {
          document.addEventListener('click', this.handleOutsideClick, false);
          this.setState({
            returnedTagsFromSearch: response.data,
            showDropdown: true
          });
        } else {
          this.setState({returnedTagsFromSearch: []});
        }
      })
    }

    var searchValue = event.target.value;
    if (searchValue.length == "") {
      this.setState({returnedTagsFromSearch: []});
    } else {
      _.debounce( ()=>{
          makeRequest()
        },
        1000
      )();
    }
  }

  render() {
    var searchResults = "";

    if (this.state.showDropdown) {
      searchResults = this.state.returnedTagsFromSearch.map( (tag) => {
        return (
          <div className="dropdown-element" onClick={ () => { this.handleElementClick(tag) } } >
            <Tag tag={tag} />
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
            name="skillsTags"
            value={this.state.tagInput}
            onChange={this.handleTagSearchInputField}
            type="text"
            onClick = { ()=> this.handleClick() }
            floatingLabelText="Add a tag"
          />
        </MuiThemeProvider>
        <div className="dropdown-container" ref={node => { this.node = node; }}>
          {searchResults}
        </div>
      </div>
    )
  }
}

export default TagDropDownAutoComplete;
