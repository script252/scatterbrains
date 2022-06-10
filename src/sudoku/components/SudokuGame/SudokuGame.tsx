import React, { useState } from 'react';

import Cell from '../Cell/Cell';
import { SudokuGameState } from '../../lib/sudokuGameTypes';
import { init, onCellClicked } from '../../lib/sudokuGameLib';
import { Box, SimpleGrid } from '@chakra-ui/react';

const initialGameState: SudokuGameState = init('easy');

function SudokuGame() {

  const [gameState, setGameState] = useState(initialGameState);

  return (
      <Box className="sudoku-game" width="18rem">
            <SimpleGrid spacing={0} columns={9} gap={0}>
                {gameState.cells.map((cell: any, ri: number) => {
                    return (
                        cell.map((cell: any, ci: number) => {
                            return (
                                <Cell key={ri+ci} value={cell} isSelected={false} onClick={(e: any) => onCellClicked(cell, gameState)} 
                                ></Cell>
                            )
                        })
                        
                    )
                })}
            </SimpleGrid>
      </Box>
  );
}

export default SudokuGame;
