import React, { useState } from 'react';
import './App.css';
import { ChakraProvider } from '@chakra-ui/react'
import MemoryCardContainer from './components/MemoryCardContainer/MemoryCardContainer';
import { CardData, GameState } from './types/memory-game-types';

import { init, clickedCard } from './lib/MemoryGame';
import DialogNewGame from './components/DialogNewGame/DialogNewGame';

const initialGameState: GameState = init(4, 4);

function App() {

  const [gameState, setGameState] = useState(initialGameState);

  return (
    <ChakraProvider>
      <div className="App">
        <header className="App-header">
          <MemoryCardContainer 
            gameState={gameState} 
            onCardClicked={(card: CardData, gs: GameState) => setGameState(clickedCard(card, gs))}
            >
          </MemoryCardContainer>
          <DialogNewGame onSizeSelected={(rows: number, columns: number) => setGameState(init(rows, columns))}></DialogNewGame>
        </header>
      </div>
    </ChakraProvider>
  );
}

export default App;
