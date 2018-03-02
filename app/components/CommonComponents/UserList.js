import React from 'react';
import { Link } from 'react-router';
import UsernamePhoto from './UsernamePhoto'

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);

    //make a hard copy.
    var sortedUserList = null;

    if(this.props.userList) {
      var userList = JSON.parse(JSON.stringify(this.props.userList));
      sortedUserList = [];
      sortedUserList = userList.sort( (a, b) => {
        return (a.userOnProjectOrder - b.userOnProjectOrder);
      })
    }

    this.state = {
      showHover: false,
      userList: sortedUserList,
      numToShow: this.props.numToShow
    }
  }

  onMouseEnterHandler() {
    this.setState({
      showHover: true
    });
  }

  onMouseLeaveHandler() {
    this.setState({
      showHover: false
    });
  }

  render() {
    if ( !this.state.userList || !(this.state.userList.length > 0) ) {
      return null;
    }

    var userRemainderList = [];
    if (this.state.showHover) {
      userRemainderList =
      <div className="tag-list-dropdown-container">
        {this.state.userList.slice(this.state.numToShow).map( (user) => {
            return (
              <div className="tag-list-dropdown-element" >
                <UsernamePhoto
                  user={user}
                  userClickHandler={ () => { this.props.onClickHander(user) } }
                  usernameSubtext={user.userOnProjectRole}
                />
              </div>
            )
          })
        }
      </div>
    }

    var userRemainderCount = this.state.userList.length - this.props.numToShow;
    var userRemainderSection = "";
    if (userRemainderCount > 0) {
      userRemainderSection =
        <div
          onMouseEnter={this.onMouseEnterHandler}
          onMouseLeave={this.onMouseLeaveHandler}
          className="tag-list-container-text-length"
        >
        <p className="tag__text">
          + {userRemainderCount} more
            {userRemainderList}
        </p>
        </div>
    }

    var usersToShow = this.state.userList.slice(0, this.state.numToShow).map( (user) => {
      var usernamePhotoStyle = {overflow: "hidden", textOverflow:"ellipsis", maxWidth: "12rem"}; // fullwidth
      var usernameSubtext = user.userOnProjectRole ?
        <p className="mini-user-name-sub-text">
          {user.userOnProjectRole}
        </p> : null

      user.userOnProjectRole;
      if (userRemainderCount > 0) {
        usernamePhotoStyle = {overflow: "hidden", textOverflow:"ellipsis", maxWidth: "10rem"}; // fullwidth
        usernameSubtext = null;   // only show the subtext if there is one user.
      }

      return (
          <UsernamePhoto
            user={user}
            userClickHandler={ () => { this.props.onClickHander(user) } }
            textStyle={ usernamePhotoStyle }
            usernameSubtext={usernameSubtext}
          />
        )
    });

    return (
      <div className="user-list-container">
        {usersToShow}
        {userRemainderSection}
      </div>
    )
  }
}

export default UserList;
