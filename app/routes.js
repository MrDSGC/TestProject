import React from 'react';
import { IndexRoute, Route } from 'react-router';
import App from './components/App';
import Home from './components/Home';

import FacebookSignUpLoadingPage from './components/CommonComponents/FacebookSignUpLoadingPage';

import ProjectEdit from './components/Projects/ProjectEdit';

import ProfileMain from './components/Profile/ProfileMain';
import ProjectMain from './components/Projects/ProjectMain';

import NotFound from './components/NotFound';
import Login from './components/Account/Login';
import Signup from './components/Account/Signup';
import ProfileEdit from './components/Account/ProfileEdit';
import Forgot from './components/Account/Forgot';
import Reset from './components/Account/Reset';
import LogOutRoute from './components/Account/LogOutRoute';
import AddInviteCode from './components/Account/AddInviteCode';

import UserProjectList from './components/Projects/UserProjectList';
import VerifyVoteEmail from './components/Account/VerifyVoteEmail';

import SloHacksLandingPage from './components/Misc/SloHacksLandingPage';
import CareersPage from './components/LandingPage/CareersPage';

//Site Management Components
import SiteURLRedirect from './components/SiteManagement/SiteURLRedirect';

//Admin Components
import AdminHome from './components/Admin/AdminHome';
import AdminUsers from './components/Admin/AdminUsers';
import AdminUserView from './components/Admin/AdminUserView';
import ProjectList from './components/Admin/ProjectList';
import TagListViewAdmin from './components/Admin/TagListViewAdmin'; // All Tags
import TagView from './components/Admin/TagView'; // Particular Tag
import SignUpInviteCode from './components/Admin/SignUpInviteCode';
import InviteRequest from './components/Admin/InviteRequest';
import AdminProjectView from './components/Admin/AdminProjectView';
import AdminSiteManagement from './components/Admin/AdminSiteManagement';

export default function getRoutes(store) {
  const ensureAuthenticated = (nextState, replace) => {
    if (!store.getState().auth.token) {
      replace('/login');
    }
  };

  const ensureAuthenticatedAndInvited = (nextState, replace) => {
    if (!store.getState().auth.user) {
      replace('/login');
    } else if (!store.getState().auth.user.signUpInviteObject) {
      replace('/addInviteCode');
    }
  };

  const skipIfAuthenticated = (nextState, replace) => {
    if (store.getState().auth.token) {
      replace('/');
    }
  };
  const ensureAuthenticatedAndAdmin = (nextState, replace) => {
    if (!store.getState().auth.token) {
      // not authenticated through token
      replace('/404');
    } else if (!store.getState().auth.user) {
      // not authenticated, through user
      replace('/404');
    } if (store.getState().auth.user && !store.getState().auth.user.isAdmin) {
      // authenticated, but not admin
      replace('/404');
    }
    // no catch - authenticated and admin, go to admin
  };

  const clearMessages = () => {
    store.dispatch({
      type: 'CLEAR_MESSAGES'
    });
  };
  return (
    <Route path="/" component={App}>
      <IndexRoute component={Home} onLeave={clearMessages}/>

      {/* User Management Routes */}
      <Route path="/login" component={Login} onEnter={skipIfAuthenticated} onLeave={clearMessages}/>
      <Route path="/signup" component={Signup} onEnter={skipIfAuthenticated} onLeave={clearMessages} />
      <Route path="/facebookRedirect" component={FacebookSignUpLoadingPage} />
      <Route path="/logout" component={LogOutRoute} onEnter={ensureAuthenticated} onLeave={clearMessages}/>
      <Route path="/addInviteCode" component={AddInviteCode} onEnter={ensureAuthenticated} onLeave={clearMessages}/>
      <Route path="/account" component={ProfileEdit} onEnter={ensureAuthenticatedAndInvited} onLeave={clearMessages}/>
      <Route path="/verifyEmailToVote/:emailVerifyToken" component={VerifyVoteEmail} onLeave={clearMessages}/>

      {/* Not Used */}
      <Route path="/forgot" component={Forgot} onEnter={skipIfAuthenticated} onLeave={clearMessages}/>
      <Route path='/reset/:token' component={Reset} onEnter={skipIfAuthenticated} onLeave={clearMessages}/>

      {/* Profile Routes */}
      <Route path="/profile/:usernameSlug" component={ProfileMain}/>
      <Route path="/completeProfile" component={ProfileEdit} onEnter={ensureAuthenticated}/>

      {/* Project Routes */}
      <Route path="/newProject" component={ProjectEdit}/>
      <Route path="/project/:projectSlug" component={ProjectMain}/>
      <Route path="/project/edit/:projectSlug" component={ProjectEdit} onEnter={ensureAuthenticatedAndInvited} onLeave={clearMessages}/>
      <Route path="/addFirstProject" component={ProjectEdit} onEnter={ensureAuthenticatedAndInvited}/>
      <Route path="/projects" component={UserProjectList} onEnter={ensureAuthenticatedAndInvited} onLeave={clearMessages}/>

      {/*********** Admin Routes ***************/}
      <Route path='/admin' component={AdminHome} onEnter={ensureAuthenticatedAndAdmin} onLeave={clearMessages}/>
      <Route path='/admin/users' component={AdminUsers} onEnter={ensureAuthenticatedAndAdmin} onLeave={clearMessages}/>
      <Route path='/admin/user/:userSlug' component={AdminUserView} onEnter={ensureAuthenticatedAndAdmin} onLeave={clearMessages}/>
      <Route path='/admin/tags/:tagSlug' component={TagView} onEnter={ensureAuthenticatedAndAdmin} />
      <Route path='/admin/signUpInviteCodes' component={SignUpInviteCode} onEnter={ensureAuthenticatedAndAdmin} />
      <Route path='/admin/projects' component={ProjectList} onEnter={ensureAuthenticatedAndAdmin} />
      <Route path='/admin/project/:projectSlug' component={AdminProjectView} onEnter={ensureAuthenticatedAndAdmin} />

      <Route path='/admin/tags' component={TagListViewAdmin} onEnter={ensureAuthenticatedAndAdmin} />
      <Route path='/admin/inviterequests' component={InviteRequest} onEnter={ensureAuthenticatedAndAdmin} />
      <Route path='/admin/sitemanagement' component={AdminSiteManagement} onEnter={ensureAuthenticatedAndAdmin} />

      {/* SloHacks Routes */}
      <Route path="/slohacks" component={SloHacksLandingPage} onLeave={clearMessages}/>

      {/* Careers Page Routes */}
      <Route path="/careers" component={CareersPage} />

      <Route path="/404" component={NotFound} onLeave={clearMessages}/>
      <Route path="/:urlRedirect" component={SiteURLRedirect} />

    </Route>
  );
}
