import React, { useEffect, useState } from 'react';
import './wordScrambleGame.scss';
import * as WordScrambleLib from '../../lib/wordScrambleLib';
import { Container, Flex, SimpleGrid } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { CellData, NewGameSettings, WordScrambleGameState } from '../../lib/wordScrambleTypes';
import Cell from '../Cell/Cell';

function WordScrambleGame(props: any) {

  //const {onCloseNewGameModal} = props;

  const [gameState, setGameState] = useState(new WordScrambleGameState());
  const cellSize = 52;

  const isCellSelected = (id: number|null) => gameState.selected.some((c:number|null) => c === id);

  const {startNewGame} = useParams();
  useEffect(() => {

      const initialGameState: WordScrambleGameState = WordScrambleLib.init(new NewGameSettings());

      // Set game state from saved value (if there is one)
      const gs = WordScrambleLib.loadGameState(initialGameState as WordScrambleGameState);
      setGameState(gs);

      setGameState({...gs, showNewGame: startNewGame === 'new'});
  }, [startNewGame]);

  const onClick = (cell: CellData, gs: WordScrambleGameState) => {
      setGameState(WordScrambleLib.saveGameState(WordScrambleLib.onCellClicked(cell, gs)));

  }

  const onTouchDrag = (e: any) => {
    
    const elem = document.elementFromPoint(e.touches[0].clientX, e.touches[0].clientY);
    const cellId:number = elem?.id ? Number(elem?.id) : -1;
    if(cellId !== -1) {
      onClick(gameState.cells[cellId], gameState);
    }
  }

  // const onStartNewGame = (settings: NewGameSettings) => {
  //     const newGameState = WordScrambleLib.init(settings);
  //     if(newGameState !== null) {
  //         const gs = {...newGameState, showNewGame: false};
  //         setGameState(gs);
  //         WordScrambleLib.saveGameState(gs);
  //         onCloseNewGameModal();
  //     }
  // }

  // const onNewGameCancel = () => {
  //     setGameState({...gameState, showNewGame: false});
  //     onCloseNewGameModal();
  // }
  

  return (
              <Container height="100vh" maxW="xl">
                  <Flex height="90%" flexDirection="column" >
                      <Container maxW="100%" className="cell-grid-container" m="0" p="0">
                          <SimpleGrid spacing={0} columns={gameState.gameSettings.boardSize} gap={0} p="8px" className="cell-grid" width="100%" onTouchMove={onTouchDrag}>
                              {gameState.cells.map((cell: CellData, index: number) => {
                                  return (
                                      <Cell 
                                          key={index} 
                                          {...cell}
                                          isSelected={ isCellSelected(index) }
                                          size={cellSize+"px"} 
                                          onClick={(e: any) => onClick(cell, gameState)} 
                                      ></Cell>
                                  )
                              })}
                          </SimpleGrid>
                      </Container>
                      {/* <VStack spacing='10px' width="100%" flexGrow="1">
                          <CellInputButtons onClick={(value: number) => onEnterCellValue(value, gameState.noteMode)}></CellInputButtons>
                          <HStack width="100%" height="20%" pl="8px" pr="8px">
                              <Button mr="8px" colorScheme={gameState.noteMode ? 'green' : 'gray'} width="100%" height="100%" onClick={() => setGameState({...gameState, noteMode: !gameState.noteMode})}>Note</Button>
                              <Button ml="8px" width="100%" height="100%" onClick={() => onEnterCellValue(0)}>Clear</Button>
                          </HStack>
                      </VStack> */}
                  </Flex>
                  {/* <DialogNewGame startNewGameState={gameState.showNewGame} onConfirm={(settings: any) => onStartNewGame(settings)} onCancel={onNewGameCancel}></DialogNewGame>
                  <DialogVictory gameState={gameState} onCloseVictory={() => setGameState({...gameState, showVictory: false})}></DialogVictory> */}
              </Container>
  );
}

export default WordScrambleGame;