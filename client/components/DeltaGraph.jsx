import React from 'react'
import * as d3 from "d3";
import firebase from 'firebase'
import Measure from 'react-measure'

class DeltaGraph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.extractDeltas(this.props.surveyData, 'Negative'),
      width: 1024,
      height: 400
    };

    this.drawChart = this.drawChart.bind(this);
  }

  extractDeltas(survey_data, category) {
    const deltas = [];
    const enter_index = survey_data.header.indexOf(`Entered-${category}`);
    const now_index = survey_data.header.indexOf(`Now-${category}`);
    Object.entries(survey_data.data).forEach(
      ([entry_id, row]) => {
        const entered = row[enter_index];
        const now = row[now_index];
        if (entered && now) {
          deltas.push({
            val: now - entered,
            label: entry_id
          })
        }
      });
    deltas.sort((a, b) => {
      if (a.val < b.val)
        return -1;
      if (a.val > b.val) 
        return 1;
      return 0;
    });
    return deltas;
  }

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    this.svg = d3.select(this.chartRef).selectAll("g").remove();
    this.svg = d3.select(this.chartRef)
      .attr("width", this.state.width)
      .attr("height", this.state.height)
      .append('g')
        .attr('class', 'chart-inner');

    this.processing();
  }

  componentWillUnmount() {
    clearInterval(this._interval);
  }

  componentDidUpdate() {
    this.drawChart();
  }

  processing() {
    const { xScale, yScale, colorScale } = this.getScales();

    const bars = this.svg.selectAll('g')
      .data(this.state.data, (d) => {
        return d.label;
      });

    const enterGElements = bars
      .enter()
        .append('g')
          .attr('class', 'added')
          .attr('transform', (x, i) => `translate(${xScale(x.label)}, 0)`);

    bars
      .attr('class', 'updated');

    const barStart = (val) => {
      if (val > 0) {
        return this.state.height / 2 - yScale(Math.abs(val));
      } else {
        return this.state.height / 2;
      }
    };

    enterGElements
      .append('rect')
        .attr("width", xScale.bandwidth())
        .attr('y', (d) => barStart(d.val))
        .attr("height", (d) => yScale(Math.abs(d.val)))
        .attr("fill", (d) => colorScale(d.val));

    bars
      .exit()
        .remove();
  }

  getScales() {
   const xScale = d3.scaleBand()
      .range([0, this.state.width])
      .padding(0.1)
      .domain(this.state.data.map((d) => d.label));

    const yScale = d3.scaleLinear()
      .domain([0, 4])
      .range([0, this.state.height / 2]);

      const colorScale = (val) => {
        let color = d3.color('Gray');
        if (val == -4) {
          return d3.color('Red');
        }
        if (val == -3) {
          return d3.color('HotPink');
        }
        if (val == 3) {
          return d3.color('MediumSeaGreen');
        }
        if (val == 4) {
          return d3.color('Green');
        }
        return color;
      };

    return { xScale, yScale, colorScale };
  }

  render() {
    return (
      <div className="mdc-card mdc-theme--primary-bg mdc-card--theme-dark">
	   <section className="mdc-card__primary">
		<h1 className="mdc-card__title mdc-card__title--large">Delta Graph</h1>
          <h2 className="mdc-card__subtitle">Bar graph of deltas for Negative feelings from enter to "now"</h2>
	   </section>
        <section className="mdc-card__supporting-text">
          <div className="chart">
            <Measure bounds onResize={(contentRect) => this.setState({width: contentRect.bounds.width})}>
              {({ measureRef }) =>
                <div ref={measureRef}>
                  <svg className="bar-chart--basic" ref={(r) => this.chartRef = r}>
                  </svg>
                </div>
              }
            </Measure>
          </div>
        </section>
      </div>
    );
  }
}

export default DeltaGraph;
