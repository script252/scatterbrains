import React from 'react';
import './App.css';
import { Box, ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MemoryGame from './memory/components/MemoryGame/MemoryGame';
import NavBar from './components/NavBar/NavBar';
import SudokuGame from './sudoku/components/SudokuGame/SudokuGame';

function App() {

  return (
    <ChakraProvider>
      <div className="App">

          
          <BrowserRouter>
          <NavBar></NavBar>
          <header className="App-header">
            <Routes>
              <Route path="/" element={<Box></Box>}></Route>
                {/* <Route index element={<MemoryGame />} /> */}
              <Route path="memory" element={<MemoryGame />} />
              <Route path="sudoku" element={<SudokuGame />} />
            </Routes>
            </header>
          </BrowserRouter>
      </div>
    </ChakraProvider>
  );
}

export default App;
