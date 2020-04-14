import React, { useEffect, useState, createRef, useRef } from 'react'
import * as d3 from 'd3'
import { IHistoricalCoinData, ICoinData, TimeDividers } from 'interfaces';
import './index.scss'
  

interface IProps {
  data?: IHistoricalCoinData
  divideXIn?: TimeDividers
}

export const CryptoGraphic = ({data, divideXIn}: IProps) => {
  const graphRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  //#region d3 stuff
  // graph constants
  const height = 385
  const width = 871
  const yTicks = 6
  const xPadding = 0.37
  const margin = {
    top: 20,
    right: 50,
    bottom: 30,
    left: 20
  }
  const candleProps = {
    thinLineWidth: 2,
    colorGrowing: "#39D3EC",
    colorShrinking: "#9D7FFE",
    selectColor: (d: ICoinData) => d.open > d.close ? candleProps.colorShrinking
      : d.close > d.open ? candleProps.colorGrowing
      : d3.schemeSet1[8]
  }
  const yLineProps = {
    color: "#EEF1F6",
    opacity: 0.65,
    widthLine: "0.7px"
  }
  const fontProps = {
    color: "#1F263E",
    opacity: 0.4,
  }
  const barChartProps = {
    height: 7.3, // the less, the more
    color: "#EFF2FC"
  }

  const setXAxis = (
    root: d3.Selection<SVGSVGElement, unknown, null, undefined>, 
    xValues: number[], 
    showPer: TimeDividers
  ): d3.ScaleBand<string> => {
    const domain = xValues.map(item => item.toString())
    let tickFormat: (tickValue: string) => string
    let tickValues: string[]

    switch(showPer) {
      case TimeDividers.month: 
        tickValues = xValues.filter(item => new Date(item * 1000).getDate() === 1).map(item => item.toString())
        tickFormat = item => {
          const date = new Date(Number(item)* 1000)
          return `${date.toLocaleString('default', { month: 'long' })}`
        }       
        break
    
      case TimeDividers.day:
        tickValues = xValues.filter(item => new Date(item * 1000).getHours() === 0).map(item => item.toString())
        tickFormat = item => {
          const date = new Date(Number(item)* 1000)
          return `${date.getDate().toString()}. ${date.toLocaleString('default', { month: 'long' })}`
        }
        break

      case TimeDividers.hour: 
        tickValues = xValues.filter(item => new Date(item * 1000).getMinutes() === 0).map(item => item.toString())
        tickFormat = item => {
          const date = new Date(Number(item)* 1000)
          return `${date.getHours().toString()}:00`
        }
        break
    }
    
    const x = d3.scaleBand()
      .domain(domain)
      .range([margin.left, width - margin.right])
      .padding(xPadding)
    
    const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(tickValues).tickFormat(tickFormat))
      .call(g => g.selectAll(".tick text")
        .attr("fill", fontProps.color)
        .attr("opacity", fontProps.opacity))
      .call(g => g.selectAll(".tick line").remove())
      .call(g => g.select(".domain").remove())

    root.append("g")
      .call(xAxis)

    return x
  }

  const setYAxis = (
    root: d3.Selection<SVGSVGElement, unknown, null, undefined>, 
    higherY: number,
    lowerY: number
  ): d3.ScaleLinear<number, number> => {
    const ticks = d3.scaleLinear()
      .domain([lowerY, higherY])
      .rangeRound([height - margin.bottom, margin.top])
      .ticks(yTicks)
    const ticksDiff = ticks[1] - ticks[0]
    const domain = [ticks[0] - ticksDiff, ticks[ticks.length - 1] + ticksDiff]

    const y = d3.scaleLinear()
      .domain(domain)
      .rangeRound([height - margin.bottom, margin.top])

    const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
      .attr("transform", `translate(${width - margin.right},0)`)
      .call(d3.axisRight(y)
        .tickValues(y.ticks(yTicks))
        .tickFormat(tickValue => `${tickValue}`))
      .call(g => g.selectAll(".tick text")
        .attr("transform", "translate(0,-6)"))
      .call(g => g.selectAll(".tick line")
        .attr("stroke-opacity", yLineProps.opacity)
        .attr("stroke-width", yLineProps.widthLine)
        .attr("stroke", yLineProps.color)
        .attr("x2", - width + margin.left + margin.right)) 
      .call(g => g.selectAll(".tick text")
        .attr("fill", fontProps.color)
        .attr("opacity", fontProps.opacity))
      .call(g => g.select(".domain").remove())

    root.append("g")
      .call(yAxis);

    return y
  }

  const setGraphValues = (
    root: d3.Selection<SVGSVGElement, unknown, null, undefined>, 
    graphValues: ICoinData[], 
    x: d3.ScaleBand<string>,
    y: d3.ScaleLinear<number, number>,
    tooltip: d3.Selection<HTMLDivElement | null, unknown, null, undefined>
  ): void => {
    // base tag for thin and thick line positioned correctly in the x
    const g = root.append("g")
      .attr("stroke-linecap", "round")
      .selectAll("g")
      .data(graphValues)
      .join("g")
      .attr("transform", d => `translate(${x(d.time.toString())},0)`)

    // thin line with hiher and lower values
    g.append("line")
      .attr("y1", d => y(d.low))
      .attr("y2", d => y(d.high))
      .attr("stroke", candleProps.selectColor)
      .attr("stroke-width", x.bandwidth()/candleProps.thinLineWidth)

    // thick line with open and close values
    g.append("line")
      .attr("y1", d => y(d.open))
      .attr("y2", d => y(d.close))
      .attr("stroke-width", x.bandwidth())
      .attr("stroke", candleProps.selectColor)

    // set up the hover action
    g.on("mouseover", d => {
      if(d) { 
        const data = d as ICoinData
        tooltip.text(
          `high: ${data.high}\n`+
          `low: ${data.low}\n`+
          `open: ${data.open}\n`+
          `close: ${data.close}`
        )
      }
      return tooltip.style("visibility", "visible")
        .style("opacity", 1);
    })
    .on("mousemove", () => tooltip
      .style("top", (d3.event.pageY-10)+"px")
      .style("left",(d3.event.pageX+10)+"px"))
    .on("mouseout", () => tooltip
      .style("visibility", "hidden")
      .style("opacity", 0))
  }

  const setVolumesYAxis = (
    higherY: number,
  ): d3.ScaleLinear<number, number> => d3.scaleLinear()
    .domain([0, higherY])
    .rangeRound([height - margin.bottom, (height/10) * barChartProps.height ])

  const setVolumeGraphValues = (
    root: d3.Selection<SVGSVGElement, unknown, null, undefined>, 
    graphValues: ICoinData[], 
    x: d3.ScaleBand<string>,
    y: d3.ScaleLinear<number, number>,
    tooltip: d3.Selection<HTMLDivElement | null, unknown, null, undefined>
  ): void => {
    const g = root.append("g")
      .selectAll("g")
      .data(graphValues)
      .join("g")
      .attr("transform", d => `translate(${x(d.time.toString())},0)`)

    g.append("rect")
      .attr("y", d => y(d.volumeFrom))
      .attr("height", d => height - y(d.volumeFrom) - margin.bottom)
      .attr("width", x.bandwidth())
      .attr("fill", barChartProps.color)

    g.on("mouseover", d => {
      if(d) { 
        const data = d as ICoinData
        tooltip.text(
          `Volume: ${data.volumeTo}`
        )
      }
      return tooltip.style("visibility", "visible")
        .style("opacity", 1);
    })
    .on("mousemove", () => tooltip
      .style("top", (d3.event.pageY-10)+"px")
      .style("left",(d3.event.pageX+10)+"px"))
    .on("mouseout", () => tooltip
      .style("visibility", "hidden")
      .style("opacity", 0));
  }

  const setUpGraph = (
    rootRef: React.RefObject<SVGSVGElement>, 
    tipRef: React.RefObject<HTMLDivElement>, 
    dataSet: ICoinData[], 
    showPer: TimeDividers
  ): void => {
    // reset previous graph
    d3.select(rootRef.current).selectAll("g").remove()
    
    // set up the root point of the graph
    const svg = d3.select(rootRef.current)
      //@ts-ignore
      .attr("viewBox", [0, 0, width, height]);
    
    // set up the div tooltip reference for d3
    const tooltip = d3.select(tooltipRef.current)

    // set x axis and return a scale band function for positioning values.
    const xValues = dataSet.map(item => item.time)
    const x = setXAxis(svg, xValues, showPer)
    
    // set y axis and return a scale linear function for positioning values.
    const yMaxValue = d3.max(dataSet, d => d.high) as number
    const yMinValue = d3.min(dataSet, d => d.low) as number
    const y = setYAxis(svg, yMaxValue, yMinValue)

    // set y axis specific for the volumes graph
    const volumeYTopValue = d3.max(dataSet, d => d.volumeFrom) as number
    const volumeY = setVolumesYAxis(volumeYTopValue)

    // set the points on the graph using the data provided and the positioning functions x and y
    setVolumeGraphValues(svg, dataSet, x, volumeY, tooltip)
    setGraphValues(svg, dataSet, x, y, tooltip)
  }
  //#endregion 

  useEffect(() => {
    if(data && divideXIn) {
      const dataset = data.historical
      if(dataset.length > 0) setUpGraph(graphRef, tooltipRef, dataset, divideXIn)
    }
  }, [data])

  return <div className="cryptoGraphic">
    <svg ref={graphRef}></svg>
    <div className="svg-tooltip" ref={tooltipRef}></div>
  </div>
}