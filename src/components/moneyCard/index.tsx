import React, { useEffect, createContext, useState } from 'react'
import { Card } from 'containers'
import bitcoin from 'assets/images/bitcoin.svg'
import Chart from "chart.js";
import './index.scss'


interface IProps {
    name: string
    contraction: string
    image: string
    color: string    
    request: () => Promise<any>
    resolver: (data: any) => {
        data: number[],
        price: number,
        change: {
            quantity: number,
            isGrowing: boolean
        }
    }
}

export const MoneyCard = ({name, contraction, image, color, request, resolver}: IProps) => {
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
        request()
        .then((data) => resolver(data))
        .then(({data, change, price}) => {
            const canvas = chartRef.current?.getContext("2d")
            
            if(canvas) { setUpChart(canvas, color, data) }
            else { console.error("It is not possible for the app to render the charts.") }

            setChange(change.quantity)
            setGrowing(change.isGrowing)
            setPrice(price)
        })
    },[])

    return (
        <Card className="moneyCard">
            <div>
                <img src={image} alt={name}/>
                { 
                    // @ts-ignore
                    <span className="title" subText={name}>{contraction}</span>
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

/* Example 
    <MoneyCard 
          resolver={(data: IHistoricalCoinData) => {
            const openPrice = data.historical[0].open
            const closePrice = data.historical[data.historical.length-1].close
            const isGrowing = openPrice < closePrice
            const change = ((closePrice - openPrice) / 100)
            
            return {
              data: data.historical.map(item => item.close),
              price: closePrice,
              change: {
                quantity: change,
                isGrowing: isGrowing
              }
            }
          }} 
          request={() => HistoricalCoinService({})}
          name="Bitcoin" contraction="BTC" color="#FFC246" image={bitcoin}
        />   
*/