import React from 'react';
import Highcharts from 'highcharts'
import ChartCard from './ChartCard'
import jStat from 'jstat';

function getTitle(category) {
  return `${category} Ratings Histogram`;
}

const xLabels = ['5', '4', '3', '2', '1'];
const xLabelsRld = (()=>{
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
      title: `Histrogram of Now Ratings, bucketed by Enter Rating`, 
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
    return {
      //      enter_now_pairs: this.countValues(this.props.values.map(d => `(${d.enter},${d.now})`)),
      now_buckets: {
        5: this.countValues(values.filter(d => d.now == 5).map(d => `${d.enter}`)),
        4: this.countValues(values.filter(d => d.now == 4).map(d => `${d.enter}`)),
        3: this.countValues(values.filter(d => d.now == 3).map(d => `${d.enter}`)),
        2: this.countValues(values.filter(d => d.now == 2).map(d => `${d.enter}`)),
        1: this.countValues(values.filter(d => d.now == 1).map(d => `${d.enter}`)),
      }
    };
  }

  drawChart() {
    const data = this.getData();
    this.chart = Highcharts.chart(this.state.id, {
	 title: { text: getTitle(this.props.dataControl.category) },
	 xAxis: {
	   title: { text: 'Rating at Enter' },
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
      series: [
        {
          name: 'Now = 5',
          type: 'column',
          data: data.now_buckets[5],
        }, {
          name: 'Now = 4',
          type: 'column',
          data: data.now_buckets[4],
        }, {
          name: 'Now = 3',
          type: 'column',
          data: data.now_buckets[3],
        }, {
          name: 'Now = 2',
          type: 'column',
          data: data.now_buckets[2],
        }, {
          name: 'Now = 1',
          type: 'column',
          data: data.now_buckets[1],
        },
      ]
    });
  }

  componentDidUpdate() {
    clearTimeout(this.chartIsUpdating);
    this.chartIsUpdating = setTimeout(() => {
        const data = this.getData();
        this.chart.title.update({ text: getTitle(this.props.dataControl.category) });
        this.chart.series[0].setData(data.now_buckets[5], false);
        this.chart.series[1].setData(data.now_buckets[4], false);
        this.chart.series[2].setData(data.now_buckets[3], false);
        this.chart.series[3].setData(data.now_buckets[2], false);
        this.chart.series[4].setData(data.now_buckets[1], true);
      }, 100);
  }

  render() {
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
