import React, { useEffect, useState } from 'react'
import { Card } from 'containers'
import { CryptoGraphic } from 'components'
import { HistoricalCoinService } from 'services/historicalCoinService'
import { IHistoricalCoinData } from 'interfaces'
import './index.scss'

export const GraphicCard = () => {
    const [data, setData] = useState<IHistoricalCoinData>()

    useEffect(() => {
        HistoricalCoinService({limit:118, getPer: "hour"}).then(result => setData(result))
      }, [])
      
    return (
        <Card className="cryptoCard">
            <CryptoGraphic data={data ? data : {
                currency: "EUR",
                crypto: "BTC",
                historical: []
            }}/>
        </Card>
    )
}