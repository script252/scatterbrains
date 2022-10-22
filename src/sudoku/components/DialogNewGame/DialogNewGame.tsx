import React, { useState } from 'react';
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Center, SimpleGrid, Checkbox } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { EDifficulty, NewGameSettings } from '../../lib/sudokuGameTypes';

function DialogNewGame(props: any) {
    const { isOpen, /*onOpen,*/ onClose } = useDisclosure();
  
    const { onDifficultySelected, startNewGameState, onCancel } = props;

    const [state, setState] = useState(new NewGameSettings());

    const selectedDifficulty = (difficulty: EDifficulty, onClose?: any) => {
        onDifficultySelected({...state, difficulty: difficulty});
        onClose();
    }

    const cancelled = () => {
        onCancel();
        onClose();
    }

    const highlightErrorsChanged = (value: any) => {
        setState({...state, highlightErrors: value.target.checked});
    }

    const diffArray: any = Object.entries(EDifficulty).slice(0, -1);

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
                        <Checkbox defaultChecked onChange={highlightErrorsChanged}>Highlight errors</Checkbox>
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