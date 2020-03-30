import React from 'react';
import {
  Header
} from 'components'
import './App.scss';

function App() {
  return (
    <div id="app">
      <Header/>
      
      <main style={{backgroundColor: "white"}} /* inline style only for testing */>
        <article></article>
      </main>

      <footer style={{backgroundColor: "black"}} /* inline style only for testing */>
      </footer>
    </div>
  );
}

export default App;
