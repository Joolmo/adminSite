import { CryptoDataSrc } from './cryptoDataSrc'
import { IHistoricalCoinData, TimeDividers } from 'interfaces'

interface IProps {
    getPer?: TimeDividers,
    limit?: number,
    crypto?: string,
    currency?: string
}

export const HistoricalCoinService = async ({getPer = TimeDividers.day, limit = 24, crypto = "BTC", currency = "USD"}: IProps): Promise<IHistoricalCoinData> => {
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
        [TimeDividers.hour]: "histominute",
        [TimeDividers.day]: "histohour",
        [TimeDividers.month]: "histoday",
        [TimeDividers.max]: "histoday",
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