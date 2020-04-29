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
    categories: string[]
}

export interface ICoin {
    crypto: string,
    name: string,
    image: string
}

export interface ICoinExchange {
    from: string,
    to: {coin: string, value: number}[]
}

export enum TimeDividers{
    max = 1,
    month, 
    day,
    hour,
}
