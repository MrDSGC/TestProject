import React from 'react';
import { browserHistory, Link } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../actions/auth';
import { goToPath } from '../actions/profile_actions';

import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import HeaderSearchBar from './Search/HeaderSearchBar';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.handleRequestClose = this.handleRequestClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.goToAddress = this.goToAddress.bind(this);
    this.state = {
      open: false,
    };
  }

  handleClick(event) {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  };

  handleRequestClose() {
    this.setState({
      open: false,
    });
  };

  handleLogout(event) {
    event.preventDefault();
    this.props.dispatch(logout());
  }

  goToAddress(path) {
    return (event) => {
      event.preventDefault();
      this.props.dispatch(goToPath(path));
    }
  }

  render() {
    var usernameRender = "Complete your profile";
    if (this.props.user && this.props.user.firstName && this.props.user.lastName) {
      usernameRender = this.props.user.firstName + " " + this.props.user.lastName;
    }

    const rightNav = (this.props.user && this.props.user._id) ? ([
      <ul className="list-inline username-photo-menu-header" onClick={this.handleClick}>
        <li>
          <img className="mini-user-photo" src={this.props.user.profilePicUrl || "/assets/img/catDefault.jpg" }/>
        </li>
        <li className="mini-user-name text-color-grey-light-1">
          {' '}{ usernameRender } {' '}
        </li>
      </ul>,
      <Popover
        open={this.state.open}
        anchorEl={this.state.anchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={this.handleRequestClose}
        animation={PopoverAnimationVertical}
      >
        <Menu>
          <MenuItem primaryText="My Profile" onClick={this.goToAddress('/profile/' + this.props.user.slug)} />
          <MenuItem primaryText="My Projects" onClick={this.goToAddress('/projects')} />
          <MenuItem primaryText="My Account" onClick={this.goToAddress('/account')} />
          <MenuItem primaryText="Sign out" onClick={this.handleLogout} />
        </Menu>
      </Popover>]
    ) : (
      <ul className="list-inline">
        <Link to="/signup" className="btn-nav">
          Join
        </Link>
      </ul>
    );

    var searchBar = null;

    if (this.props.user && this.props.user.isAdmin) {
      searchBar = <HeaderSearchBar projectClick={ (searchResult)=> { browserHistory.push( `/project/${searchResult.slug}`) } }/>
    }

    return (
      <MuiThemeProvider>
      <div className="full-width">
        <div className="container-nav">
          <Link to="/" className="outerbox">
            <img src="/assets/img/hackhive-logo-circle.png" className="hackhive-logo" />
            <div className="hackhive-text">
              HackHive
            </div>
          </Link>

          {searchBar}

          {rightNav}
        </div>
      </div>
    </MuiThemeProvider>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user
  };
};

export default connect(mapStateToProps)(Header);
