// src/App.js
import React from 'react';
import './App.css';
import CardGame from './components/CardGame';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>LLM Card Game</h1>
      </header>
      <main>
        <CardGame />
        {/* You can later add UI elements for export/import and LLM queries */}
      </main>
    </div>
  );
}

export default App;
