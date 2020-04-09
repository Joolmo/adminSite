import React, { useEffect, useState, createRef } from 'react'
import * as d3 from 'd3'
import { IHistoricalCoinData, ICoinData } from 'interfaces';
  

interface IProps {
  data: IHistoricalCoinData
}

export const CryptoGraphic = ({data}: IProps) => {
  const graphRef = createRef<SVGSVGElement>()

  const height = 400
  const width = 721
  const margin = {
    top: 20,
    right: 30,
    bottom: 30,
    left: 40
  }

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
        tickValues = xValues.filter(item => new Date(item * 1000).getHours() === 0).map(item => item.toString())
        tickFormat = item => new Date(Number(item)* 1000).getDate().toString()
        break
    
      case "day":
        tickValues = xValues.filter(item => new Date(item * 1000).getHours() === 0).map(item => item.toString())
        tickFormat = item => new Date(Number(item)* 1000).getDate().toString()
        break

      case "hour": 
        tickValues = xValues.filter(item => new Date(item * 1000).getMinutes() === 0).map(item => item.toString())
        tickFormat = item => new Date(Number(item)* 1000).getHours().toString()
        break
    }
    
    const x = d3.scaleBand()
      .domain(domain)
      .range([margin.left, width - margin.right])
      .padding(0.2)
    
    const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(tickValues).tickFormat(tickFormat))
      .call(g => g.select(".domain").remove())

    root.append("g")
      .call(xAxis)

    return x
  }

  const setYAxis = (
    root: d3.Selection<SVGSVGElement, unknown, null, undefined>, 
    yHigherAndLower: number[]
  ): d3.ScaleLogarithmic<number, number> => {
    const y = d3.scaleLog()
      .domain(yHigherAndLower)
      .rangeRound([height - margin.bottom, margin.top])

    const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y)
        .tickFormat(d3.format("$~f"))
        .tickValues(d3.scaleLinear().domain(y.domain()).ticks()))
      .call(g => g.selectAll(".tick line").clone()
        .attr("stroke-opacity", 0.2)
        .attr("x2", width - margin.left - margin.right))
      .call(g => g.select(".domain").remove())

    root.append("g")
      .call(yAxis);

    return y
  }

  const setGraphValues = (
    root: d3.Selection<SVGSVGElement, unknown, null, undefined>, 
    graphValues: ICoinData[], 
    x: d3.ScaleBand<string>,
    y: d3.ScaleLogarithmic<number, number>
  ) => {
    const g = root.append("g")
      .attr("stroke-linecap", "round")
      .attr("stroke", "black")
      .selectAll("g")
      .data(graphValues)
      .join("g")
      .attr("transform", d => `translate(${x(d.time.toString())},0)`);

    g.append("line")
      .attr("y1", d => y(d.low))
      .attr("y2", d => y(d.high));

    g.append("line")
      .attr("y1", d => y(d.open))
      .attr("y2", d => y(d.close))
      .attr("stroke-width", x.bandwidth())
      .attr("stroke", d => d.open > d.close ? d3.schemeSet1[0]
        : d.close > d.open ? d3.schemeSet1[2]
        : d3.schemeSet1[8]);
  }

  const setUpGraph = (dataSet: ICoinData[]) => {
    const canvas = d3.select(graphRef.current)
      //@ts-ignore
      .attr("viewBox", [0, 0, width, height]);

    const x = setXAxis(canvas, dataSet.map(item => item.time), "day")
    const y = setYAxis(canvas, [d3.min(dataSet, d => d.low) as number, d3.max(dataSet, d => d.high) as number])
    setGraphValues(canvas, dataSet, x, y)
  }

  useEffect(() => {
    const dataset = data.historical
     if(dataset.length > 0) setUpGraph(dataset)
  }, [data])

  return (<svg ref={graphRef}></svg>)
}
