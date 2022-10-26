import React, { useEffect, useState } from 'react';
import './wordScrambleGame.scss';
import * as WordScrambleLib from '../../lib/wordScrambleLib';
import { Box, Button, Container, Flex, HStack, SimpleGrid, Spacer, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { CellData, NewGameSettings, TurnScore, wordScores, WordScrambleGameState } from '../../lib/wordScrambleTypes';
import Cell from '../Cell/Cell';
import WordList from '../WordList/WordList';

function WordScrambleGame(props: any) {

  //const {onCloseNewGameModal} = props;

  const [gameState, setGameState] = useState(new WordScrambleGameState());
  const [dragging, setDragging] = useState(false);
  const cellSize = 52;

  // OPTIMIZE: sets would be faster
  const isCellSelected = (id: number|null) => gameState.selected.some((c:number|null) => c === id);
  const isCellScored = (id: number|null) => gameState.lastScoredWord.some((c:number|null) => c === id);
  const isCellWrong = (id: number|null) => gameState.lastWrongWord.some((c:number|null) => c === id);

  const {startNewGame} = useParams();
  useEffect(() => {

      console.log('Starting Word Scramble');

      const initialGameState: WordScrambleGameState = WordScrambleLib.init(new NewGameSettings());

      // Set game state from saved value (if there is one)
      const gs = WordScrambleLib.loadGameState(initialGameState as WordScrambleGameState);
      const words: string[] = WordScrambleLib.findWords(gs);
      console.log(`Found ${words.length} unique words`);
      
      setGameState({...gs, showNewGame: startNewGame === 'new', possibleWordCount: words.length, possibleWords: words});
      WordScrambleLib.saveGameState(gs);

  }, [startNewGame]);

  const getCellIdAtLocation = (clientX: number, clientY: number) => {
    const elem = document.elementFromPoint(clientX, clientY);
    const cellId:number = elem?.id ? Number(elem?.id) : -1;
    return cellId;
  }

  const onClick = (cell: CellData, gs: WordScrambleGameState, dragging: boolean = false) => {
      //console.log('onClick, dragging: ', dragging);
      setDragging(dragging);
      const clearedScored = WordScrambleLib.clearSelected(gs, false, true, true);
      setGameState(WordScrambleLib.saveGameState(WordScrambleLib.onCellClicked(cell, clearedScored, dragging)));
  }

  const onTouchStart = (e: any) => {
    if(dragging === false) {
      //console.log('onTouchStart: single click', e);
      const cellId = getCellIdAtLocation(e.touches[0].clientX, e.touches[0].clientY);
      if(cellId !== -1) {
        const clearedScored = WordScrambleLib.clearSelected(gameState, false, true, true);
        setGameState(WordScrambleLib.saveGameState(WordScrambleLib.onCellClicked(gameState.cells[cellId], clearedScored, false)));
      }
    }
  }

  const onTouchDrag = (e: any) => {
    //console.log('onTouchDrag');
    const cellId = getCellIdAtLocation(e.touches[0].clientX, e.touches[0].clientY);
    if(cellId !== -1) {
      onClick(gameState.cells[cellId], gameState, true);
    }
  }

  const onTouchEnd = (e: any) => {
    if(dragging === true) {
      //console.log('onTouchEnd', e);
      setDragging(false);
      onSelectionComplete();
    }
    e.preventDefault();  // Don't trigger a mouse click event
  }

  const onMouseUp = (e: any) => {
    
    if(dragging) {
      //console.log('onDragEnd', e);
      onSelectionComplete();
    }
  }

  const onMouseDown = (e: any, cell: CellData) => {
    //console.log('onDragStart', e);
    onClick(cell, gameState, false);
    
    e.preventDefault();
  }

  const onSelectionComplete = () => {
    setGameState(WordScrambleLib.saveGameState(WordScrambleLib.onSelectionComplete(gameState)));
  }

  const onRoll = () => {
    setGameState(WordScrambleLib.roll(gameState));
    WordScrambleLib.saveGameState(gameState);
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

  const scoreInfo: TurnScore = WordScrambleLib.getScore(gameState);

  return (
              <Container height="100vh" maxW="xl" className="prevent-scrolling">
                  <Flex height="90%" flexDirection="column" >
                      <Container maxW="100%" className="cell-grid-container" m="0" p="0" mt="1rem" bgColor="gray.700" borderRadius="0.5rem" overflow="hidden">
                          <SimpleGrid 
                            spacing={0} columns={gameState.gameSettings.boardSize} 
                            gap={2} p="4px" className="cell-grid" width="100%" 
                            overflow="hidden"
                            onTouchMove={onTouchDrag}
                            onTouchEnd={onTouchEnd}
                            onTouchStart={onTouchStart}
                            >
                              {gameState.cells.map((cell: CellData, index: number) => {
                                  return (
                                      <Cell 
                                          key={index} 
                                          {...cell}
                                          isSelected={ isCellSelected(index) }
                                          isScored={ isCellScored(index) }
                                          isWrong={ isCellWrong(index) }
                                          size={cellSize+"px"} 
                                          //onClick={(e: any) => {console.log('Cell onClick'); onClick(cell, gameState)}}
                                          onDrag={(e: any) => onClick(cell, gameState, true)}
                                          onMouseUp={(e:any) => onMouseUp(e)}
                                          onMouseDown={(e: any) => onMouseDown(e, cell)}
                                          // debugText={cell.id}
                                      ></Cell>
                                  )
                              })}
                          </SimpleGrid>
                      </Container>
                      <Container mt='1rem' maxW="xl" ml="0" mr="0" p="0">
                        <WordList>
                          {Array.from(gameState.score.discoveredWordsSet).map((word: string, index: number) => (<Flex pl='1rem' pr='1rem' key={index}><Text color='gray.300'>{word}</Text><Spacer></Spacer><Text color="gray.100">{wordScores[Math.min(word.length, 8)]}</Text></Flex>))}
                        </WordList>
                      </Container>
                      <Container mt='1rem' maxW="xl" ml="0" mr="0" p="0">
                        <HStack width="100%" height="20%" pl="0" pr="0">
                              <Box width="100%">
                                <Text color='gray.100'>Score: {scoreInfo.turnScore}</Text>
                              </Box>
                              <Box width="100%">
                                <Text color='gray.100' textAlign='end'>Found: {scoreInfo.found}/{scoreInfo.wordsInBoard}</Text>
                              </Box>
                        </HStack>
                      </Container>
                      <Button mt='1rem' colorScheme='gray' onClick={onRoll}>Roll</Button>
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