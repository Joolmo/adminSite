import React from 'react';
import {
  Header,
  Footer,
  MoneyCard,
  Toolbar
} from 'components'
import './app.scss';
import { IHistoricalCoinData } from 'interfaces';
import bitcoin from 'assets/images/bitcoin.svg'
import { HistoricalCoinService } from 'services/historicalCoinService';

export const App = () => {
  return (
    <div id="app">
      <Header />
      <Toolbar />

      <main>
      <MoneyCard 
          resolver={(data: IHistoricalCoinData) => {
            const openPrice = data.historical[0].open
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
          request={() => HistoricalCoinService({})}
          name="Bitcoin" contraction="BTC" color="#FFC246" image={bitcoin}
        />   
      </main>

    </div>
  );
}