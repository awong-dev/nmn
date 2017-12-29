import React from 'react'
import firebase from 'firebase'

import LoginBar from './LoginBar'
import DeltaGraph from './DeltaGraph'

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
    const graphs = [];
    if (this.state.survey_data) {
	 graphs.push(<DeltaGraph surveyData={this.state.survey_data} key="delta-graph" />);
    }
    return (
      <div className="mdc-layout-grid mdc-toolbar-fixed-adjust">
      <LoginBar />
      {graphs}
      </div>
    );
  }
}

export default App;
