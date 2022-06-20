import React from 'react';
import './App.css';
import { Box, ChakraProvider, Flex } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MemoryGame from './memory/components/MemoryGame/MemoryGame';
import NavBar from './components/NavBar/NavBar';
import SudokuGame from './sudoku/components/SudokuGame/SudokuGame';

function App() {

  return (
    <ChakraProvider>
      <Box className="App" height="100vh">

          
          <BrowserRouter>
          {/* <header className="App-header"> */}
          <Flex 
            alignItems='center'
            //width="100vw"
            min-height="100%"
            height="100%"
            flexDirection="column"
            >
            <NavBar></NavBar>
            <Routes>
              <Route path="/" element={<Box></Box>}></Route>
                {/* <Route index element={<MemoryGame />} /> */}
              <Route path="memory/memory" element={<MemoryGame />} />
              <Route path="memory/sudoku" element={<SudokuGame />} />
            </Routes>
          </Flex>
          {/* </header> */}
          </BrowserRouter>
      </Box>
    </ChakraProvider>
  );
}

export default App;
