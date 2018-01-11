import React from 'react'
import Highcharts from 'highcharts'
import ChartCard from './ChartCard'

const xLabels = ['none', 1, 2, 3, 4, 5]

class EnterNowModes extends React.Component {
  constructor(props) {
    super(props);
    const surveyData = this.props.surveyData;
    this.state = {
      data: {
        enter: this.countValues(surveyData.getEnteredValues(props.category)),
        now: this.countValues(surveyData.getNowValues(props.category)),
      },
      id: `enter-now-${props.category}-container`,
      title: `Enter Now Modes: ${props.category}`, 
    };
  }

  countValues(data) {
    const buckets = {};
    for (const val of data) {
      buckets[val] = buckets[val] ? buckets[val] + 1 : 1;
    }
    const results = [];
    for (const label of xLabels) {
      results.push([label, buckets[label]]);
    }
    return results;
  }

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    Highcharts.chart(this.state.id, {
	 title: {
		text: this.state.title,
	 },
	 xAxis: {
	   title: { text: 'Rating' },
	   categories: xLabels,
	 },
	 yAxis: {
	   title: { text: 'Count' }
	 },
	 plotOptions: {
	   column: {
		pointPadding: 0,
		shadow: false
	   }
	 },
	 series: [{
	   name: 'enter',
	   type: 'column',
	   data: this.state.data.enter,
	 },{
	   name: 'now',
	   type: 'column',
	   data: this.state.data.now,
	 }]
    });
  }

  componentDidUpdate() {
    this.drawChart();
  }

  render() {
    return (
      <ChartCard
        title={this.state.title}
        surveyData="Count of enter/now values"
        onResize={(contentRect) => this.setState({width: contentRect.bounds.width})}>
        <div id={this.state.id} ref={(r) => this.chartRef = r} />
      </ChartCard>
    );
  }
}

export default EnterNowModes;
