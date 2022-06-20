import React, { useState } from 'react';

import './sudoku-game.scss';
import Cell from '../Cell/Cell';
import { CellData, SudokuGameState } from '../../lib/sudokuGameTypes';
import { init, onCellClicked, onEnteredInput } from '../../lib/sudokuGameLib';
import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
import CellInputButtons from '../CellInputButtons/CellInputButtons';

const initialGameState: SudokuGameState = init('easy');

function SudokuGame() {

    const [gameState, setGameState] = useState(initialGameState);
    const cellSize = 48;
    //const containerWidth = cellSize * 9 + "px";

    const isCellSelected = (id: number|null) => gameState.selected === id;
    const isCellHighlighted = (id: number|null) => gameState.highlighted.some((c:number|null) => c === id);
    const isCellError = (id: number|null) => { 
        if(gameState.showErrors === true) {
            const cell: CellData = gameState.cells[id as number];
            return cell.value ? cell.answer !== cell.value : false;
        }
    };

    return (
        
            <Flex className="sudoku-game" width="100%">
                <Box ml="auto" mr="auto" flex="1 100%"> 
                    <SimpleGrid spacing={0} columns={9} gap={0} height="100vw" width="100%" maxWidth="70vh" maxHeight="70vh" p="8px" m="auto">
                        {gameState.cells.map((cell: CellData, index: number) => {
                            return (
                                <Cell key={index} 
                                    //value={cell.value} 
                                    {...cell}
                                    //debugText={cell.clusterId} 
                                    isSelected={ isCellSelected(index) }
                                    isHighlighted={ isCellHighlighted(index) } 
                                    isError={ isCellError(index)}
                                    size={cellSize+"px"} 
                                    onClick={(e: any) => setGameState(onCellClicked(cell, gameState))} 
                                ></Cell>
                            )
                        })}
                    </SimpleGrid>
                    
                </Box>
                <CellInputButtons onClick={(value: number) => setGameState(onEnteredInput(gameState.cells[gameState.selected as number], value, gameState))}></CellInputButtons>
            </Flex>
            
    );
}

export default SudokuGame;


