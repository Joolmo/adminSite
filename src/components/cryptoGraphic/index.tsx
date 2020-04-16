import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { IHistoricalCoinData, ICoinData, TimeDividers } from 'interfaces';
import './index.scss'
  

interface IProps {
  data?: IHistoricalCoinData
  timeDivider?: TimeDividers,
}

export const CryptoGraphic = ({data, timeDivider}: IProps) => {
  const graphContentRef = useRef<SVGSVGElement>(null)
  const graphDisplayRef = useRef<SVGSVGElement>(null)
  const graphTooltipRef = useRef<HTMLDivElement>(null)

  //#region d3 stuff
  //#region constants
  const contentProps = {
    padding: 0.37,
    width: 0, // non constant
    generateWidth: (items: number) => items * (871/125)
  }
  const displayProps = {
    width: 805,
    height: 385,
    margin: {
      top: 10,
      right: 50,
      bottom: 30,
      left: 0
    }
  }
  const candleProps = {
    thinLineWidth: 2, // stroke = bandWidth / thinLineWidth
    colorGrowing: "#39D3EC",
    colorShrinking: "#9D7FFE",
    selectColor: (d: ICoinData) => d.open > d.close ? candleProps.colorShrinking
      : d.close > d.open ? candleProps.colorGrowing
      : d3.schemeSet1[8]
  }
  const yAxisProps = {
    ticks: 6,
    lineColor: "#EEF1F6",
    lineOpacity: 0.65,
    lineWidth: 0.7
  }
  const fontProps = {
    color: "#1F263E",
    opacity: 0.4,
  }
  const barChartProps = {
    height: 7.3, // the less, the more
    color: "#EFF2FC"
  }
  //#endregion

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
        tickValues = xValues.filter(item => {
          const date = new Date(item * 1000)
          return date.getDate() === 0
        }).map(item => item.toString())

        tickFormat = item => {
          const date = new Date(Number(item)* 1000)
          return `${date.toLocaleString('default', { month: 'long' })}`
        }       
        break
    
      case TimeDividers.day:
        tickValues = xValues.filter(item => {
          const date = new Date(item * 1000)
          return date.getHours() === 0
        }).map(item => item.toString())  
        
        tickFormat = item => {
          const date = new Date(Number(item)* 1000)
          return `${date.getDate().toString()}. ${date.toLocaleString('default', { month: 'long' })}`
        }
        break

      case TimeDividers.hour: 
        tickValues = xValues.filter(item => {
          const date = new Date(item * 1000)
          return date.getMinutes() === 0
        }).map(item => item.toString())  

        tickFormat = item => {
          const date = new Date(Number(item)* 1000)
          return `${date.getHours().toString()}:00`
        }
        break
      
      case TimeDividers.max: 
        tickValues = xValues.filter(item => {
          const date = new Date(item * 1000)
          return date.getMonth() === 0 && date.getDate() === 1
        }).map(item => item.toString())

        tickFormat = item => {
          const date = new Date(Number(item)* 1000)
          return `${date.getFullYear().toString()}`
        }
        break
    }
    
    const x = d3.scaleBand()
      .domain(domain)
      .range([0, contentProps.width])
      .padding(contentProps.padding)
    
    const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
      .attr("transform", `translate(0,${displayProps.height - displayProps.margin.bottom})`)
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
      .rangeRound([displayProps.height - displayProps.margin.bottom, displayProps.margin.top])
      .ticks(yAxisProps.ticks)
    const ticksDiff = ticks[1] - ticks[0]
    const domain = [ticks[0] - ticksDiff, ticks[ticks.length - 1] + ticksDiff]

    const y = d3.scaleLinear()
      .domain(domain)
      .rangeRound([displayProps.height - displayProps.margin.bottom, displayProps.margin.top])

    const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
      .attr("transform", `translate(${displayProps.width - displayProps.margin.right},0)`)
      .call(d3.axisRight(y)
        .tickValues(y.ticks(yAxisProps.ticks))
        .tickFormat(tickValue => `${tickValue}`))
      .call(g => g.selectAll(".tick text")
        .attr("transform", "translate(0,-6)"))
      .call(g => g.selectAll(".tick line")
        .attr("stroke-opacity", yAxisProps.lineOpacity)
        .attr("stroke-width", yAxisProps.lineWidth)
        .attr("stroke", yAxisProps.lineColor)
        .attr("x2", -displayProps.width + displayProps.margin.left + displayProps.margin.right)) 
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
  ): d3.ScaleLinear<number, number> => {
    return d3.scaleLinear()
      .domain([0, higherY])
      .rangeRound([displayProps.height - displayProps.margin.bottom, (displayProps.height/10) * barChartProps.height ])
  }

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
      .attr("height", d => displayProps.height - y(d.volumeFrom) - displayProps.margin.bottom)
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
    yAxisRef: React.RefObject<SVGSVGElement>, 
    tipRef: React.RefObject<HTMLDivElement>,
    dataSet: ICoinData[], 
    showPer: TimeDividers,
    items: number
  ): void => {
    // reset previous graph
    d3.select(rootRef.current).selectAll("g").remove()
    d3.select(yAxisRef.current).selectAll("g").remove()
    
    // set up the root point of the content and the width of it
    contentProps.width = contentProps.generateWidth(items)
    const contentSvg = d3.select(rootRef.current)
      .attr("height", displayProps.height)
      .attr("width", contentProps.width) as d3.Selection<SVGSVGElement, unknown, null, undefined>
    
    // set up the root point of the static elements of the graph svg
    const displaySvg = d3.select(yAxisRef.current)
      //@ts-ignore  
      .attr("viewBox", [0, 0, displayProps.width, displayProps.height])
      .attr("preserveAspectRatio", "none")
      .attr("height", displayProps.height)
      .attr("width", "100%")

    // set up the div tooltip reference for d3
    const tooltip = d3.select(tipRef.current)

    // set x axis and return a scale band function for positioning values.
    const xValues = dataSet.map(item => item.time)
    const x = setXAxis(contentSvg, xValues, showPer)
    
    // set y axis and return a scale linear function for positioning values.
    const yMaxValue = d3.max(dataSet, d => d.high) as number
    const yMinValue = d3.min(dataSet, d => d.low) as number
    const y = setYAxis(displaySvg, yMaxValue, yMinValue)

    // set y axis specific for the volumes graph
    const volumeYTopValue = d3.max(dataSet, d => d.volumeFrom) as number
    const volumeY = setVolumesYAxis(volumeYTopValue)

    // set the points on the graph svgs using the data provided and the positioning functions x and y, also the tooltips.
    setVolumeGraphValues(contentSvg, dataSet, x, volumeY, tooltip)
    setGraphValues(contentSvg, dataSet, x, y, tooltip)
  }
  //#endregion 

  useEffect(() => {
    if(data && timeDivider) {
      const dataset = data.historical
      const numberOfItems = dataset.length
      if(numberOfItems > 0) {
        setUpGraph (
          graphContentRef, 
          graphDisplayRef, 
          graphTooltipRef, 
          dataset, 
          timeDivider, 
          numberOfItems,
        )
      }
    }
  }, [data])

  return <div className="cryptoGraphic">
    <div className="display">
      <svg ref={graphDisplayRef}></svg>
    </div>
    <div className="content">
      <svg ref={graphContentRef}></svg>
    </div>
    <div className="tooltip" ref={graphTooltipRef}></div>
  </div>
}