import React, {} from 'react';
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Center, VStack, Icon } from "@chakra-ui/react";
import { Button, Text } from "@chakra-ui/react";
import { EDifficulty, getDifficultyString, WordScrambleGameState } from '../../lib/wordScrambleTypes';
import { GiTrophyCup } from 'react-icons/gi';

// function getMissedWords(curr: Word[], prev: Word[]) {
//   const missed: Set<string> = new Set<string>(prev.map((w:Word) => w.id));
//   curr.forEach((word: Word) => missed.add(word.id));
//   return Array.from(missed).map((id: string) => new Word());
// }

// function getScoreTotals(gs: WordScrambleGameState): ScoreState {
//   return gs.score.reduce((prev: ScoreState, curr: ScoreState): ScoreState => {
//     return {
//       turnScore: prev.turnScore + curr.turnScore, 
//       found: prev.found + curr.found, 
//       wordsInBoard: prev.wordsInBoard + curr.wordsInBoard,
//       //discoveredWords: Array.from(prev.discoveredWordsSet).concat(Array.from(curr.discoveredWordsSet)),
//       discoveredWordsSet: curr.discoveredWordsSet,
//       discoveredWords: curr.discoveredWords,
//       missedWords: curr.missedWords ? getMissedWords(curr.missedWords, prev.missedWords) : [],
//       foundWords: [],
//       wordsNeededToWinCount: prev.wordsNeededToWinCount + curr.wordsNeededToWinCount,
//       scoreNeededToWin: prev.scoreNeededToWin + curr.scoreNeededToWin
//     }
//   });
// }

function DialogVictory(props: any) {
    const { onClose } = useDisclosure();
  
    const { gameState, onCloseVictory }: {gameState: WordScrambleGameState, onCloseVictory: any} = props;

    const closeVictory = (startNewGame: boolean) => {
        onCloseVictory(startNewGame);  // Could pass back a 'play another game' option here
        onClose();
    }

    //const scoreTotals = getScoreTotals(gameState);
    const diff = gameState.gameSettings.difficulty;

    return (
      <>  
        <Modal onClose={onCloseVictory} isOpen={gameState.showVictory} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>You Win!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Center>
                    <VStack>
                      {diff === EDifficulty.easy && <Icon as={GiTrophyCup} boxSize={20} color="orange.600"/> }
                      {diff === EDifficulty.medium && <Icon as={GiTrophyCup} boxSize={20} color="gray.300"/> }
                      {diff === EDifficulty.hard && <Icon as={GiTrophyCup} boxSize={20} color="yellow.200"/> }
                      <Text>Difficulty: {getDifficultyString(diff)}</Text>
                      {/* <Text>Total score: {scoreTotals.turnScore}</Text>
                      <Text>Total found: {scoreTotals.found}/{scoreTotals.wordsInBoard}</Text> */}
                    </VStack>
                </Center>
            </ModalBody>
            <ModalFooter>
            <Button onClick={() => closeVictory(true)}>Play again</Button>
              <Button onClick={() => closeVictory(false)}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default DialogVictory;