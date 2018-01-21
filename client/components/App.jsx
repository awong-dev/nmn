import React from 'react'
import firebase from 'firebase'

import LoginBar from './LoginBar'

import CorrelationGraph from './CorrelationGraph'
import DeltaGraph from './DeltaGraph'
import DataControl from './DataControl'
import DescriptiveStats from './DescriptiveStats'
import EnterNowHistogram from './EnterNowHistogram'
import PairedEnterNowHistogram from './PairedEnterNowHistogram'
import FrequencyGraph from './FrequencyGraph'
import VerticalDeltas from './VerticalDeltas'

import SurveyData from '../data/SurveyData'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      data_control: {
        category: 'Negative',
        source_url: "",
        demographic: {
          mhprov: true,
          otherprov: true,
          male36_64: true,
          uncategorized: true,
        },
      }
    };

    this.survey_data_ref = firebase.storage().ref('/data/survey-data-2017-12-13.json');

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleDemographicChange = this.handleDemographicChange.bind(this);
    this.handleSourceUrlChange = this.handleSourceUrlChange.bind(this);
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

  handleCategoryChange(event) {
    this.setState({
      data_control:
        Object.assign({}, this.state.data_control,
                      {category: event.target.value})});
  }

  handleSourceUrlChange(event) {
    this.setState({
      data_control:
        Object.assign({}, this.state.data_control,
                      {source_url: event.target.value})});
  }

  handleDemographicChange(event) {
    this.setState({
      data_control:
        Object.assign({}, this.state.data_control,
                      { demographic:
                        Object.assign({}, this.state.data_control.demographic,
                      { [event.target.name]: event.target.checked })
                      })
    });
  }

  render() {
    const graphs = [];
    if (this.state.survey_data === undefined) {
      graphs.push(<div key="ruh-roh">Uh oh. Couldn't load data. Are you authorized?</div>);
    } else {
      const values = this.state.survey_data.getValues(this.state.data_control.category, this.state.data_control.demographic, this.state.data_control.source_url);
      graphs.push(
        <DescriptiveStats values={values} key="descriptive-stats" />,
        <EnterNowHistogram values={values} dataControl={this.state.data_control} key="enter-now-histogram" />,
        <PairedEnterNowHistogram values={values} dataControl={this.state.data_control} key="paired-enter-now-histogram" />,
          /*
        <VerticalDeltas gotBetter={true} surveyData={this.state.survey_data} category='Negative' key="vertical-negative-better" />,
        <VerticalDeltas gotBetter={true} surveyData={this.state.survey_data} category='Suicidal' key="vertical-suicidal-better" />,
        <VerticalDeltas gotBetter={false} surveyData={this.state.survey_data} category='Negative' key="vertical-negative-worse" />,
        <VerticalDeltas gotBetter={false} surveyData={this.state.survey_data} category='Suicidal' key="vertical-suicidal-worse" />,
        */
        // Data holes.
        // IP collision, enter/exit.
        // small changes (0-1 delta), medium changes (2-3), large changes (4).
            //        <DeltaGraph surveyData={this.state.survey_data} key="delta-graph" />,
          //        <FrequencyGraph surveyData={this.state.survey_data} key="frequency-graph" />,
      );

      /*
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
      */
    }
    return (
      <div className="mdc-toolbar-fixed-adjust">
      <LoginBar />
      <div className="nmn-test-content">
        <DataControl
          category={this.state.data_control.category}
          onCategoryChange={this.handleCategoryChange}
          demographic={this.state.data_control.demographic}
          onDemographicChange={this.handleDemographicChange}
          source_url={this.state.data_control.source_url}
          onSourceUrlChange={this.handleSourceUrlChange} />
        <main className="nmn-test-main">
          {graphs}
        </main>
      </div>
      </div>
    );
  }
}

export default App;
