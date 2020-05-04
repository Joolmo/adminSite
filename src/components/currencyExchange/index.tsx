import React, { useState, useEffect } from 'react';
import { OptionsType } from 'react-select';
import AsyncSelect from 'react-select/async';
import { Card } from 'containers'
import { AllCoinsService } from 'services';
import { ICoin } from 'interfaces';
import './index.scss'
import { ExchangeService } from 'services/exchangeService';


export const CurrencyExchange = () => {
    const [ coins, setCoins ] = useState<{coin: ICoin, valueEUR: number | undefined}[]>([])
    const [ options, setOptions ] = useState<{label: string, value: ICoin}[]>([])
    const [ results, setResults ] = useState<{coin: ICoin, value: number}[]>([])
    const [ toCoins, setToCoins ] = useState<ICoin[]>()
    const [ baseCoin, setBaseCoin ] = useState<ICoin>()
    const [ quantity, setQuantity ] = useState(0)

    const updateCoinValues = async () => {
        const unvaluedCoinsIndexes: number[] = []
        const unvaluedCoins = coins.filter(({coin, valueEUR}, index) => {
            const isNotValued = (toCoins?.includes(coin) || baseCoin === coin) && !valueEUR
            if(isNotValued) { unvaluedCoinsIndexes.push(index) } 
            return isNotValued
        })
        
        if(unvaluedCoinsIndexes.length === 0) { return }

        await ExchangeService({
            to: unvaluedCoins.map(unvalued => unvalued.coin.crypto),
            from: "EUR"
        }).then((response) => {
            setCoins(prevVal => {
                const newVal = prevVal
                unvaluedCoinsIndexes.forEach((unvaluedIndex, index) => newVal[unvaluedIndex].valueEUR = response.to[index].value)
                return newVal
            })
        }).catch(error => { /* Handle error */ })
    }

    const updateResults = async () => {
        await updateCoinValues()
        setResults(toCoins ? toCoins.map(toCoin => ({
            coin: toCoin,
            value: ((coins.find(coin => coin.coin.crypto === toCoin?.crypto)?.valueEUR as number)
            / (coins.find(coin => coin.coin.crypto === baseCoin?.crypto)?.valueEUR as number)) * quantity
        })) : [])
    }

    const coinLoadOptions = (input: string, callback: (options: OptionsType<any>) => void) => {
        callback(options.filter(option => option.label.toLocaleLowerCase().includes(input.toLocaleLowerCase())))
    }

    useEffect(() => {
        AllCoinsService({}).then(response => {
            setCoins(response.map(coin => ({
                coin,
                valueEUR: undefined
            })))
            setOptions(response.map(coin => ({
                value: coin,
                label: coin.crypto,
            })))
        })
    }, [])

    useEffect(() => {
      updateResults()
    }, [baseCoin, toCoins, quantity])

    return (
        <section>
            <Card className="currencyExchange">
                <div >
                    <h2>Currency Exchange</h2>
                    <div className="quantityInput">
                        <label>Quantity:</label>
                        <div>
                            <input type="text" pattern="[0-9]*" onChange={(evt) => setQuantity(Number(evt.target.value))}/>
                            <AsyncSelect
                                className="quantitySelector"
                                cacheOptions
                                placeholder="Coin"
                                loadOptions={coinLoadOptions}
                                onChange={({value}: any) => setBaseCoin(value)}
                            />
                        </div>
                    </div>
                    <div className="currencyInput">
                        <label>To:</label>
                        <AsyncSelect 
                            isMulti
                            cacheOptions
                            placeholder="Coin"
                            loadOptions={coinLoadOptions}
                            onChange={(selections) => {
                                setToCoins((selections as any[])?.map(item => item.value))
                            }}
                        />
                    </div>
                </div>
              <div>
                    { results.map(({coin, value}) => <div key={coin.crypto}>
                        <span>{coin.crypto}/{coin.name}</span>
                        <span>{value.toFixed(2)}</span>
                    </div>) }
              </div>
            </Card>
        </section>
    )
}
