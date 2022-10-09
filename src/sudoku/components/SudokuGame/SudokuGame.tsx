import React, { useEffect, useState } from 'react';

import './sudoku-game.scss';
import Cell from '../Cell/Cell';
import { CellData, ENewGameDialogResult, SudokuGameState } from '../../lib/sudokuGameTypes';
import * as SudokuGameLib from '../../lib/sudokuGameLib';
import { Box, Flex, SimpleGrid } from '@chakra-ui/react';
import CellInputButtons from '../CellInputButtons/CellInputButtons';
import DialogNewGame from '../DialogNewGame/DialogNewGame';
import DialogVictory from '../DialogVictory/DialogVictory';

function SudokuGame(props: any) {

    const {startNewGame, onCloseNewGameModal} = props;

    const [gameState, setGameState] = useState(new SudokuGameState());
    const cellSize = 48;

    const isCellSelected = (id: number|null) => gameState.selected === id;
    const isCellHighlighted = (id: number|null) => gameState.highlighted.some((c:number|null) => c === id);
    const isCellError = (id: number|null) => { 
        if(gameState.showErrors === true) {
            const cell: CellData = gameState.cells[id as number];
            return cell.value ? cell.answer !== cell.value : false;
        }
    };

    useEffect(() => {

        const initialGameState: SudokuGameState = SudokuGameLib.init(Number(ENewGameDialogResult.easy));

        // Set game state from saved value (if there is one)
        setGameState(SudokuGameLib.loadGameState(initialGameState as SudokuGameState));
    }, []);

    const onClick = (cell: CellData, gs: SudokuGameState) => {
        setGameState(SudokuGameLib.saveGameState(SudokuGameLib.onCellClicked(cell, gs)));
    }

    const onDifficultySelected = (difficulty: ENewGameDialogResult) => {
        const newGameState = SudokuGameLib.init(Number(difficulty));
        if(newGameState !== null) {
            setGameState(newGameState);
            onCloseNewGameModal();
        }
    }

    const onNewGameCancel = () => {
        onCloseNewGameModal();
    }

    return (
            <Flex className="sudoku-game" width="100%">
                <Box ml="auto" mr="auto" flex="1 100%" className="cell-container"> 
                    <SimpleGrid spacing={0} columns={9} gap={0} height="100vw" width="100%" maxWidth="70vh" maxHeight="70vh" p="8px" m="auto">
                        {gameState.cells.map((cell: CellData, index: number) => {
                            return (
                                <Cell key={index} 
                                    //value={cell.value} 
                                    {...cell}
                                    //debugText={cell.answer} 
                                    isSelected={ isCellSelected(index) }
                                    isHighlighted={ isCellHighlighted(index) } 
                                    isError={ isCellError(index)}
                                    size={cellSize+"px"} 
                                    onClick={(e: any) => onClick(cell, gameState)} 
                                ></Cell>
                            )
                        })}
                    </SimpleGrid>
                </Box>
                <CellInputButtons onClick={(value: number) => setGameState(SudokuGameLib.saveGameState(SudokuGameLib.onEnteredInput(gameState.cells[gameState.selected as number], value, gameState)))}></CellInputButtons>
                <DialogNewGame startNewGameState={startNewGame} onDifficultySelected={(difficulty: any) => onDifficultySelected(difficulty)} onCancel={onNewGameCancel}></DialogNewGame>
                <DialogVictory gameState={gameState} onCloseVictory={() => setGameState({...gameState, showVictory: false})}></DialogVictory>
            </Flex>
    );
}

export default SudokuGame;