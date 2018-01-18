import React from 'react'
import firebase from 'firebase'

import LoginBar from './LoginBar'

import CorrelationGraph from './CorrelationGraph'
import DeltaGraph from './DeltaGraph'
import DescriptiveStats from './DescriptiveStats'
import EnterNowModes from './EnterNowModes'
import FrequencyGraph from './FrequencyGraph'
import VerticalDeltas from './VerticalDeltas'

import SurveyData from '../data/SurveyData'

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
      this.setState({ survey_data: new SurveyData(survey_data) });
    });
  }


  render() {
    const graphs = [];
    if (this.state.survey_data) {
      graphs.push(
        <DescriptiveStats surveyData={this.state.survey_data} key="descriptive-stats" />,
          /*
        <VerticalDeltas gotBetter={true} surveyData={this.state.survey_data} category='Negative' key="vertical-negative-better" />,
        <VerticalDeltas gotBetter={true} surveyData={this.state.survey_data} category='Suicidal' key="vertical-suicidal-better" />,
        <VerticalDeltas gotBetter={false} surveyData={this.state.survey_data} category='Negative' key="vertical-negative-worse" />,
        <VerticalDeltas gotBetter={false} surveyData={this.state.survey_data} category='Suicidal' key="vertical-suicidal-worse" />,
        <EnterNowModes surveyData={this.state.survey_data} category='Negative' key="enter-exit-negative" />,
        <EnterNowModes surveyData={this.state.survey_data} category='Suicidal' key="enter-exit-suicidal" />,
        */
        // Data holes.
        // IP collision, enter/exit.
        // small changes (0-1 delta), medium changes (2-3), large changes (4).
        <DeltaGraph surveyData={this.state.survey_data} key="delta-graph" />,
          //        <FrequencyGraph surveyData={this.state.survey_data} key="frequency-graph" />,
      );

      for (let category of ['Suicidal', 'Negative']) {
        for (let x of [[false, false], [false, true], [true, false]]) {
          const is_mental_health_provider = x[0];
          const is_other_healthcare_provider = x[1];
          graphs.push(
            <CorrelationGraph
              category={category}
              extraTitle={`Cat: ${category}, mental-health: ${is_mental_health_provider}, other_health: ${is_other_healthcare_provider}`}
              is_midaged_male={false}
              is_mental_health_provider={is_mental_health_provider}
              is_other_healthcare_provider={is_other_healthcare_provider}
              surveyData={this.state.survey_data}
              key={`correlation-graph-${category}-${is_mental_health_provider}-${is_other_healthcare_provider}`}
              width={1024}
              height={400} />,
          );
        }
      }
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
