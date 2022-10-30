import React, { useCallback, useEffect, useState } from 'react';
import './wordScrambleGame.scss';
import * as WordScrambleLib from '../../lib/wordScrambleLib';
import { Box, Button, Container, Flex, HStack, Spacer, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import { NewGameSettings, TurnScore, wordScores, WordScrambleGameState } from '../../lib/wordScrambleTypes';
import WordList from '../WordList/WordList';
import WordBoard from '../WordBoard/WordBoard';
import DialogNewGame from '../DialogNewGame/DialogNewGame';
import DialogVictory from '../DialogVictory/DialogVictory';
import Timer from '../Timer/Timer';

function WordScrambleGame(props: any) {

  const {onCloseNewGameModal} = props;

  const [gameState, setGameState] = useState(new WordScrambleGameState());
  const [timerExpireAt, setTimerExpireAt] = useState([new Date(), new Date()]);

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

      console.log('postInit', gs);
  }, [startNewGame]);

  const onRoll = () => {
    setGameState(WordScrambleLib.roll(gameState));
    WordScrambleLib.saveGameState(gameState);

    const future = new Date();
    future.setSeconds(future.getSeconds() + gameState.gameSettings.timeLimit);
    console.log('Setting future: ', future);
    setTimerExpireAt([future, new Date()]);
  }

  const onStartNewGame = (settings: NewGameSettings) => {
      const newGameState = WordScrambleLib.init(settings);
      if(newGameState !== null) {
          const gs = {...newGameState, showNewGame: false};
          setGameState(gs);
          WordScrambleLib.saveGameState(gs);
          onCloseNewGameModal();

          const future = new Date();
          future.setSeconds(future.getSeconds() + settings.timeLimit);
          setTimerExpireAt([future, new Date()]);
      }
  }

  const onNewGameCancel = () => {
      setGameState({...gameState, showNewGame: false, showVictory: false});
      onCloseNewGameModal();
  }

  const scoreInfo: TurnScore = WordScrambleLib.getCurrentTurnScore(gameState);

  const onTimeout = useCallback((gameState: WordScrambleGameState) => {
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
    } else {
      setGameState({...gameState, turnHasEnded: true});
      WordScrambleLib.saveGameState({...gameState, turnHasEnded: true});
    }
  }, []);

  const isRollDisabled = () => {
    if(gameState.gameSettings.timed === false) return false;

    return !gameState.turnHasEnded || (gameState.currentTurn + 1) >= gameState.gameSettings.rounds;
  }
  
  return (
              <Container height="100vh" maxW="xl" className="prevent-scrolling">
                  <Flex height="90%" flexDirection="column" >
                      <Timer locked={gameState.turnHasEnded} expireAtAndStartTime={timerExpireAt} onTimeout={() => onTimeout(gameState)}></Timer>
                      <WordBoard locked={gameState.turnHasEnded} gameState={gameState} onStateChange={(newState: WordScrambleGameState)=> setGameState(newState)}></WordBoard>
                      <Container mt='1rem' maxW="xl" ml="0" mr="0" p="0">
                        <WordList>
                          {Array.from(WordScrambleLib.getTurnScore(gameState).discoveredWordsSet).map((word: string, index: number) => (<Flex pl='1rem' pr='1rem' key={index}><Text color='gray.300'>{word}</Text><Spacer></Spacer><Text color="gray.100">{wordScores[Math.min(word.length, 8)]}</Text></Flex>))}
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
                      <Button disabled={isRollDisabled()} mt='1rem' colorScheme='gray' onClick={onRoll}>Roll</Button>
                      {/* <VStack spacing='10px' width="100%" flexGrow="1">
                          <CellInputButtons onClick={(value: number) => onEnterCellValue(value, gameState.noteMode)}></CellInputButtons>
                          <HStack width="100%" height="20%" pl="8px" pr="8px">
                              <Button mr="8px" colorScheme={gameState.noteMode ? 'green' : 'gray'} width="100%" height="100%" onClick={() => setGameState({...gameState, noteMode: !gameState.noteMode})}>Note</Button>
                              <Button ml="8px" width="100%" height="100%" onClick={() => onEnterCellValue(0)}>Clear</Button>
                          </HStack>
                      </VStack> */}
                  </Flex>
                  <DialogNewGame startNewGameState={gameState.showNewGame} onSettingsConfirmed={(settings: any) => onStartNewGame(settings)} onCancel={onNewGameCancel}></DialogNewGame>
                  <DialogVictory gameState={gameState} onCloseVictory={() => {setGameState({...gameState, showVictory: false}); WordScrambleLib.saveGameState({...gameState, showVictory: false}); }}></DialogVictory>
              </Container>
  );
}

export default WordScrambleGame;