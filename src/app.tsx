import React from 'react';
import {
  Header,
  Toolbar,
  MoneyCardSection,
  GraphicCard
} from 'components'
import './app.scss';
import { NewsSection } from 'components/newsSection';
import { Card } from 'containers';

export const App = () => {
  return (
    <div id="app">
      <Header />
      <Toolbar />

      <main>
        <article>
          <MoneyCardSection/>
          <GraphicCard/>
          <div className="sectionContainer">
            <NewsSection/>
            <NewsSection/>
          </div>
        </article>
      </main>

    </div>
  );
}