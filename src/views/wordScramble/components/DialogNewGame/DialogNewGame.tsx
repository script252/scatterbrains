import React, { useState } from 'react';
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Center, Checkbox, VStack, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { NewGameSettings } from '../../lib/wordScrambleTypes';

function DialogNewGame(props: any) {
    const { isOpen, /*onOpen,*/ onClose } = useDisclosure();
  
    const { onSettingsConfirmed, startNewGameState, onCancel } = props;

    const [state, setState] = useState({...new NewGameSettings()});

    const cancelled = () => {
        onCancel();
        onClose();
    }

    const settingsChanged = (value: any) => {
        setState({...state, ...value});
    }

    const setTimeLimit = (value: any) => {
        if(value === '-1') {
            setState({...state, timed: false, timeLimit: -1});
        } else {
            setState({...state, timed: true, timeLimit: 60 * value});
        }
    }

    const onConfirm = () => {
        onSettingsConfirmed({...state});
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
                            <RadioGroup colorScheme="blue" onChange={(v) => settingsChanged({rounds: Number(v)})} defaultValue='3'>
                            <Stack direction='row'>
                                <Text>Rounds:</Text>
                                <Radio colorScheme="blue" value='1'>1</Radio>
                                <Radio colorScheme="blue" value='3'>3</Radio>
                                <Radio colorScheme="blue" value='5'>5</Radio>
                                <Radio colorScheme="blue" value='10'>10</Radio>
                            </Stack>
                            </RadioGroup>
                            <RadioGroup colorScheme="blue" onChange={setTimeLimit} defaultValue='2'>
                            <Stack direction='row'>
                                <Text>Round time:</Text>
                                <Radio colorScheme="blue" value='0.10'>0.10</Radio>
                                <Radio colorScheme="blue" value='2'>2</Radio>
                                <Radio colorScheme="blue" value='3'>3</Radio>
                                <Radio colorScheme="blue" value='-1'>Unlimited</Radio>
                            </Stack>
                            </RadioGroup>
                            <Checkbox defaultChecked onChange={(v: any) => settingsChanged({combineQU: v.target.checked})}>Use QU</Checkbox>
                            <Checkbox disabled onChange={(v: any) => settingsChanged({boardSize: v.target.checked === true ? 5 : 4})}>Use big board (5x5)</Checkbox>
                            <Checkbox disabled onChange={(v: any) => settingsChanged({includeRedCube: v.target.checked})}>Use bonus die</Checkbox>
                            </VStack>
                        </Center>
                    </ModalBody>
                    <ModalFooter>
                    <Button onClick={cancelled}>Cancel</Button>
                    <Button onClick={() => onConfirm()}>Accept</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default DialogNewGame;