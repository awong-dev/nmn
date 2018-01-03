import React from 'react'
import * as d3 from "d3";
import ChartCard from './ChartCard'

class CorrelationGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.surveyData.getCorrelations(
        props.category,
        props.is_mental_health_provider,
        props.is_other_healthcare_provider,
        props.is_midaged_male),
      width: this.props.width,
      height: this.props.height
    };
  }

  render() {
    // TODO(ajwong): Extract charge container.
    return (
      <ChartCard
        title="Correlation Graph"
        subtitle="Enter vs Now correlations">
        <svg ref={(r) => this.chartRef = r}>
        </svg>
      </ChartCard>
    );
  }
}

export default CorrelationGraph;
