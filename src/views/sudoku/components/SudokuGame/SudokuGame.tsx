import React, { useEffect, useState } from 'react';

import './sudokuGame.scss';
import Cell from '../Cell/Cell';
import { CellData, NewGameSettings, SudokuGameState } from '../../lib/sudokuGameTypes';
import * as SudokuGameLib from '../../lib/sudokuGameLib';
import { Button, Container, Flex, HStack, SimpleGrid, VStack } from '@chakra-ui/react';
import CellInputButtons from '../CellInputButtons/CellInputButtons';
import DialogNewGame from '../DialogNewGame/DialogNewGame';
import DialogVictory from '../DialogVictory/DialogVictory';
import { useParams } from 'react-router-dom';

function SudokuGame(props: any) {

    const {onCloseNewGameModal} = props;

    const [gameState, setGameState] = useState(new SudokuGameState());
    const cellSize = 52;

    useEffect(() => {

        // Listen for number key presses for cell input
        const numKeys = ['1','2','3','4','5','6','7','8','9','0'];
        function handle(event: any) {
            if(numKeys.some((k) => event.key === k)) {
                onEnterCellValue(Number(event.key), gameState.noteMode);
            }
        };

        document.addEventListener('keypress', handle);
        return () => document.removeEventListener('keypress', handle);
    });

    const isCellSelected = (id: number|null) => gameState.selected === id;
    const isCellHighlighted = (id: number|null) => gameState.highlighted.some((c:number|null) => c === id);
    const isCellError = (id: number|null) => { 
        if(gameState.showErrors === true) {
            const cell: CellData = gameState.cells[id as number];
            return cell.value ? cell.answer !== cell.value : false;
        }

        return false;
    };

    const {startNewGame} = useParams();
    useEffect(() => {

        const initialGameState: SudokuGameState = SudokuGameLib.init(new NewGameSettings());

        // Set game state from saved value (if there is one)
        const gs = SudokuGameLib.loadGameState(initialGameState as SudokuGameState);
        setGameState(gs);

        setGameState({...gs, showNewGame: startNewGame === 'new'});
    }, [startNewGame]);

    const onClick = (cell: CellData, gs: SudokuGameState) => {
        setGameState(SudokuGameLib.saveGameState(SudokuGameLib.onCellClicked(cell, gs)));
    }

    const onDifficultySelected = (settings: NewGameSettings) => {
        const newGameState = SudokuGameLib.init(settings);
        if(newGameState !== null) {
            const gs = {...newGameState, showNewGame: false};
            setGameState(gs);
            SudokuGameLib.saveGameState(gs);
            onCloseNewGameModal();
        }
    }

    const onNewGameCancel = () => {
        setGameState({...gameState, showNewGame: false});
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
                    <DialogNewGame startNewGameState={gameState.showNewGame} onDifficultySelected={(difficulty: any) => onDifficultySelected(difficulty)} onCancel={onNewGameCancel}></DialogNewGame>
                    <DialogVictory gameState={gameState} onCloseVictory={() => setGameState({...gameState, showVictory: false})}></DialogVictory>
                </Container>
    );
}

export default SudokuGame;
