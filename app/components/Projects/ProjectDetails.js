import React from 'react';
import { Link } from 'react-router';
import PhotoRowWithModalPicture from './PhotoRowWithModalPicture';
import LightBoxDialog from'../CommonComponents/LightBoxDialog'

class ProjectDetails extends React.Component {
  constructor(props) {
    super(props);
    this.openLightBoxHeroImage = this.openLightBoxHeroImage.bind(this);
    this.state = {
      heroImageLightBoxOpen: false
    }
  }

  openLightBoxHeroImage() {
    if (this.state.heroImageLightBoxOpen) {
      this.setState({heroImageLightBoxOpen: false});
    } else {
      this.setState({heroImageLightBoxOpen: true});
    }
  }

  render() {
    var privateViewNotice = "";
    if (!this.props.project.publicStatus) {
      privateViewNotice =
        <div role="alert" className="alert alert-danger">
          <b> Private View. </b> Only you can view this project since you are a collaborator.  This project will not appear on your profile.
          <Link to={"/project/edit/" + this.props.project.slug } > Update your project </Link>
        </div>
    }

    var sectionDetails = this.props.project.details.map((sectionDetail) => {
      return (
        <div className="project-content">
          <div className="section-header">
            {sectionDetail.title}
          </div>
          <div className="section-content" dangerouslySetInnerHTML={{ __html: sectionDetail.body }} />
          <div className="section-media">
            <PhotoRowWithModalPicture mediaArray = {sectionDetail.media} />
          </div>
        </div>
      )
    });

    return (
      <div className="project-section-container">
        {privateViewNotice}

        <LightBoxDialog
          pictureViewDialogStatus = {this.state.heroImageLightBoxOpen}
          handleClose = {this.openLightBoxHeroImage}
          mediaToRender = { {mediaURL:this.props.project.heroImageUrl} }
        />
        <div className="project-hero-image">
          <img src={this.props.project.heroImageUrl} className="image-container" onClick={this.openLightBoxHeroImage} />
        </div>
        {sectionDetails}
      </div>
    )
  }
}

export default ProjectDetails;
