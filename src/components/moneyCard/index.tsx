import React, { useEffect, useState, useRef } from 'react'
import { Card } from 'containers'
import Chart from "chart.js";
import './index.scss'
import { IHistoricalCoinData } from 'interfaces';


interface IProps {
    name: string
    contraction: string
    image: string
    color: string
    request: () => Promise<IHistoricalCoinData>
}

export const MoneyCard = ({ name, contraction, image, color, request }: IProps) => {
    const chartRef: any = useRef(null)
    const [price, setPrice] = useState(0)
    const [isGrowing, setGrowing] = useState(false)
    const [change, setChange] = useState(0)

    const setUpChart = (canvas: CanvasRenderingContext2D, chartColor: string, data: number[]) => {
        const backgroundColor = canvas.createLinearGradient(160, 0, 160, 80)
        backgroundColor.addColorStop(0, `${chartColor}FF`);
        backgroundColor.addColorStop(0.25, `${chartColor}88`);
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
                elements: { point: { radius: 0 } },
                tooltips: {
                    enabled: false
               },
            }
        })
    }

    useEffect(() => {
        request()
            .then((data) => {
                const openPrice = data.historical[0].close
                const closePrice = data.historical[data.historical.length - 1].close

                return {
                    data: data.historical.map((item: any) => item.close),
                    price: data.historical[data.historical.length - 1].close,
                    change: {
                        quantity: (closePrice - openPrice) * 100 / openPrice,
                        isGrowing: openPrice < closePrice
                    }
                }
            })
            .then(({ data, change, price }) => {
                const canvas = chartRef.current?.getContext("2d")

                setChange(change.quantity)
                setGrowing(change.isGrowing)
                setPrice(price)

                if (canvas) { setUpChart(canvas, color, data) }
                else { console.error("It is not possible for the app to render the charts.") }
            })
    }, [color, request])

    return (
        <Card className="moneyCard">
            <div className="moneyContent">
                <div>
                    <img src={image} alt={name} width="22" height="22" />
                    <div>
                        <span>{contraction}</span>
                        <span className="title">{name}</span>
                    </div>
                </div>
                <div>
                    <span>{price}€</span>
                    <span className={`price ${isGrowing ? "growing" : "reducing"}`}>{`${change.toFixed(2)}%`}</span>
                </div>
            </div>
            <canvas ref={chartRef} id="chart" height="80" />
        </Card>
    )
}