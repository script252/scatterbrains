import React from 'react';
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Center, SimpleGrid } from "@chakra-ui/react";
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

    const diffArray: any = Object.entries(ENewGameDialogResult).slice(0, -1);

    return (
        <>
            <Modal onClose={cancelled} isOpen={isOpen || startNewGameState} isCentered size={"xl"}>
            <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Start New Game</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Center>
                            <SimpleGrid
                                columns={3}
                                spacing={2}
                            >
                            {diffArray.map((d:any, i:number) => {
                                return (
                                    <Button height="120px" width="120px" colorScheme='teal' onClick={() => selectedDifficulty(d[1], onClose)} key={i}>{d[0]}</Button>
                                );
                            })}
                            </SimpleGrid>
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