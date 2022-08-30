import React, { useState } from 'react';
import './App.css';
import { Box, ChakraProvider, Flex } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MemoryGame from './memory/components/MemoryGame/MemoryGame';
import NavBar from './components/NavBar/NavBar';
import SudokuGame from './sudoku/components/SudokuGame/SudokuGame';

import { CookiesProvider } from "react-cookie";

function App() {

  const [startNewGameState, setStartNewGameState] = useState(false);
  const onNewGame = () => { 
    setStartNewGameState(true);
  };

  const onCloseNewGameModal = () => {
    setStartNewGameState(false);
  }

  return (
    <ChakraProvider>
      <CookiesProvider>
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
              <NavBar onNewGame={onNewGame}></NavBar>
              <Routes>
                <Route path="/" element={<Box></Box>}></Route>
                  {/* <Route index element={<MemoryGame />} /> */}
                <Route path="memory/memory" element={<MemoryGame />} />
                <Route path="memory/sudoku" element={<SudokuGame startNewGame={startNewGameState} onCloseNewGameModal={onCloseNewGameModal}/>} />
              </Routes>
            </Flex>
            {/* </header> */}
            </BrowserRouter>
        </Box>
      </CookiesProvider>
    </ChakraProvider>
  );
}

export default App;