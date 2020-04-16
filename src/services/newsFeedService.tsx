import { CryptoDataSrc } from './cryptoDataSrc'
import { INews } from 'interfaces'


export const NewsFeedService = async (): Promise<INews[]> => {
    const parseResponse = (response: any): INews[] => {
        const data: any[] = response.Data
        return data.map(item => ({
            date: new Date(item.published_on * 1000),
            title: item.title,
            body: item.body,
            url: item.guid,
            tags: (item.tags as string).split("|"),
        }))
    }

    const path = "v2/news/?lang=EN"
    const response = await CryptoDataSrc({path}) // no arguments for this call

    if(!response.error) {
        try { return parseResponse(response) }
        catch(error) { 
            // handle error
            throw error // temporal
        }   
    } else {
        // handle error
        throw response.error // temporal
    }
}