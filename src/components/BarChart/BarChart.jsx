import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from "d3";

class BarChart extends Component {
  constructor(props) {
    super(props);
    this.setAxis = this.setAxis.bind(this);
    this.setRef = this.setRef.bind(this);
    this.redrawData = this.redrawData.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
  }

  setRef(element) {
    this.svg = d3.select(element);
    this.chart = this.svg.append('g');
    this.yAxis = this.chart
      .append('g')
      .attr('class', 'axis y');
    this.xAxis = this.chart
      .append('g')
      .attr('class', 'axis x');
  }

  componentDidMount(){
    this.setAxis();
    this.redrawData();
  }

  componentDidUpdate(prev) {
    if (this.props.data && this.props.data.length > 0) {
      this.setAxis();
      if (JSON.stringify(this.props.filters) !== JSON.stringify(prev.filters)
      || (this.props.current !== prev.current)
      || (this.props.activeTags !== prev.activeTags)) {
        this.redrawData();
      } else {
        this.updateGraph();
      }
    }
  }


  redrawData() {
    const { filters, data } = this.props;
    this.chart.selectAll('rect').remove();
    this.chart.append("g")
      .selectAll("g")
      .data(d3.stack().keys(filters.map(t => t.id))(data))
      .enter()
      .append("g")
      .attr("fill", this.setFill)
      .selectAll("rect")
      .data(function (d) { return d; })
      .enter()
      .append("rect")
      .attr('class', 'data')
      .attr("width", this.setWidth)
      .attr('height', 0)
      .attr("x", this.setX)
      .attr('y', this.acctualHeight)
      .transition()
      .duration(1000)
      .delay(function (d, i) {
        return i * 50;
      })
      .attr("x", this.setX)
      .attr("y", this.setY)
      .attr("height",this.setHeight)
      .attr("width", this.setWidth);

    
  }

  updateGraph() {
    this.chart.selectAll('rect.data')
      .transition()
      .duration(0)
      .attr("x", this.setX)
      .attr("y", this.setY)
      .attr("height",this.setHeight)
      .attr("width", this.setWidth);
  }

  setLegend() {
    const { filters } = this.props;
    if (this.legend) {
      this.legend.selectAll('text').remove();
      this.legend.remove();
    }
    let ypos = 0, newxpos = 0, maxwidth = 0, acctualWidth = this.acctualWidth + 20;
    let length = 115;
    this.legend = this.svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 11)
      .attr("text-anchor", "start")
      .attr("text-transform", "capitalize")
      .attr("transform", "translate(15,5)");

    this.legend.selectAll()
      .data(filters.map(t => t.id).slice().reverse())
      .enter()
      .append("g");

    this.legend.selectAll('g').append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 19)
      .attr("height", 19);

    this.legend.selectAll('g').append("text")
      .attr("x", 0)
      .attr("y", 0)
      .attr('transform', "translate(25, 8.5)")
      .text(function (d) { return d; });

    this.legend.selectAll('g')
      .attr('transform', function(d, i) {
        let xpos = newxpos;
        if (acctualWidth < xpos + length) {
          newxpos = xpos = 0;
          ypos += 25;
        }
        newxpos += length;
        if (newxpos > maxwidth) maxwidth = newxpos;
        return 'translate(' + (xpos) + ',' + ypos + ')';
      });
   return { ypos };
  }

  setAxis() {
    const { margin, width, height } = this.props;
    const { filters, data } = this.props;
    this.acctualWidth = width - (margin / 2) - 10;
    const {ypos}  = this.setLegend();
    this.acctualHeight = height - margin - ypos - 5;

    this.yScale = d3.scaleLinear()
      .rangeRound([this.acctualHeight, 0]);
    this.xScale = d3.scaleBand()
      .rangeRound([0, this.acctualWidth])
      .paddingInner(0.5)
      .align(0.1);
    this.xScale.domain(data.map(function (d) { return d.name; }));
    this.yScale.domain([0, d3.max(data, function (d) { return d.total; })]);
    this.xAxis
      .attr('font-size', 'inherit')
      .attr('transform', `translate(0, ${this.acctualHeight})`)
      .call(d3.axisBottom(this.xScale));
    this.yAxis.call(d3.axisLeft(this.yScale).ticks(5));

    this.setX = (d) => this.xScale(d.data.name);
    this.setY = d =>  this.yScale(d[1]);
    this.setHeight = d => (this.yScale(d[1]) < this.yScale(d[0]) ? this.yScale(d[0]) - this.yScale(d[1]) : 0);
    this.setWidth = () => this.xScale.bandwidth();
    this.setFill = d => filters.find(t => t.id === d.key).color;
    this.setFillLegend = d =>  filters.find(t => t.id === d).color;;
    this.legend.selectAll('rect').attr("fill", this.setFillLegend);
    this.chart.attr('transform', `translate(${margin / 2}, ${margin / 2 + ypos + 5})`)
  }

  render() {
    return (
      <svg
        width={this.props.width}
        height={this.props.height}
        ref={this.setRef}
      />
    );
  }
}

BarChart.propTypes = {
  height: PropTypes.number,
  width: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.shape({})),
  filters: PropTypes.arrayOf(PropTypes.shape({})),
  margin: PropTypes.number,
};

BarChart.defaultProps = {
  height: 600,
  width: 600,
  margin: 60,
}

export default BarChart;
