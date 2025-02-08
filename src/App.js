// src/App.js
import React from 'react';
import './App.css';
import CardGame from './components/CardGame';

function App() {
  return (
    <div className="App">
      <main>
        <CardGame />
        {/* You can later add UI elements for export/import and LLM queries */}
      </main>
    </div>
  );
}

export default App;
