import React from 'react';
import { browserHistory, Link } from 'react-router';

import TagList from '../CommonComponents/TagList';
import UserList from '../CommonComponents/UserList';

import VoteButton from '../CommonComponents/VoteButton';

const ProjectMiniView = (props) => {
  var onClickHandlerToProject = ()=> { browserHistory.push("/project/" + props.project.slug) }

  return (
      <div className="project-mini">
        <img src={props.project.heroImageUrl} className="project-mini__image" onClick={ onClickHandlerToProject } />
        <div className="project-mini__title" onClick={onClickHandlerToProject} >
          <h4 className="heading-4">
            {props.project.title}
          </h4>
        </div>
        <div className="project-mini__description_text" onClick={onClickHandlerToProject}>
          {props.project.shortDescription}
        </div>

        <div className="project-mini__tags_container">
          <TagList tagList={props.project.techTags} numToShow={3} />
        </div>

        <div className="project-mini__creators">
          <UserList userList={props.project.builders} numToShow={1} onClickHander={ (user)=> { browserHistory.push("/profile/" + user.slug) }} />
        </div>

        <div className="project-mini__vote">
          <VoteButton project={props.project} voteMessageCallback={ props.messageCallBack }/>
        </div>
      </div>
    );
  }

  export default ProjectMiniView;
