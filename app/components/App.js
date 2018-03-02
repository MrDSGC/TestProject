import React from 'react';
import HeaderBanner from './Misc/HeaderBanner';
import Header from './Header';
import Footer from './Footer';
import { connect } from 'react-redux';

class App extends React.Component {
  render() {
    return (
      <div>
        <HeaderBanner />
        <Header/>
        {this.props.children}
      </div>
    );
  }
}

export default connect(null, null)(App);
