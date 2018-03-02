import React from 'react';
import YouTubeDialogPlay from './YouTubeDialogPlay'

class LinksSection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialogYouTube: false, //this.props.showYoutubeStatus,
      links: this.props.links
    }
  }

  render() {
    // Links
    const links = this.props.links.map( (link) => {
      if (link.linkType == "youtube") {
        return [
          <YouTubeDialogPlay handleClose={() => {this.setState({showDialogYouTube:false})}} youtubeUrl={link.url} showDialogYouTube={this.state.showDialogYouTube} />,
          <a onClick={ () => this.setState({showDialogYouTube: true}) } className="profile-section-link-item">
            {getSocialMediaIcon(link.linkType)}
            <p className="text-overflow">{link.friendlyLabel}</p>
          </a>
        ]
      }

      return (
        <a href={link.url} target="_blank" className="profile-section-link-item">
          {getSocialMediaIcon(link.linkType)}
          <p className="text-overflow">{link.friendlyLabel}</p>
        </a>
      )
    });

    return (
      <div className="section__content">
        {links}
      </div>
    );
  }
}

export default LinksSection;

// Social Media Icon Helper Function
const getSocialMediaIcon = (iconType) => {
  switch (iconType) {
    case 'apple-app-store':
      return (
        <img src="/assets/img/app-store-apple-symbol.svg" className="icon"/>
      );
    case 'youtube':
      return (
        <img src="/assets/img/YouTube_dark_icon.svg" className="icon"/>
      );
    case 'github':
      return (
        <img src="/assets/img/github-logo.svg" className="icon"/>
      );
    case 'email':
      return (
        <img src="/assets/img/close-envelope.svg" className="icon"/>
      );
    case 'linkedin':
      return (
        <img src="/assets/img/linkedin-logo.svg" className="icon"/>
      );
    case 'twitter':
      return (
        <img src="/assets/img/twitter.svg" className="icon"/>
      );
    case 'web':
      return (
        <img src="/assets/img/grid-world.svg" className="icon"/>
      );
    default:
      return "";
  }
}
