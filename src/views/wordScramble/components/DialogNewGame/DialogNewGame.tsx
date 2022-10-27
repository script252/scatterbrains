import React, { useState } from 'react';
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Center, Checkbox, VStack, Radio, RadioGroup, Stack } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { NewGameSettings } from '../../lib/wordScrambleTypes';

function DialogNewGame(props: any) {
    const { isOpen, /*onOpen,*/ onClose } = useDisclosure();
  
    const { onSettingsConfirmed, startNewGameState, onCancel } = props;

    const [state, setState] = useState(new NewGameSettings());

    const cancelled = () => {
        onCancel();
        onClose();
    }

    const settingsChanged = (value: any) => {
        setState({...state, ...value});
    }

    const setTimeLimit = (value: any) => {
        if(value === 0) {
            setState({...state, timed: false});
        }
        setState({...state, timeLimit: 60 * value});
    }

    return (
        <>
            <Modal onClose={cancelled} isOpen={isOpen || startNewGameState} isCentered size={"xl"}>
            <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Start New Game</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Center>
                            <VStack>
                            <RadioGroup onChange={setTimeLimit} value={2}>
                            <Stack direction='row'>
                                <Radio value='1'>1</Radio>
                                <Radio value='2'>2</Radio>
                                <Radio value='3'>3</Radio>
                                <Radio value='0'>Unlimited</Radio>
                            </Stack>
                            </RadioGroup>
                            <Checkbox defaultChecked onChange={(v: any) => settingsChanged({combineQU: v.target.checked})}>Use QU</Checkbox>
                            <Checkbox disabled onChange={(v: any) => settingsChanged({includeRedCube: v.target.checked})}>Use bonus die</Checkbox>
                            <Checkbox disabled onChange={(v: any) => settingsChanged({boardSize: v.target.checked === true ? 5 : 4})}>Use big board (5x5)</Checkbox>
                            </VStack>
                        </Center>
                    </ModalBody>
                    <ModalFooter>
                    <Button onClick={cancelled}>Cancel</Button>
                    <Button onClick={() => onSettingsConfirmed(state)}>Accept</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default DialogNewGame;