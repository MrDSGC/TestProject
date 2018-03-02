import React from 'react';
import { Link } from 'react-router';

const JoinButtonUserAware = (props) => {
  if (props.token && props.user) {
    return (
      <div className={"username-photo-container-home " + props.backgroundClass}>
        <Link to={"/profile/" + props.user.slug} className="username-photo-container-home__center">
          <img src={props.user.profilePicUrl} className="username-photo-container-home__image" />
          <div className={"username-photo-container-home__username " + props.userNameClass} >
            {props.user.firstName + " " + props.user.lastName}
          </div>
        </Link>
      </div>
    )
  }
  return (
    <Link to="/signup" className={props.buttonStyle}>
      Join
    </Link>
  )
}

export default JoinButtonUserAware;
