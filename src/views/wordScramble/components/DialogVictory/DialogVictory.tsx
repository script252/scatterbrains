import React, {} from 'react';
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Center, VStack } from "@chakra-ui/react";
import { Button, Text } from "@chakra-ui/react";
import { ScoreState, Word, WordScrambleGameState } from '../../lib/wordScrambleTypes';

function getMissedWords(curr: Word[], prev: Word[]) {
  const missed: Set<string> = new Set<string>(prev.map((w:Word) => w.id));
  curr.forEach((word: Word) => missed.add(word.id));
  return Array.from(missed).map((id: string) => new Word());
}

function getScoreTotals(gs: WordScrambleGameState): ScoreState {
  return gs.score.reduce((prev: ScoreState, curr: ScoreState): ScoreState => {
    return {
      turnScore: prev.turnScore + curr.turnScore, 
      found: prev.found + curr.found, 
      wordsInBoard: prev.wordsInBoard + curr.wordsInBoard,
      //discoveredWords: Array.from(prev.discoveredWordsSet).concat(Array.from(curr.discoveredWordsSet)),
      discoveredWordsSet: curr.discoveredWordsSet,
      missedWords: curr.missedWords ? getMissedWords(curr.missedWords, prev.missedWords) : [],
      foundWords: []
    }
  });
}

function DialogVictory(props: any) {
    const { onClose } = useDisclosure();
  
    const { gameState, onCloseVictory }: {gameState: WordScrambleGameState, onCloseVictory: any} = props;

    const closeVictory = () => {
        onCloseVictory();  // Could pass back a 'play another game' option here
        onClose();
    }

    const scoreTotals = getScoreTotals(gameState);

    return (
      <>  
        <Modal onClose={onCloseVictory} isOpen={gameState.showVictory} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Game Over</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Center>
                    <VStack>
                      <Text>Total score: {scoreTotals.turnScore}</Text>
                      <Text>Total found: {scoreTotals.found}/{scoreTotals.wordsInBoard}</Text>
                    </VStack>
                </Center>
            </ModalBody>
            <ModalFooter>
              <Button onClick={closeVictory}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
}

export default DialogVictory;