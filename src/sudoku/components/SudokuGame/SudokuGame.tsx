import React, { useEffect, useState } from 'react';

import './sudoku-game.scss';
import Cell from '../Cell/Cell';
import { CellData, ENewGameDialogResult, SudokuGameState } from '../../lib/sudokuGameTypes';
import * as SudokuGameLib from '../../lib/sudokuGameLib';
import { Button, Container, Flex, HStack, SimpleGrid, VStack } from '@chakra-ui/react';
import CellInputButtons from '../CellInputButtons/CellInputButtons';
import DialogNewGame from '../DialogNewGame/DialogNewGame';
import DialogVictory from '../DialogVictory/DialogVictory';

function SudokuGame(props: any) {

    const {startNewGame, onCloseNewGameModal} = props;

    const [gameState, setGameState] = useState(new SudokuGameState());
    const cellSize = 52;

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

    const onEnterCellValue = (value: number, note?: boolean) => {

        const gs = note === true ?  
            SudokuGameLib.onEnteredNote(gameState.cells[gameState.selected as number], value, gameState)
            : 
            SudokuGameLib.onEnteredInput(gameState.cells[gameState.selected as number], value, gameState);

        setGameState(SudokuGameLib.saveGameState(gs));
    }
    
    return (
                <Container height="100vh" maxW="xl">
                    <Flex height="90%" flexDirection="column" >
                        <Container maxW="100%" className="cell-grid-container" m="0" p="0">
                            <SimpleGrid spacing={0} columns={9} gap={0} p="8px" className="cell-grid" width="100%" >
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
                        </Container>
                        <VStack spacing='10px' width="100%" flexGrow="1">
                            <CellInputButtons onClick={(value: number) => onEnterCellValue(value, gameState.noteMode)}></CellInputButtons>
                            <HStack width="100%" height="20%" pl="8px" pr="8px">
                                <Button mr="8px" colorScheme={gameState.noteMode ? 'green' : 'gray'} width="100%" height="100%" onClick={() => setGameState({...gameState, noteMode: !gameState.noteMode})}>Note</Button>
                                <Button ml="8px" width="100%" height="100%" onClick={() => onEnterCellValue(0)}>Clear</Button>
                            </HStack>
                        </VStack>
                    </Flex>
                    <DialogNewGame startNewGameState={startNewGame} onDifficultySelected={(difficulty: any) => onDifficultySelected(difficulty)} onCancel={onNewGameCancel}></DialogNewGame>
                    <DialogVictory gameState={gameState} onCloseVictory={() => setGameState({...gameState, showVictory: false})}></DialogVictory>
                </Container>
    );
}

export default SudokuGame;