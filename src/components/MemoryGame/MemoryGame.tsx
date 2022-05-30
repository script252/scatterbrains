import React, { useState } from 'react';
import './MemoryGame.scss';
import MemoryCardContainer from '../MemoryCardContainer/MemoryCardContainer';
import { CardData, GameState } from '../../types/memory-game-types';

import { init, clickedCard } from '../../lib/MemoryGame';
import DialogNewGame from '../DialogNewGame/DialogNewGame';
import { Center, Text } from '@chakra-ui/layout';
import DialogVictory from '../DialogVictory/DialogVictory';

const initialGameState: GameState = init(3, 4);

function MemoryGame() {

  const [gameState, setGameState] = useState(initialGameState);

  return (
      <div className="memory-game">
          <MemoryCardContainer 
            gameState={gameState} 
            onCardClicked={(card: CardData, gs: GameState) => setGameState(clickedCard(card, gs))}
            >
          </MemoryCardContainer>
          <Center>
            <Text fontSize="md">Turns: {gameState.turns}</Text>
            <DialogNewGame onSizeSelected={(rows: number, columns: number) => setGameState(init(rows, columns))}></DialogNewGame>
          </Center>
          <DialogVictory gameState={gameState} onCloseVictory={() => setGameState(init(gameState.rows, gameState.columns))}></DialogVictory>
      </div>
  );
}

export default MemoryGame;
