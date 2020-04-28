import React from 'react';
import {
  Header,
  Toolbar,
} from 'components'
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from 'routes';
import './app.scss';


export const App = () => {
  return (
    <div id="app">
      <Router>
        <Header />
        <Toolbar />
        <main>
          <Routes />
        </main>
      </Router>
    </div>
  );
}