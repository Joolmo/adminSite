import React from 'react';
import {
  Header,
  Toolbar,
  MoneyCardSection,
  GraphicCard
} from 'components'
import './app.scss';

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