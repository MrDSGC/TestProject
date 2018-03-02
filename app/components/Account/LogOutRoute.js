import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux'
import { logout } from '../../actions/auth';

class LogOutRoute extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(logout())
  }

  render() {
    return (
      <div>
      </div>
    );
  }
}

export default connect()(LogOutRoute);
