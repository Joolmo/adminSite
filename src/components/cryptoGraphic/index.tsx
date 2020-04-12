import React, { useEffect, useState, createRef, useRef } from 'react'
import * as d3 from 'd3'
import { IHistoricalCoinData, ICoinData } from 'interfaces';
  

interface IProps {
  data: IHistoricalCoinData
  divideXIn: "day" | "hour" | "month"
}

export const CryptoGraphic = ({data, divideXIn}: IProps) => {
  const graphRef = useRef<SVGSVGElement>(null)

  //#region d3 stuff
  // graph constants
  const height = 470
  const width = 871
  const margin = {
    top: 20,
    right: 50,
    bottom: 30,
    left: 30
  }
  const colorGrowing = "#39D3EC"
  const colorShrinking = "#9D7FFE"
  const colorFont = "#1F263E"
  const opacityFont = 0.4
  const yTicks = 6
  const xPadding = 0.37
  const selectColor = (d: ICoinData) => d.open > d.close ? colorShrinking
    : d.close > d.open ? colorGrowing
    : d3.schemeSet1[8];

  const setXAxis = (
    root: d3.Selection<SVGSVGElement, unknown, null, undefined>, 
    xValues: number[], 
    showPer: "day" | "hour" | "month"
  ): d3.ScaleBand<string> => {
    const domain = xValues.map(item => item.toString())
    let tickFormat: (tickValue: string) => string
    let tickValues: string[]

    switch(showPer) {
      case "month": 
        tickValues = xValues.filter(item => new Date(item * 1000).getDate() === 1).map(item => item.toString())
        tickFormat = item => {
          const date = new Date(Number(item)* 1000)
          return `${date.toLocaleString('default', { month: 'long' })}`
        }       
        break
    
      case "day":
        tickValues = xValues.filter(item => new Date(item * 1000).getHours() === 0).map(item => item.toString())
        tickFormat = item => {
          const date = new Date(Number(item)* 1000)
          return `${date.getDate().toString()}. ${date.toLocaleString('default', { month: 'long' })}`
        }
        break

      case "hour": 
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
        .attr("fill", colorFont)
        .attr("opacity", opacityFont))
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
  ):  d3.ScaleLinear<number, number> => {
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
      .call(g => g.selectAll(".tick line").clone()
        .attr("stroke-opacity", 0.65)
        .attr("stroke-width", "0.7px")
        .attr("stroke", "#EEF1F6")
        .attr("x2", - width + margin.left + margin.right))
      .call(g => g.selectAll(".tick text")
        .attr("fill", colorFont)
        .attr("opacity", opacityFont))
      .call(g => g.selectAll(".tick").select("line").remove())
      .call(g => g.select(".domain").remove())

    root.append("g")
      .call(yAxis);

    return y
  }

  const setGraphValues = (
    root: d3.Selection<SVGSVGElement, unknown, null, undefined>, 
    graphValues: ICoinData[], 
    x: d3.ScaleBand<string>,
    y: d3.ScaleLinear<number, number>
  ): void => {
    // base tag for thin and thick line positioned correctly in the x
    const g = root.append("g")
      .attr("stroke-linecap", "round")
      .attr("stroke", "black")
      .selectAll("g")
      .data(graphValues)
      .join("g")
      .attr("transform", d => `translate(${x(d.time.toString())},0)`);

    // thin line with hiher and lower values
    g.append("line")
      .attr("y1", d => y(d.low))
      .attr("y2", d => y(d.high))
      .attr("stroke", selectColor)

    // thick line with open and close values
    g.append("line")
      .attr("y1", d => y(d.open))
      .attr("y2", d => y(d.close))
      .attr("stroke-width", x.bandwidth())
      .attr("stroke", selectColor)
  }

  const setUpGraph = (ref: React.RefObject<SVGSVGElement>, dataSet: ICoinData[], showPer: "day" | "hour" | "month") => {
    // set up the root point of the graph
    const svg = d3.select(ref.current)
      //@ts-ignore
      .attr("viewBox", [0, 0, width, height]);

    // set x axis and return a scale band function for positioning values.
    const x = setXAxis(svg, dataSet.map(item => item.time), showPer)
    
    // set y axis and return a scalable logarithmic function for positioning values.
    const y = setYAxis(svg, d3.max(dataSet, d => d.high) as number, d3.min(dataSet, d => d.low) as number)

    // set the points on the graph using the data provided and the positioning functions x and y
    setGraphValues(svg, dataSet, x, y)
  }
  //#endregion 

  useEffect(() => {
    const dataset = data.historical
    console.log(dataset.map(item => `volFrom: ${item.volumeFrom} | volTo: ${item.volumeTo}`))
    if(dataset.length > 0) setUpGraph(graphRef, dataset, divideXIn)
  }, [data])

  return <svg ref={graphRef}></svg>
}
