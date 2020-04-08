import { CryptoDataSrc } from './cryptoDataSrc'
import { IHistoricalCoinData } from 'interfaces'

interface IProps {
    getPer?: "minute" | "hour" | "day",
    limit?: number,
    crypto?: string,
    currency?: string
}

export const HistoricalCoinService = async ({getPer = "hour", limit = 24, crypto = "BTC", currency = "USD"}: IProps): Promise<IHistoricalCoinData> => {
    const parseResponse = (response: any): IHistoricalCoinData => ({
            crypto: crypto,
            currency: currency,
            historical: response.Data.Data.map((item:any) => ({
                time: item.time,
                high: item.high,
                low: item.low,
                open: item.open,
                volumeFrom: item.volumefrom,
                volumeTo: item.volumeto,
                close: item.close,
            }))
        })
    
    const endPoints = {
        minute: "histominute",
        hour: "histohour",
        day: "histoday"
    }

    const response = await CryptoDataSrc({
        path: `v2/${endPoints[getPer]}`,
        params: {
            fsym: crypto,
            tsym: currency, 
            limit: limit.toString() 
        }
    })

    if(!response.error) {  return parseResponse(response) }
    else {
        // handle error
        throw response.error // temporal
    }
}