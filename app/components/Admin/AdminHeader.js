import React from 'react';
import { Link } from 'react-router';
import { browserHistory } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import SectionHeader from '../CommonComponents/SectionHeader';

const AdminHeader = (props) => {

  var adminButtonRow =
    <div style={ {display: "flex", justifyContent: "space-between", flexWrap: "wrap"} } className="u-margin-top-small" >
      <RaisedButton label="Admin Home" primary={true} onClick={
        () => {browserHistory.push('/admin')} }
      />
      <RaisedButton label="Projects" primary={true} onClick={
        () => {browserHistory.push('/admin/projects')} }
      />
      <RaisedButton label="Sign Up Invite Code" primary={true} onClick={
        () => {browserHistory.push('/admin/signUpInviteCodes')} }
      />
      <RaisedButton label="Invite Requests" primary={true} onClick={
        () => {browserHistory.push('/admin/inviterequests')} }
      />
      <RaisedButton label="Users" primary={true} onClick={
        () => {browserHistory.push('/admin/users')} }
      />
      <RaisedButton label="Tags" primary={true} onClick={
        () => {browserHistory.push('/admin/tags')} }
      />
      <RaisedButton label="Site Management" primary={true} onClick={
        () => {browserHistory.push('/admin/sitemanagement')} }
      />

    </div>

  return (
    <SectionHeader bottomRow={ [adminButtonRow, <br/> ,props.bottomRow] } titleText={props.titleText} topRow={props.TopRow} />
  )
}

export default AdminHeader;
