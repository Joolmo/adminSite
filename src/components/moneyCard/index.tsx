import React, { useEffect, createContext, useState } from 'react'
import { Card } from 'containers'
import bitcoin from 'assets/images/bitcoin.svg'
import Chart from "chart.js";
import './index.scss'


export const MoneyCard = () => {
    const chartRef = React.createRef<HTMLCanvasElement>()
    const [price, setPrice] = useState(0)
    const [isGrowing, setGrowing] = useState(false)
    const [change, setChange] = useState(0)

    const setUpChart = (canvas: CanvasRenderingContext2D, chartColor: string, data: number[]) => {               
        const backgroundColor = canvas.createLinearGradient(160, 0, 160, 80)
        backgroundColor.addColorStop(0, `${chartColor}FF`);
        backgroundColor.addColorStop(0.25, `${chartColor}88`);
        backgroundColor.addColorStop(0.5, `${chartColor}44`);
        backgroundColor.addColorStop(0.75, `${chartColor}22`);
        backgroundColor.addColorStop(1, `${chartColor}00`);

        new Chart(canvas, {
            type: "line",
            data: {
                labels: data,
                datasets: [
                    {
                        data: data,
                        backgroundColor: backgroundColor,
                        borderColor: chartColor
                    }   
                ]
            },
            options: {
                legend: { display: false },
                scales: {
                    xAxes: [{ display: false }],
                    yAxes: [{ display: false }]
                },
                elements: { point: { radius: 0 } }
            }
        })
    }
    
    useEffect(() => {
        const canvas = chartRef.current?.getContext("2d")
        
        if(canvas) { setUpChart(canvas, "#FFC246", [10,2,3,4]) }
        else { console.error("It is not possible for the app to render the charts.") }

        setChange(2.33)
        setGrowing(true)
        setPrice(100)
    },[])

    return (
        <Card className="moneyCard">
            <div>
                <img src={bitcoin} alt="bitcoin"/>
                { 
                    // @ts-ignore
                    <span className="title" subText="bitcoin">BTC</span>
                }
                { 
                    // @ts-ignore
                    <span className={`price ${isGrowing ? "growing" : "reducing"}`} subText={`${change.toFixed(2)}%`}>{price}$</span>
                }
            </div>
            <canvas ref={chartRef} id="chart" width="270" height="80" />
        </Card>
    )
}