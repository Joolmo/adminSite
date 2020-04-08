export interface IHistoricalCoinData {
    crypto: string
    currency: string
    historical: {
        time: number
        high: number
        low: number
        open: number
        volumeFrom: number
        volumeTo: number
        close: number
    }[],
}