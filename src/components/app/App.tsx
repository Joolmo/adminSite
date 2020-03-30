import React from 'react';
import {
  Header,
  Footer
} from 'components'
import './App.scss';

function App() {
  return (
    <div id="app">
      <Header/>
      
      <main style={{backgroundColor: "white"}} /* inline style only for testing */>
        <article>
          {/* Router navigator*/}  
        </article> 
      </main>

      <Footer/>
    </div>
  );
}

export default App;
