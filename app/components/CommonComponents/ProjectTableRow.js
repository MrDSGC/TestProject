import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

import UserList from './UserList';
import TagList from './TagList';

const ProjectTableRow = (props) => {
  if (!props.project) {
    return null;
  }

  var tagClickHandler = null;
  if (props.tagClickHandler) {
    tagClickHandler = props.tagClickHandler;
  }

  return (
    <div key={props.project._id} className="project-list-item">

      {/*left box */}
      <div  className="project-list-item--left-items-container">

        <div className="project-list-item--left-items-container--props">
          {props.leftLocation}
        </div>

        {/*thumbnail container */}
        <div onClick={ ()=>browserHistory.push("/project/" + props.project.slug ) } className="project-list-item--left-items-container--thumbnail-title-container" style={{cursor: "pointer"}}>
          <img src={props.project.heroImageUrl} className="project-list-item--left-items-container--thumbnail-title-container--thumbnail" />
          <div>
            <h4>
              {props.project.title}
            </h4>
            <p className="text-color-grey-dark-1">
              {props.project.publicStatus ? "Public" : "Private"}
            </p>
          </div>
        </div>
      </div>

      {/*right box */}
      <div className="project-list-item--action-items-container">
        <div className="project-list-item--action-items-container--right-box">
          <div className="project-list-item--action-items-container--right-box--users-tags">
            <UserList userList={props.project.builders} numToShow={1} onClickHander={ (user)=> { browserHistory.push("/profile/" + user.slug) }} />
            <TagList style={ {display:"flex", alignItems: "center"} } tagList={props.project.techTags} numToShow={2} onClickHander={ tagClickHandler }/>
          </div>
          {props.rightLocation}
        </div>
      </div>
    </div>
  )
}

export default ProjectTableRow;
