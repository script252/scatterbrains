import React from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MemoryGame from './memory/components/MemoryGame/MemoryGame';
import NavBar from './components/NavBar/NavBar';
import SudokuGame from './sudoku/components/SudokuGame/SudokuGame';

function App() {

  return (
    <ChakraProvider>
      <div className="App">
        <NavBar></NavBar>
        <header className="App-header">
          
          <BrowserRouter>
            <Routes>
              <Route path="/">
                {/* <Route index element={<MemoryGame />} /> */}
                <Route path="/memory" element={<MemoryGame />} />
                <Route path="/sudoku" element={<SudokuGame />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </header>
      </div>
    </ChakraProvider>
  );
}

export default App;
