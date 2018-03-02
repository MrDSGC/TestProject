import React, {Component} from 'react'

export default class ReactQuillServerSafe extends Component {
  constructor(props) {
    super(props)
    if (typeof window !== 'undefined') {
      this.quill = require('react-quill')
    }
  }

  render() {
    const Quill = this.quill
    if (Quill) {
      return (
        <Quill
          onChange={this.props.onChange}
          theme="snow"
          value={this.props.value}
        >
          <div className="quill-editing-area"/>
        </Quill>
      )
    } else {
      return null
    }
  }
}
