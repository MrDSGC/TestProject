import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux'
import { Link } from 'react-router';
import { DotLoader } from 'react-spinners';

import ProjectMiniView from './Projects/ProjectMiniView';
import JoinButtonUserAware from './CommonComponents/JoinButtonUserAware';

class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {homeProjects: []}
  }

  componentDidMount() {
    axios.get('/api/projects')
    .then (
      (response) => {
        this.setState({homeProjects: response.data})
      }
    )
  }

  render() {
    var projectRow = "";

    if (!this.state.homeProjects.length) {
      projectRow = (
        <DotLoader />
      )
    } else {
      projectRow = this.state.homeProjects.map( (project) => {
        return (
          <ProjectMiniView project= {project} />
        )
      })
    }

    return (
      <div className="home-container">
        {/********* Header ************/}
        <header className="header">
          <div className="bg-video">
            <video className="bg-video__content" autoPlay="true" muted="true" loop="true">
              <source src="assets/img/Sketch.mp4" type="video/mp4" />
                Your browser is not supported!
            </video>
          </div>
          <div className="header__text-box">
            <h1 className="heading-primary">
              <span className="heading-primary--main u-margin-bottom-big">
                Portfolios for Developers
              </span>
            </h1>
            <JoinButtonUserAware token={this.props.token} user={this.props.user} buttonStyle="btn btn--white btn--animated" backgroundClass="btn--white"/>
          </div>
        </header>

        {/********* What Is It ************/}
        <section className="what-is-section">
          <div className="what-is-section__title u-margin-top-medium">
            <h2 className="heading-2 u-margin-bottom-small letter-spacing-md text-color-primary-light text-uppercase">
              The Hack Hive is...
            </h2>
            <div className="what-is-section__main-text">
              an exclusive site for <b>Developers</b> to <b>build a portfolio</b> of their projects and get hired.
            </div>
          </div>
          <div className="heading-3 what-is-section__value-prop-1 what-is-section__value-prop-item">
            Showcase your Projects
          </div>
          <div className="heading-3 what-is-section__value-prop-2 what-is-section__value-prop-item">
            Connect with Developers
          </div>
          <div className="heading-3 what-is-section__value-prop-3 what-is-section__value-prop-item">
            Get Hired
          </div>
        </section>

        {/********* Project Row ************/}
  			<section className="projects-section add-skew-y background-gradient-primary">
          <div className="projects__title u-center-text u-margin-top-small remove-skew-y">
            <h2 className="heading-2 text-uppercase text-color-grey-light-1 letter-spacing-md">
  						Projects on Hack Hive
            </h2>
          </div>
          <div className="remove-skew-y">
            <div className="projects-row">
              {projectRow}
            </div>
          </div>
  			</section>

        {/********* Feature 1 - Projects ************/}
        <section className="feature feature__feature-1">
          <h2 className="heading-2 u-margin-bottom-medium text-color-grey-dark-3 text-uppercase letter-spacing-md">
            Projects
          </h2>
          <div className="heading-3 text-color-grey-dark-1">
            Showcase your projects and see what others are building
          </div>
        </section>

        {/********* Feature 2 - Tag Pool ************/}
        <section className="feature__feature-2">

          <div className="tag-large">
            <img src="https://www.shareicon.net/download/2016/07/10/119874_apps_512x512.png" alt="" className="tag-large__image"/>
            <div className="tag-large__text">
              React
            </div>
          </div>

          <div className="tag-large">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Unofficial_JavaScript_logo_2.svg/2000px-Unofficial_JavaScript_logo_2.svg.png" alt="" className="tag-large__image"/>
            <div className="tag-large__text">
              Javascript
            </div>
          </div>

          <div className="tag-large">
            <img src="https://dudodiprj2sv7.cloudfront.net/product-logos/N7/BO/UA6NT9PUI691-180x180.PNG" alt="" className="tag-large__image"/>
            <div className="tag-large__text">
              Mongo
            </div>
          </div>

          <div className="tag-large">
            <img src="/assets/img/node_logo.jpg" alt="" className="tag-large__image"/>
            <div className="tag-large__text">
              Node
            </div>
          </div>

          <div className="tag-large">
            <img src="https://v4-alpha.getbootstrap.com/assets/brand/bootstrap-solid.svg" alt="" className="tag-large__image"/>
            <div className="tag-large__text">
              Bootstrap
            </div>
          </div>
        </section>

        {/********* Feature DarkBackground ************/}
  			<section className="feature__feature-dark-row-3 background-gradient-primary add-skew-y">
        </section>


        {/********* Feature 3 - Now Hiring Image ************/}
  			<section className="feature__feature-3 add-skew-y">
  				<img src="assets/img/we-are-hiring-ol-512.png" className="feature__feature-3__image remove-skew-y" />
        </section>

        {/********* Feature 4 - Create the right opportunity ************/}
  			<section className="feature__feature-4">
          <h2 className="heading-2 feature__feature-4__feature-title u-margin-bottom-medium text-color-grey-dark-3 text-uppercase letter-spacing-md">
            Get Hired
          </h2>

          <div className="heading-3 feature__feature-4__feature-text text-color-grey-dark-1">
        		Get discovered by engineering managers and recruiters. Projects are the most common way to demonstrate your technical abilities.
        	</div>
  			</section>

        {/********* Feature 5 - Request an invite ************/}
  			<section className="feature__feature-5">
          <h2 className="heading-2 u-margin-bottom-medium text-color-grey-dark-3 text-uppercase letter-spacing-md">
						Join
        	</h2>
        	<div className="heading-3">
        		Hack Hive is an exclusive community for Developers around the world. Currently we are invite-only. Please request an invite!
        	</div>
        </section>

        {/********* Feature 6 - Invite Button ************/}
  			<section className="feature__feature-6">
          <div className="feature__container__image__large-tags-container">
           <JoinButtonUserAware token={this.props.token} user={this.props.user} buttonStyle="btn btn--primary btn--animated" backgroundClass="btn--primary" userNameClass="username-photo-container-home--primary"/>
          </div>
  			</section>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    user: state.auth.user,
    messages: state.messages
  };
};

export default connect(mapStateToProps)(Home);
