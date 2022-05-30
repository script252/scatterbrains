import React, { useState } from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import MemoryGame from './components/MemoryGame/MemoryGame';

function App() {

  return (
    <ChakraProvider>
      <div className="App">
        <header className="App-header">
          <MemoryGame></MemoryGame>
        </header>
      </div>
    </ChakraProvider>
  );
}

export default App;
