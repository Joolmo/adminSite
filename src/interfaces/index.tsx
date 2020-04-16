export interface IHistoricalCoinData {
    crypto: string
    currency: string
    historical: ICoinData[],
}

export interface ICoinData {
    time: number
    high: number
    low: number
    open: number
    volumeFrom: number
    volumeTo: number
    close: number
}

export interface INews {
    title: string,
    body: string,
    url: string,
    date: Date,
    tags: string[]
}

export enum TimeDividers{
    max = 1,
    month, 
    day,
    hour,
}
