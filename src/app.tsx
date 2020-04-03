import React from 'react';
import {
  Header,
  Toolbar
} from 'components'
import './app.scss';

export const App = () => {
  return (
    <div id="app">
      <Header/>
      <Toolbar/>
      
      <main>
          {/* Router navigator*/} 
      </main>

    </div>
  );
}