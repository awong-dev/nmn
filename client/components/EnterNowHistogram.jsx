import React from 'react';
import Highcharts from 'highcharts'
import ChartCard from './ChartCard'
import jStat from 'jstat';

function getTitle(category) {
  return `${category} Ratings Histogram`;
}

const xLabels = [1, 2, 3, 4, 5];
class EnterNowHistogram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 'enter-now-histogram',
      title: `Enter and Now Histograms`,
    };

    this.drawChart = this.drawChart.bind(this);
  }

  countValues(data) {
    const buckets = {};
    for (const val of data) {
      buckets[val] = buckets[val] ? buckets[val] + 1 : 1;
    }
    const results = [];
    for (const label of xLabels) {
      results.push([xLabels.indexOf(label), buckets[label]]);
    }
    return results;
  }

  componentDidMount() {
    this.drawChart();
  }

  getData() {
    const values = this.props.values;
    const enter_values = values.map(d => d.enter);
    const now_values = values.map(d => d.now);
    return {
      enter: this.countValues(enter_values),
      now: this.countValues(now_values),
    };
  }

  drawChart() {
    this.chart = Highcharts.chart(this.state.id, {
	 title: { text: getTitle(this.props.dataControl.category) },
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
	   data: this.data.enter,
	 },{
	   name: 'now',
	   type: 'column',
	   data: this.data.now,
	 }]
    });
  }

  componentDidUpdate() {
    clearTimeout(this.chartIsUpdating);
    this.chartIsUpdating = setTimeout(() => {
      this.chart.title.update({ text: getTitle(this.props.dataControl.category) });
      this.chart.series[0].setData(this.data.enter, false);
      this.chart.series[1].setData(this.data.now, true);
    }, 100);
  }

  render() {
    this.data = this.getData();
    return (
      <ChartCard
        title={this.state.title}
        onResize={(contentRect) => this.setState({width: contentRect.bounds.width})}>
        <div id={this.state.id} ref={(r) => this.chartRef = r} />
      </ChartCard>
    );
  }
}

export default EnterNowHistogram;
