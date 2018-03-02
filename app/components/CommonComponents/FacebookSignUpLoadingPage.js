import React from 'react';
import { getCurrentUser } from '../../actions/auth';
import { DotLoader } from 'react-spinners';
import { connect } from 'react-redux'
import cookie from 'react-cookie';

class FacebookSignUpLoadingPage extends React.Component {
  componentDidMount() {
    if (this.props.location.query.token) {
      this.props.dispatch(getCurrentUser(this.props.location.query.token));
    }
  }

  render() {
    return (
      <div className="loading-spinner">
        Contacting Mark Zuckerberg...
        <DotLoader />
      </div>
    )
  }
}

export default connect()(FacebookSignUpLoadingPage);
