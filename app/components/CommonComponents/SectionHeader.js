import React from 'react';
import { Link } from 'react-router';
import Paper from 'material-ui/Paper';

const SectionHeader = (props) => {
  return (
    <Paper className="section-container-padding u-margin-top-small">
        {props.topRow}
      <div className="page-header-text u-margin-top-small">
        <span className="section-title-border">
          {props.titleText}
        </span>
      </div>
      {props.bottomRow}
    </Paper>
  )
}

export default SectionHeader;
