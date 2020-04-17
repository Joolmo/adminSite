import React from 'react';
import {
  Header,
  Toolbar,
  MoneyCardSection,
  GraphicCard,
  LastestActivities
} from 'components'
import './app.scss';
import { NewsSection } from 'components/newsSection';


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
            <LastestActivities/>
            <NewsSection/>
          </div>
        </article>
      </main>

    </div>
  );
}