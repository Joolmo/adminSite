import React, { useEffect, useState } from 'react';
import {
  Header,
  Toolbar,
  MoneyCardSection,
  GraphicCard
} from 'components'
import './app.scss';
import { HistoricalCoinService } from 'services/historicalCoinService';
import { IHistoricalCoinData } from 'interfaces';


export const App = () => {
  return (
    <div id="app">
      <Header />
      <Toolbar />

      <main>
        <article>
          <MoneyCardSection/>
          <section>
            <GraphicCard/>
          </section>
        </article>
      </main>

    </div>
  );
}