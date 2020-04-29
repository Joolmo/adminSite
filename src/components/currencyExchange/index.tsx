import React, { useState, useEffect } from 'react'
import { Card } from 'containers'
import Select from 'react-select'
import AsyncSelect from 'react-select/async';
import './index.scss'
import { AllCoinsService } from 'services';
import { ICoin } from 'interfaces';


const options = [
    { value: 'chocolate', label: 'EUR' },
    { value: 'strawberry', label: 'USD' },
    { value: 'vanilla', label: 'JPY' }
  ]

export const CurrencyExchange = () => {
    const [coins, setCoins] = useState<ICoin[]>([])
    const [options, setOptions] = useState<{label: string, value: string}[]>([])
    const [ results, setResults ] = useState<{coin: ICoin, value: number}[]>([
        {coin: {
            name: "Bitcoin",
            crypto: "BTC",
            image: ""
        }, value: 7080}
    ])

    useEffect(() => {
        AllCoinsService({}).then(response => {
            setCoins(response)
            setOptions(response.map(coin => ({
                value: coin.crypto,
                label: coin.crypto,
            })))
        })
    }, [])

    return (
        <section>
            <Card className="currencyExchange">
                <div >
                    <h2>Currency Exchange</h2>
                    <div className="quantityInput">
                        <label>Quantity:</label>
                        <div>
                            <input type="text" pattern="[0-9]*"/>
                            <Select className="quantitySelector" placeholder="Coin" options={options}/>
                        </div>
                    </div>
                    <div className="currencyInput">
                        <label>To:</label>
                        <Select isSearchable isMulti options={options} />
                    </div>
                </div>
                <div>
                    { results.map(({coin, value}) => <div>
                        <span>{coin.crypto}/{coin.name}</span>
                        <span>{value}</span>
                    </div>) }
                </div>
            </Card>
        </section>
    )
}
