import React from 'react';
import { Link } from 'react-router';
import FontIcon from 'material-ui/FontIcon';
import {grey500} from 'material-ui/styles/colors';

const Tag = (props) => {
  var removeButton = ""
  if (props.addRemoveButton) {
    removeButton = <FontIcon color={grey500} className="material-icons" onClick={props.removeHandler}>clear</FontIcon>
  }

  if (!props.tag) {
    return (null);
  }

  var clickHandler = null;
  var styleCursor = {cursor: "default"}
  if (props.tagClickHandler) {
    clickHandler = props.tagClickHandler;
    styleCursor = {cursor: "pointer"}
  }

  return (
    <div className="tag" onClick={ clickHandler } style={styleCursor} >
      <img src={props.tag.logoURL} alt="" className="tag__image"/>
      <div className="tag__text">
        {props.tag.friendlyName}
      </div>
      {removeButton}
    </div>
  )
}

export default Tag;
