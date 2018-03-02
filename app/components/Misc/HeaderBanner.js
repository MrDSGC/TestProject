import React from 'react';
import { Link } from 'react-router';

import Popover, {PopoverAnimationVertical} from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class HeaderBanner extends React.Component {
  render() {
    return (
      <MuiThemeProvider>
      <div className="banner-full-width">
          <div>
            {/* right container */}
          </div>
          <Link to="/careers" className="banner-full-width--text">

            HackHive Careers is launching Soon! <b>Exclusive access to jobs and internships </b>.
          </Link>
          <div>
            {/* left container */}
          </div>
      </div>
    </MuiThemeProvider>
    );
  }
}

export default HeaderBanner;
