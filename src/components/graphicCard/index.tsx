import React, { useEffect, useState } from 'react'
import { Card } from 'containers'
import { CryptoGraphic } from 'components'
import { HistoricalCoinService } from 'services/historicalCoinService'
import { IHistoricalCoinData, TimeDividers } from 'interfaces'
import './index.scss'

export const GraphicCard = () => {
    const [data, setData] = useState<IHistoricalCoinData>()
    const [timeDivider, setTimeDivider] = useState(TimeDividers.day)
    const [currency, setCurrency] = useState("JPY")
    const [crypto, setCrypto] = useState("BTC")
    const [coinDDToggled, setcoinDDToggle] = useState(false)

    useEffect(() => {
        HistoricalCoinService({limit:125, getPer: timeDivider, currency:currency, crypto: crypto}).then(result => setData(result))
      }, [timeDivider, crypto, currency])
    
    // Temporal list of coins (must be provided by the api or other less hardcoded way)
    const coins = [
        {
            crypto: "BTC",
            currency: "USD"
        },
        {
            crypto: "BTC",
            currency: "EUR"
        },
        {
            crypto: "BTC",
            currency: "JPY"
        },
        {
            crypto: "ETH",
            currency: "USD"
        },
        {
            crypto: "ETH",
            currency: "EUR"
        },
        {
            crypto: "ETH",
            currency: "JPY"
        },
        {
            crypto: "ETH",
            currency: "BTC"
        },
        {
            crypto: "BTC",
            currency: "ETH"
        },
    ]

    const getPercent = (): number => {
        if(data) {
            const openPrice = data.historical[0].close
            const closePrice = data.historical[data.historical.length - 1].close
            return (closePrice - openPrice) * 100 / openPrice
        }
        else return 0
    }

    return (
        <Card className="cryptoCard">
            <div className="graphHeader">
                <div>
                    <div>
                        <span>{crypto}</span>
                        <span>/{currency}</span>
                        <i className="fa fa-angle-down" onClick={() => setcoinDDToggle(true)}></i>
                    </div>
                    <ul className={coinDDToggled ? "toggled" : "notToggled"}>
                        {coins.map(item => <li onClick={() => {
                            setCrypto(item.crypto)
                            setCurrency(item.currency)
                            setcoinDDToggle(false)
                        }}>
                            <span>{item.crypto}</span>
                            <span>/{item.currency}</span>
                        </li>)}
                    </ul>
                </div>
            </div>
            <div className="infoContainer">
                <div>
                    <span>{data?.historical[data.historical.length - 1].close.toFixed(2)}</span>
                    <span className={`${getPercent() > 0 ? "growing" : "shrinking"}`}>{getPercent().toFixed(2)}%</span>
                </div>
                <div>
                    <div>
                        <span>High:</span>
                        <span>{Math.max(...(data ? data.historical.map(item => item.high) : [0])).toFixed(2)}</span>
                    </div>
                    <div>
                        <span>Low:</span>
                        <span>{Math.min(...(data ? data.historical.map(item => item.low) : [0])).toFixed(2)}</span>
                    </div>
                    <div>
                        <span>24h Volume:</span>
                        <span>{(data ? data.historical.reduce((acum, item) => acum + item.volumeTo, 0) : 0).toFixed(2)}</span>    
                    </div>
                </div>
            </div>
            <div className="buttonContainer">
                { Object.keys(TimeDividers).filter((key: any) => !isNaN(Number(TimeDividers[key])))
                    .map((item:any) => (
                        <button
                            className={`timeButton ${timeDivider == Number(TimeDividers[item]) ? "selected" : ""}`}
                            onClick={() => setTimeDivider(Number(TimeDividers[item]))}
                        >{item}</button>
                    ))
                }
            </div>
            <CryptoGraphic data={data} divideXIn={timeDivider}/>
        </Card>
    )
}