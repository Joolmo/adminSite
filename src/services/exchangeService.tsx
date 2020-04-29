import { CryptoDataSrc } from './cryptoDataSrc'
import { ICoinExchange } from 'interfaces'


interface IProps {
    from: string
    to: string[]
}

export const ExchangeService = async ({to, from}: IProps): Promise<ICoinExchange> => {
    console.log(to)
    
    const parseResponse = (res: any): ICoinExchange => {
        return {
            from: from,
            to: Object.keys(res[from]).map(key => ({
                coin: key,
                value: res[from][key]
            }))
        }
    }

    const path = "pricemulti"
    const params = {
        fsyms: from,
        tsyms: to.join(",")
    }

    const response = await CryptoDataSrc({
        path,
        params
    })

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