import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import './wordScrambleGame.scss';
import * as WordScrambleLib from '../../lib/wordScrambleLib';
import { Box, Button, Container, Flex, HStack, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { NewGameSettings, TurnScore, Word, WordScrambleGameState } from '../../lib/wordScrambleTypes';
import WordList from '../WordList/WordList';
import WordBoard from '../WordBoard/WordBoard';
import DialogNewGame from '../DialogNewGame/DialogNewGame';
import DialogVictory from '../DialogVictory/DialogVictory';
import Timer from '../Timer/Timer';

function getExpireTime(seconds: number, secondsPassed:number = 0): any[] {
  const future = new Date();
  const start = new Date();
  future.setSeconds(future.getSeconds() + seconds);
  start.setSeconds(start.getSeconds() - secondsPassed);
  return [future, start];
}

function WordScrambleGame(props: any) {

  const {onCloseNewGameModal} = props;

  const [gameState, setGameState] = useState(new WordScrambleGameState());
  const [timerExpireAt, setTimerExpireAt] = useState([new Date(), new Date()]);
  const [timerValue, setTimerValue] = useState(100);
  const [initialized, setInitialized] = useState(false);
  const [rolling, setRolling] = useState(false);
  const [showMissingWords, setShowMissingWords] = useState(false);

  const {startNewGame} = useParams();

  useEffect(() => {

      console.log('Starting Word Scramble');

      WordScrambleLib.startGame(startNewGame === 'new').then((gs: WordScrambleGameState) => {
        setTimerValue(gs.timer);
        const timeRemaining = (gs.timer/100) * gs.gameSettings.timeLimit;
        const secondsPassed = ((100 - gs.timer)/100) * gs.gameSettings.timeLimit;
        setTimerExpireAt(getExpireTime(timeRemaining, secondsPassed));
        setGameState(gs);
        setInitialized(true);
      });

  }, [startNewGame]);

  const onPreRoll = () => {
    setInitialized((prev: boolean) => {
      setRolling(true);
      return false;
    });
  }

  const onRoll = useCallback(async() => {
    
    if(rolling === true) {
      const rolledGs: WordScrambleGameState = await WordScrambleLib.roll(gameState);
      const gs = WordScrambleLib.saveGameState(rolledGs);
        
      setTimerExpireAt(getExpireTime(gs.gameSettings.timeLimit));
      setTimerValue(100);
      setShowMissingWords(false);
      setGameState(gs);
      setRolling(false);
      setInitialized(true);
      console.log('Post roll:', gs);
    }
  }, [gameState, rolling]);

  useLayoutEffect(() => {
    if(rolling === true) {
      onRoll();
    }
  }, [rolling, onRoll]);

  const onStartNewGame = (settings: NewGameSettings) => {
      console.log('onStartNewGame', settings);
      const newGameState = WordScrambleLib.init(settings);
      if(newGameState !== null) {
          const gs = {...newGameState, showNewGame: false};
          setGameState(gs);
          WordScrambleLib.saveGameState(gs);
          onCloseNewGameModal();

          setTimerExpireAt(getExpireTime(gameState.gameSettings.timeLimit));
          setTimerValue(100);
          setShowMissingWords(false);
      }
  }

  const onNewGameCancel = () => {
      setGameState({...gameState, showNewGame: false, showVictory: false});
      onCloseNewGameModal();
  }

  const scoreInfo: TurnScore = WordScrambleLib.getCurrentTurnScore(gameState);

  const onTimeout = useCallback(() => {
    if(gameState.turnHasEnded === false && gameState.gameSettings.timed === true) {
      // Turn over
      // Lock the board, unlock roll button,
      // Show victory modal if final turn
      if(gameState.currentTurn + 1 >= gameState.gameSettings.rounds) {
        const gs: WordScrambleGameState = {
          ...gameState,
          turnHasEnded: true,
          gameOver: true,
          showVictory: true
        };
        setGameState(gs);
        WordScrambleLib.saveGameState(gs);
        setTimerValue(0);
      } else {
        setGameState({...gameState, turnHasEnded: gameState.gameSettings.timed === true ? true : false});
        setTimerValue(0);
      }
    }
  }, [gameState]);

  const onTimerTick = (value: number) => {
    if(gameState.turnHasEnded === false) {
      setTimerValue(value);
      WordScrambleLib.saveGameState({...gameState, timer: value});
    }
  };

  const isRollDisabled = () => {
    if(initialized === false) return true;
    if(gameState.gameSettings.timed === false) return false;

    return !gameState.turnHasEnded || (gameState.currentTurn + 1) >= gameState.gameSettings.rounds;
  }

  const isShowMissingDisabled = () => {
    if((gameState.currentTurn + 1) >= gameState.gameSettings.rounds) {
      if(gameState.gameSettings.timed === true) {
        return false;  
      }
    }

    if(gameState.gameSettings.timed === false) return false;

    return !gameState.turnHasEnded || (gameState.currentTurn + 1) >= gameState.gameSettings.rounds;
  }

  const onStateChanged = (newState: WordScrambleGameState) => { 
    setGameState({...newState, timer: timerValue, highlighted: []});
  }

  const onClickWord = (word: Word) => {
    setGameState({...gameState, highlighted: word.wordCellIndices});
  }

  return (  
    <Container height="100vh" maxW="xl" className="prevent-scrolling">
        <Flex height="90%" flexDirection="column" >
            <WordBoard loading={initialized === false} locked={gameState.turnHasEnded} gameState={gameState} onStateChange={onStateChanged}></WordBoard>
            <Timer value={timerValue} hidden={gameState.gameSettings.timed === false} locked={gameState.turnHasEnded === true || gameState.gameSettings.timed === false || initialized === false} expireAtAndStartTime={timerExpireAt} onTick={onTimerTick} onTimeout={onTimeout}></Timer>
            <Container mt='1rem' maxW="xl" ml="0" mr="0" p="0">
              <WordList
                foundWords={WordScrambleLib.getTurnScore(gameState).foundWords}
                notFoundWords={gameState.possibleWords.filter((ps: Word) => !WordScrambleLib.getTurnScore(gameState).discoveredWordsSet.has(ps.wordString.toLowerCase()))}
                showNotFound={showMissingWords}
                onClickWord={onClickWord}
              >
              </WordList>
            </Container>
            <Container mt='1rem' maxW="xl" ml="0" mr="0" p="0">
              <HStack width="100%" height="20%" pl="0" pr="0">
                    <Box width="100%">
                      <Text color='gray.100'>Turn: {gameState.currentTurn+1}/{gameState.gameSettings.rounds}</Text>
                    </Box>
                    <Box width="100%">
                      <Text color='gray.100'>Score: {scoreInfo.turnScore}</Text>
                    </Box>
                    <Box width="100%">
                      <Text color='gray.100' textAlign='end'>Found: {scoreInfo.found}/{scoreInfo.wordsInBoard}</Text>
                    </Box>
              </HStack>
            </Container>
            <HStack width="100%" pl="0" pr="0">
              <Flex flexDirection="row" width="100%">
                <Button width="100%" mr="1rem" disabled={isRollDisabled()} mt='1rem' colorScheme='gray' onClick={onPreRoll}>Roll</Button>
                <Button width="100%" disabled={isShowMissingDisabled()} mt='1rem' colorScheme='gray' onClick={() => setShowMissingWords(true)}>Show missing</Button>
              </Flex>
            </HStack>
            {/* <VStack spacing='10px' width="100%" flexGrow="1">
                <CellInputButtons onClick={(value: number) => onEnterCellValue(value, gameState.noteMode)}></CellInputButtons>
                <HStack width="100%" height="20%" pl="8px" pr="8px">
                    <Button mr="8px" colorScheme={gameState.noteMode ? 'green' : 'gray'} width="100%" height="100%" onClick={() => setGameState({...gameState, noteMode: !gameState.noteMode})}>Note</Button>
                    <Button ml="8px" width="100%" height="100%" onClick={() => onEnterCellValue(0)}>Clear</Button>
                </HStack>
            </VStack> */}
        </Flex>
        <DialogNewGame startNewGameState={gameState.showNewGame} onSettingsConfirmed={(settings: NewGameSettings) => onStartNewGame(settings)} onCancel={onNewGameCancel}></DialogNewGame>
        <DialogVictory gameState={gameState} onCloseVictory={() => {setGameState({...gameState, showVictory: false}); WordScrambleLib.saveGameState({...gameState, showVictory: false}); }}></DialogVictory>
    </Container>      
  );
}

export default WordScrambleGame;