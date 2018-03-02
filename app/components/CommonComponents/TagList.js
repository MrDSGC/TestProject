import React from 'react';
import { Link } from 'react-router';
import Tag from './Tag'

class TagList extends React.Component {
  constructor(props) {
    super(props);

    this.onMouseEnterHandler = this.onMouseEnterHandler.bind(this);
    this.onMouseLeaveHandler = this.onMouseLeaveHandler.bind(this);

    this.state = {
      showHover: false
    }
  }

  onMouseEnterHandler() {
    this.setState({
      showHover: true
    });
  }

  onMouseLeaveHandler() {
    this.setState({
      showHover: false
    });
  }

  render() {
    if ( !this.props.tagList || !this.props.tagList.length ) {
      return null;
    }

    var tagsToShow = this.props.tagList.slice(0, this.props.numToShow).map( (tag) => {
      var clickHandler = null;
      if (this.props.onClickHander) {
        clickHandler = () => { this.props.onClickHander(tag) };
      }
      return (
        <Tag tag={tag} tagClickHandler={ clickHandler }/>
      )
    });

    var tagRemainderList = [];
    if (this.state.showHover) {
      tagRemainderList =
      <div className="tag-list-dropdown-container">
        {this.props.tagList.slice(this.props.numToShow).map( (tag) => {
            var clickHandler = null;
            if (this.props.onClickHander) {
              clickHandler = () => { this.props.onClickHander(tag) };
            }
            return (
              <div className="tag-list-dropdown-element">
                <Tag tag={tag} tagClickHandler={ clickHandler } />
              </div>
            )
          })
        }
      </div>
    }

    var tagRemainderCount = this.props.tagList.length - this.props.numToShow;

    var tagRemainderSection = "";
    if (tagRemainderCount > 0) {
      tagRemainderSection = <div
        onMouseEnter={this.onMouseEnterHandler}
        onMouseLeave={this.onMouseLeaveHandler}
        className="tag-list-container-text-length"
      >
        <div className="tag__text">
        + {tagRemainderCount} more
          {tagRemainderList}
        </div>
      </div>
    }

    return (
      <div className="tag-list-container" style={this.props.style}>
        {tagsToShow}
        {tagRemainderSection}
      </div>
    )
  }
}

export default TagList;
