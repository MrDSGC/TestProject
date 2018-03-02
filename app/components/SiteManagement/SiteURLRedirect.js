import React from 'react';
import { DotLoader } from 'react-spinners';
import { browserHistory } from 'react-router';
import axios from 'axios';
import _ from 'lodash';

class SiteURLRedirect extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      urlToGoTo: '',
      isValidUrlRedirect: false
    }
  }

  componentDidMount() {
    // setup subscribe button setup. Get eventObject
    axios.get(`/api/siteManagement/urlRedirect/${this.props.params.urlRedirect}`)
    .then ((response) => {

      if (response.data.isValidUrlRedirect) {
        var newState = this.state;
        newState.urlToGoTo = response.data.urlToGoTo;
        newState.isLoading = false;
        newState.isValidUrlRedirect = true;
        this.setState(newState);
      } else {
        window.location.href = "/404"
      }
    });
  }

  render() {
    if(this.state.isLoading){
      return (
        <div className="loading-spinner">
          <DotLoader />
        </div>
      )
    } else {
      window.location.href = this.state.urlToGoTo
    }

    return(null);
  }
}

export default SiteURLRedirect;
