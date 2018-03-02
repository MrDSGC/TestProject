import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

const UsernamePhoto = (props) => {
  var style = {
    cursor: "pointer"
  }

  if (props.user == null) {
    return null;
  }

  if (props.userClickHandler) {
    return (
      <div className="project-mini__creators" style={style} onClick={ props.userClickHandler }>
        <div className="username-photo-container">
          <img src={props.user.profilePicUrl} className="mini-user-photo" />

          <div className='mini-user-name-container'>
            <p className="mini-user-name" style={props.textStyle} >
              {props.user.firstName} {props.user.lastName}
            </p>
            {props.usernameSubtext}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="project-mini__creators">
      <Link to={`/profile/${props.user.slug}`} className="username-photo-container">
        <img src={props.user.profilePicUrl} className="mini-user-photo" />
        <div className='mini-user-name-container'>
          <p className="mini-user-name">
            {props.user.firstName} {props.user.lastName}
          </p>
          {props.usernameSubtext}
        </div>
      </Link>
    </div>
  )
}

export default UsernamePhoto;
