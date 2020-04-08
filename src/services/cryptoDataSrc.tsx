interface IProps {
    path: string,
    params?: {[key: string] : string}
}

export const CryptoDataSrc = async ({path, params}: IProps): Promise<any> => {
    const baseUrl = "https://min-api.cryptocompare.com/data/"
    const apiKey = "f651aa92435951f66d2163d8176280811ac7f5e0e54b76d6da8cb4169c39f6be"
    
    const formatParams = (params: {[key: string]: string}): string => Object.keys(params)
        .reduce((acum, key) => `${acum}${key}=${params[key]}&`, "?")
        .slice(0, -1)

    try {
        const response = await fetch(`${baseUrl}${path}${params ? formatParams(params) : ""}`, {
            method: "GET",
            headers: { authorization: `Apikey ${apiKey}` }
        })
        if(response.ok) { return response.json() }
        else { 
            const error = "Response code in fetch was not ok"
            console.warn(error)
            return { error: error }
        }
    } 
    catch(error) {
        console.error(error)
        return { error: error }
    }
}