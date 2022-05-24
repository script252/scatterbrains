import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import MemoryCardContainer from './components/MemoryCardContainer/MemoryCardContainer';
import { CardData, GameState } from './types/memory-game-types';

import { init, clickedCard } from './lib/MemoryGame';

const initialGameState: GameState = init(2, 2);

function App() {

  const [gameState, setGameState] = useState(initialGameState);

  return (
    <div className="App">
      <header className="App-header">
        <MemoryCardContainer 
          gameState={gameState} 
          onCardClicked={(card: CardData, gs: GameState) => setGameState(clickedCard(card, gs))}
          >
        </MemoryCardContainer>
      </header>
    </div>
  );
}

export default App;
