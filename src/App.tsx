import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MemoryGame from './components/MemoryGame/MemoryGame';
import NavBar from './components/NavBar/NavBar';

function App() {

  return (
    <ChakraProvider>
      <div className="App">
        <NavBar></NavBar>
        <header className="App-header">
          <MemoryGame></MemoryGame>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<MemoryGame />}>
                <Route index element={<MemoryGame />} />
                <Route path="memory" element={<MemoryGame />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </header>
      </div>
    </ChakraProvider>
  );
}

export default App;
