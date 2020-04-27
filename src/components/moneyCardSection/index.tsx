import React, { useRef, useState, useEffect } from 'react'
import {Palette} from 'react-palette';
import { HistoricalCoinService, AllCoinsService } from 'services';
import { ICoin } from 'interfaces';
import { MoneyCard } from 'components'
import layoutIcon from 'assets/images/layoutIcon.svg'
import './index.scss'

const startingListPoint = 50
const endingListPoint = 56
const requiredListCoins = ["XRP", "XEM", "ETH", "BTC"]


export const MoneyCardSection = () => {
  const scrollableRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [cardsConfig, setCardsConfig] = useState<ICoin[]>([])

  useEffect(() => {
    AllCoinsService({start: startingListPoint, limit: endingListPoint, musts: requiredListCoins})
      .then(response => setCardsConfig(response))
  }, [])

  enum directions {
    left,
    right
  }

  const moveHeadband = (direction: directions) => {
    const scrollable = scrollableRef.current
    const section = sectionRef.current

    if(!scrollable || !section) { return }

    const widthCard = scrollable.scrollWidth / cardsConfig.length 

    if(direction === directions.left) {
      if( 0 < scrollable.scrollLeft) { 
        scrollable.scroll(scrollable.scrollLeft - widthCard, 0)
      }
    } else {
      if( 0 < scrollable.scrollWidth - (scrollable.scrollLeft + section.offsetWidth)) { 
        scrollable.scroll(scrollable.scrollLeft + widthCard, 0)
      }
    }
  }

  return <section className="moneyCardSection" ref={sectionRef}>
    <div>
      <div>
        <span>Welcome</span>
        <span className="selected">Dashboard</span>
      </div>
      <div>
        <button className="layoutButton"><img src={layoutIcon} alt="layoutIcon" /></button>
        <button
          onClick={() => { moveHeadband(directions.left) }}
        ><i className= "fa fa-angle-left fa-lg"></i></button>
        <button
          onClick={() => { moveHeadband(directions.right) }}
        ><i className= "fa fa-angle-right fa-lg"></i></button>
      </div>
    </div>
    <div className="headband" ref={scrollableRef}>
      {
        cardsConfig.map(({crypto, name, image}: ICoin) =>
          <Palette src={`https://cors-anywhere.herokuapp.com/${image}`} key={crypto}>
            { ({data, loading, error}) => 
                <MoneyCard
                  request={() => HistoricalCoinService({ crypto: crypto, currency: "EUR" })}
                  name={name}
                  contraction={crypto}
                  color={ !!data.vibrant ? data.vibrant : "#000000" }
                  image={image}
                  key={crypto} 
                />
            }
          </Palette>
      )}
    </div>
  </section>
}