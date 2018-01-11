import React from 'react'
import Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more.src'
import ChartCard from './ChartCard'
HighchartsMore(Highcharts);

class VerticalDeltas extends React.Component {
  constructor(props) {
    super(props);
    const surveyData = this.props.surveyData;
    this.state = {
      data: this.props.surveyData.getEnteredNowValues(props.category),
      id: `vertical-deltas-${props.category}-container`,
      title: `Enter to Now sorted : ${props.category}`, 
    };
  }

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    Highcharts.chart(this.state.id, {
	 chart: {
	   type: 'columnrange',
	   inverted: true
	 },
	 title: {
	   text: this.state.title,
	 },
	 xAxis: {
	   title: { text: 'Entry' },
	 },
	 yAxis: {
	   title: { text: 'Ratings' }
	 },
	 plotOptions: {
	   columnrange: {
		dataLabels: {
		  enabled: true,
		  formatter: function () {
		    return this.y;
		  }
		}
	   }
	 },
	 series: [{
        turboThreshold: 0,
	   name: 'enter-exit',
	   data: this.state.data,
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

export default VerticalDeltas;
