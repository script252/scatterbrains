import React, { useState } from 'react';

import Cell from '../Cell/Cell';
import { CellData, SudokuGameState } from '../../lib/sudokuGameTypes';
import { init, onCellClicked, onEnteredInput } from '../../lib/sudokuGameLib';
import { Box, SimpleGrid } from '@chakra-ui/react';
import CellInputButtons from '../CellInputButtons/CellInputButtons';

const initialGameState: SudokuGameState = init('easy');

function SudokuGame() {

    const [gameState, setGameState] = useState(initialGameState);
    const cellSize = 48;
    const containerWidth = cellSize * 9 + "px";

    const isCellSelected = (id: number|null) => gameState.selected === id;
    const isCellHighlighted = (id: number|null) => gameState.highlighted.some((c:number|null) => c === id);
    const isCellError = (id: number|null) => { 
        if(gameState.showErrors === true) {
            const cell: CellData = gameState.cells[id as number];
            return cell.value ? cell.answer !== cell.value : false;
        }
    };

    return (
        <Box className="sudoku-game" width={containerWidth}>
            <SimpleGrid spacing={0} columns={9} gap={0}>
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
            <CellInputButtons onClick={(value: number) => setGameState(onEnteredInput(gameState.cells[gameState.selected as number], value, gameState))}></CellInputButtons>
        </Box>
    );
}

export default SudokuGame;


