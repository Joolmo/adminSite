import { CryptoDataSrc } from './cryptoDataSrc'
import { ICoin } from 'interfaces'


interface IProps {
    start?: number
    limit?: number
    musts?: string[]
}

export const AllCoinsService = async ({start = 0, limit, musts}:  IProps): Promise<ICoin[]> => {
    const parseResponse = (response: any): ICoin[] => {
        const baseImgUrl = response.BaseImageUrl
        let data = Object.keys(response.Data)

        const mustsItems = !!musts ? data.filter(key => musts.find(item => key === item)) : []
        data = !!musts ? data.filter(key => !musts?.find(item => key === item)) : data

        const limitItems = !!limit ? data.slice(start, limit) : data
        const coins = mustsItems.concat(limitItems)

        return coins.map(key => {
            const item = response.Data[key]

            return {
                image: `${baseImgUrl}${item.ImageUrl}`,
                name: item.CoinName,
                crypto: item.Name,
            }
        })
    }

    const path = "all/coinlist"
    const response = await CryptoDataSrc({path})

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