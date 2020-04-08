import React from 'react'
import { MoneyCard } from 'components'
import { IHistoricalCoinData } from 'interfaces';
import { HistoricalCoinService } from 'services/historicalCoinService';
import bitcoin from 'assets/images/bitcoin.svg'
import ethereum from 'assets/images/ethereum.svg'
import nem from 'assets/images/nem.svg'
import ripple from 'assets/images/ripple.svg'
import './index.scss'

export const MoneyCardSection = () => {
    const cardsConfig = [
        {
            crypto: "BTC",
            name: "Bitcoin",
            color: "#FFC246",
            image: bitcoin
        },
        {
            crypto: "ETH",
            name: "Ethereum",
            color: "#5470DE",
            image: ethereum
        },
        {
            crypto: "XEM",
            name: "NEM",
            color: "#47DFCF",
            image: nem
        },
        {
            crypto: "XRP",
            name: "Ripple",
            color: "#93D7FD",
            image: ripple
        }
    ]

    const renderMoneyCards = (config: any[]) => {
        const makeCard = ({crypto, name, color, image}: any) => (
          <MoneyCard 
            resolver={(data: IHistoricalCoinData) => {
              const openPrice = data.historical[0].close
              const closePrice = data.historical[data.historical.length-1].close
              const isGrowing = openPrice < closePrice
              const change = ((closePrice - openPrice) / 100)
              
              return {
                data: data.historical.map(item => item.close),
                price: closePrice,
                change: {
                  quantity: change,
                  isGrowing: isGrowing
                }
              }
            }} 
            request={() => HistoricalCoinService({crypto: crypto, currency: "EUR"})}
            name={name} contraction={crypto} color={color} image={image}
          />   
        )
        
        config = config.reduce((acum, item, index) => {
          if(!(index % 2)) { acum.push([item, config[index+1]]) }
          return acum
        }, [])
    
        return config.map((arrOfConfig) => (
            <div>
              {makeCard(arrOfConfig[0])}
              {makeCard(arrOfConfig[1])}
            </div>
          )
        )
      }

    return (
        <section className="moneyCardSection"> 
            {renderMoneyCards(cardsConfig)}
        </section>
    )
}