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
  const [dragging, setDragging] = useState(false);
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

  const getCellIdAtLocation = (clientX: number, clientY: number) => {
    console.log(clientX, clientY);
    const elem = document.elementFromPoint(clientX, clientY);
    const cellId:number = elem?.id ? Number(elem?.id) : -1;
    return cellId;
  }

  const onClick = (cell: CellData, gs: WordScrambleGameState, dragging: boolean = false) => {
      console.log('onClick, dragging: ', dragging);
      setDragging(dragging);
      //setGameState(WordScrambleLib.saveGameState(WordScrambleLib.onCellClicked(cell, gs)));
      setGameState(WordScrambleLib.onCellClicked(cell, gs, dragging));
  }

  const onTouchStart = (e: any) => {
    if(dragging === false) {
      console.log('onTouchStart: single click', e);
      const cellId = getCellIdAtLocation(e.touches[0].clientX, e.touches[0].clientY);
      if(cellId !== -1) {
        setGameState(WordScrambleLib.onCellClicked(gameState.cells[cellId], gameState, false));
      }
    }
    //e.preventDefault();  // Don't trigger a mouse click event
  }

  const onTouchDrag = (e: any) => {
    console.log('onTouchDrag');
    const cellId = getCellIdAtLocation(e.touches[0].clientX, e.touches[0].clientY);
    if(cellId !== -1) {
      onClick(gameState.cells[cellId], gameState, true);
    }
  }

  const onTouchEnd = (e: any) => {
    if(dragging === true) {
      console.log('onTouchEnd', e);
      setDragging(false);
      onSelectionComplete();
    } else {
      // console.log('onTouchEnd: single click', e);
      // const cellId = getCellIdAtLocation(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      // if(cellId !== -1) {
      //   //onClick(gameState.cells[cellId], gameState, true);
      //   setGameState(WordScrambleLib.onCellClicked(gameState.cells[cellId], gameState, true));
      // }
    }
    e.preventDefault();  // Don't trigger a mouse click event
  }

  const onMouseUp = (e: any) => {
    
    if(dragging) {
      console.log('onDragEnd', e);
      onSelectionComplete();
    }
  }

  const onMouseDown = (e: any, cell: CellData) => {
    console.log('onDragStart', e);
    onClick(cell, gameState, false);
    
    e.preventDefault();
  }

  const onSelectionComplete = () => {
    setGameState(WordScrambleLib.saveGameState(WordScrambleLib.onSelectionComplete(gameState)));
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
                          <SimpleGrid 
                            spacing={0} columns={gameState.gameSettings.boardSize} 
                            gap={0} p="8px" className="cell-grid" width="100%" 
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
                                          size={cellSize+"px"} 
                                          //onClick={(e: any) => {console.log('Cell onClick'); onClick(cell, gameState)}}
                                          onDrag={(e: any) => {console.log('Cell onDrag'); onClick(cell, gameState, true)}}
                                          onMouseUp={(e:any) => onMouseUp(e)}
                                          onMouseDown={(e: any) => onMouseDown(e, cell)}
                                          debugText={cell.id}
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