import React from 'react';
import './App.css';
import { Box, ChakraProvider, Flex, Icon, MenuItem, Spacer } from '@chakra-ui/react'
import * as themes from '@chakra-ui/theme';
import { Routes, Route, Link, useNavigate } from "react-router-dom";

import NavBar from './components/NavBar/NavBar';

import Home from './views/home/Home';
import { MdReplayCircleFilled } from 'react-icons/md';

// Games
import MemoryGame from './views/memory/components/MemoryGame/MemoryGame';
import SudokuGame from './views/sudoku/components/SudokuGame/SudokuGame';
import WordScrambleGame from './views/wordScramble/components/WordScrambleGame/WordScrambleGame';

function App() {

  const n = useNavigate();

  return (
    <ChakraProvider theme={themes.default}>
        <Box className="App" height="100vh">
            
            {/* <header className="App-header"> */}
            <Flex 
              alignItems='center'
              //width="100vw"
              min-height="100%"
              height="100%"
              flexDirection="column"
              >
              <NavBar showNewGameButton={false}>
                <Link to=""><MenuItem>Home</MenuItem></Link>
                <Link to="memory"><MenuItem>Memory</MenuItem></Link>
                <Flex>
                  <Link to="sudoku"><MenuItem>Sudoku</MenuItem></Link>
                  <Spacer />
                  <Link to="sudoku/new">
                    <MenuItem icon={<Icon as={MdReplayCircleFilled}></Icon>}>New</MenuItem>
                  </Link>
                </Flex>
                <Flex>
                  <Link to="word-scramble"><MenuItem>Word Scramble</MenuItem></Link>
                  <Spacer />
                  <Link to="word-scramble/new">
                    <MenuItem icon={<Icon as={MdReplayCircleFilled}></Icon>}>New</MenuItem>
                  </Link>
                </Flex>
              </NavBar>
              <Routes>
                <Route path="" element={<Home />}></Route>
                  {/* <Route index element={<MemoryGame />} /> */}
                <Route path="/memory" element={<MemoryGame />} />
                <Route path="/sudoku/:startNewGame" element={<SudokuGame onCloseNewGameModal={() => {n('sudoku')}}/>} />
                <Route path="/sudoku" element={<SudokuGame/>} />
                <Route path="/word-scramble/:startNewGame" element={<WordScrambleGame onCloseNewGameModal={() => {n('sudoku')}}/>} />
                <Route path="/word-scramble" element={<WordScrambleGame/>} />
              </Routes>
            </Flex>
            {/* </header> */}
            
        </Box>
    </ChakraProvider>
  );
}

export default App;