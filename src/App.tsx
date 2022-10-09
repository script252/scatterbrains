import React, { useState } from 'react';
import './App.css';
import { Box, ChakraProvider, Flex } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MemoryGame from './memory/components/MemoryGame/MemoryGame';
import NavBar from './components/NavBar/NavBar';
import SudokuGame from './sudoku/components/SudokuGame/SudokuGame';

function App() {

  const [startNewGameState, setStartNewGameState] = useState(false);
  const onNewGame = () => { 
    setStartNewGameState(true);
  };

  const onCloseNewGameModal = () => {
    setStartNewGameState(false);
  }

  const basename = process.env.PUBLIC_URL;

  return (
    <ChakraProvider>
        <Box className="App" height="100vh">
            <BrowserRouter basename={`${basename}`}>
            {/* <header className="App-header"> */}
            <Flex 
              alignItems='center'
              //width="100vw"
              min-height="100%"
              height="100%"
              flexDirection="column"
              >
              <NavBar onNewGame={onNewGame} showNewGameButton={true}></NavBar>
              <Routes>
                <Route path="" element={<Box />}></Route>
                  {/* <Route index element={<MemoryGame />} /> */}
                <Route path="/memory" element={<MemoryGame />} />
                <Route path="/sudoku" element={<SudokuGame startNewGame={startNewGameState} onCloseNewGameModal={onCloseNewGameModal}/>} />
              </Routes>
            </Flex>
            {/* </header> */}
            </BrowserRouter>
        </Box>
    </ChakraProvider>
  );
}

export default App;