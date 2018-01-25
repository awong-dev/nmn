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
        dichotomy: "",
      }
    };

    this.survey_data_ref = firebase.storage().ref('/data/survey-data-2017-12-13.json');

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleDichotomyChange = this.handleDichotomyChange.bind(this);
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

  handleDichotomyChange(event) {
    this.setState({
      data_control:
        Object.assign({}, this.state.data_control,
                      {dichotomy: event.target.value})});
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

  makeGraphs(values) {
    const graphs = [];
    if (values === undefined) {
      graphs.push(<div key="ruh-roh">Uh oh. Couldn't load data. Are you authorized?</div>);
    } else {
      graphs.push(
        <PairedEnterNowHistogram values={values} dataControl={this.state.data_control} key="paired-enter-now-histogram" />,
        <EnterNowHistogram values={values} dataControl={this.state.data_control} key="enter-now-histogram" />,
        <DescriptiveStats values={values} key="descriptive-stats" />,
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
    return graphs;
  }

  render() {
    let graphs = (<div>Uh oh. Couldn't load data. Are you authorized?</div>);
    if (this.state.survey_data) {
      const values = this.state.survey_data.getValues(this.state.data_control.category, this.state.data_control.demographic, this.state.data_control.source_url);

      const dichotomy = this.state.data_control.dichotomy;
      if (dichotomy === "") {
        graphs = this.makeGraphs(values);
      } else {
        const group1 = [];
        const group2 = [];
        for (const d of values) {
          if (dichotomy === "1-minute-survey") {
            d.survey_time === 1 ? group1.push(d) : group2.push(d);
          } else if (dichotomy === "3-minute-survey") {
            d.survey_time === 3 ? group1.push(d) : group2.push(d);
          } else if (dichotomy === "high-enter") {
            d.enter >= 4 ? group1.push(d) : group2.push(d);
          }
        }
        graphs = (
          <div className="nmn-test-dichotomy-root">
            <div className="nmn-test-dichotomy-content">
              <div className="column">
                <div className="card mdc-card mdc-theme--secondary-bg mdc-card--theme-dark">
                  <section className="mdc-card__primary nmn-test-dichotomy-group1-header">
                    <h2 className="mdc-card__title mdc-card__title--large">{dichotomy}</h2>
                  </section>
                </div>
                <div className="nmn-test-dichotomy-group1">
                  {this.makeGraphs(group1)}
                </div>
              </div>

              <div className="column">
                <div className="card mdc-card mdc-theme--secondary-bg mdc-card--theme-dark">
                  <section className="mdc-card__primary nmn-test-dichotomy-group2-header">
                    <h2 className="mdc-card__title mdc-card__title--large">Not {dichotomy}</h2>
                  </section>
                </div>
                <div className="nmn-test-dichotomy-group2">
                  {this.makeGraphs(group2)}
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="nmn-test-flex-root">
        <LoginBar />
        <div className="nmn-test-flex-content mdc-toolbar-fixed-adjust ">
          <nav className="mdc-drawer mdc-permanent-drawer mdc-typography nmn-test-nav">
            <DataControl
              dichotomy={this.state.data_control.dichotomy}
              onDichotomyChange={this.handleDichotomyChange}
              category={this.state.data_control.category}
              onCategoryChange={this.handleCategoryChange}
              demographic={this.state.data_control.demographic}
              onDemographicChange={this.handleDemographicChange}
              source_url={this.state.data_control.source_url}
              onSourceUrlChange={this.handleSourceUrlChange} />
          </nav>
          <main className="nmn-test-main">
            {graphs}
          </main>
        </div>
      </div>
    );
  }
}

export default App;
