import React from 'react';
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Box, Center } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

function DialogNewGame(props: any) {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    const { onDifficultySelected, startNewGameState, onCancel } = props;

    const selectedDifficulty = (difficulty: any, onClose?: any) => {
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
                            <Button colorScheme='teal' onClick={() => selectedDifficulty('easy', onClose)}>Easy</Button>
                            <Button colorScheme='teal' onClick={() => selectedDifficulty('medium', onClose)}>Medium</Button>
                            <Button colorScheme='teal' onClick={() => selectedDifficulty('hard', onClose)}>Difficult</Button>
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