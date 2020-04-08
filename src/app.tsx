import React from 'react';
import {
  Header,
  Toolbar,
  MoneyCardSection
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
        </article>
      </main>

    </div>
  );
}