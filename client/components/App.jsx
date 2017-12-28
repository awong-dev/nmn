import React from 'react'

import LoginBar from './LoginBar'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { logged_in: false };
  }


  render() {
    return (
      <div className="mdc-layout-grid mdc-toolbar-fixed-adjust">
      <LoginBar />
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell">
            Content area. Put a graphi here.
          </div>
        </div>
      </div>
    );
  }
}

export default App;
