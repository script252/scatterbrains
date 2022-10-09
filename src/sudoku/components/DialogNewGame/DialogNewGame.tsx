import React from 'react';
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Center } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { ENewGameDialogResult } from '../../lib/sudokuGameTypes';

function DialogNewGame(props: any) {
    const { isOpen, /*onOpen,*/ onClose } = useDisclosure();
  
    const { onDifficultySelected, startNewGameState, onCancel } = props;

    const selectedDifficulty = (difficulty: ENewGameDialogResult, onClose?: any) => {
        onDifficultySelected(difficulty);
        onClose();
    }

    const cancelled = () => {
        onCancel();
        onClose();
    }

    return (
        <>
            <h1>Is open: {isOpen}</h1>
            <Modal onClose={onClose} isOpen={isOpen || startNewGameState} isCentered>
            <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Start New Game</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Center>
                            <Button colorScheme='teal' onClick={() => selectedDifficulty(ENewGameDialogResult.easy, onClose)}>Easy</Button>
                            <Button colorScheme='teal' onClick={() => selectedDifficulty(ENewGameDialogResult.medium, onClose)}>Medium</Button>
                            <Button colorScheme='teal' onClick={() => selectedDifficulty(ENewGameDialogResult.hard, onClose)}>Hard</Button>
                            <Button colorScheme='teal' onClick={() => selectedDifficulty(ENewGameDialogResult.veryHard, onClose)}>Very hard</Button>
                            <Button colorScheme='teal' onClick={() => selectedDifficulty(ENewGameDialogResult.insane, onClose)}>Insane</Button>
                            <Button colorScheme='teal' onClick={() => selectedDifficulty(ENewGameDialogResult.inhuman, onClose)}>Inhuman</Button>
                        </Center>
                    </ModalBody>
                    <ModalFooter>
                    <Button onClick={cancelled}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default DialogNewGame;