import React from 'react'
import firebase from 'firebase'

import LoginBar from './LoginBar'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { user: null };
    this.survey_data_ref = firebase.storage().ref('/data/survey-data-2017-12-13.json');
  }

  componentDidMount() {
    this.survey_data_ref.getDownloadURL().then(url => {
      return fetch(url);
    }).then(response => {
      return response.json();
    }).then(survey_data => {
      this.setState({ survey_data });
    });
  }


  render() {
    return (
      <div className="mdc-layout-grid mdc-toolbar-fixed-adjust">
      <LoginBar />
        <div className="mdc-layout-grid__inner">
          <div className="mdc-layout-grid__cell">
            Json data:
		  <br />{JSON.stringify(this.state.survey_data, null, 2)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
