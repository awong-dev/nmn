import React from 'react';
import Highcharts from 'highcharts'
import ChartCard from './ChartCard'
import jStat from 'jstat';

function getTitle(category) {
  return `${category} Ratings Histogram`;
}

const xLabels = (()=>{
  const array = [];
  for (let enter = 5; enter >= 1; enter--) {
    for (let now = 5; now >= 1; now--) {
      array.push(`(${enter},${now})`);
    }
  }
  return array;
})();

class PairedEnterNowHistogram extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 'paired-enter-now-histogram',
      title: `(Enter,Now) Pair Histrograms`, 
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
    return {
      enter_now_pairs: this.countValues(this.props.values.map(d => `(${d.enter},${d.now})`))
    };
  }

  drawChart() {
    this.chart = Highcharts.chart(this.state.id, {
	 title: { text: getTitle(this.props.dataControl.category) },
	 xAxis: {
	   title: { text: 'Enter - now pairs' },
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
	   name: '(enter,now)',
	   type: 'column',
	   data: this.data.enter_now_pairs,
	 }]
    });
  }

  componentDidUpdate() {
    this.chart.title.update({ text: getTitle(this.props.dataControl.category) });
    this.chart.series[0].setData(this.data.enter_now_pairs, false);
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

export default PairedEnterNowHistogram;
