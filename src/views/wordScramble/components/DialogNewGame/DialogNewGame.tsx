import React, { useEffect, useState } from 'react';
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Center, Checkbox, VStack, Radio, RadioGroup, Stack, Text, Box } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { EDifficulty, NewGameSettings } from '../../lib/wordScrambleTypes';

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
        if(value === '-1') {
            setState({...state, timed: false, timeLimit: -1});
        } else {
            setState({...state, timed: true, timeLimit: 60 * Number(value)});
        }
    }

    const onConfirm = (state: NewGameSettings) => {

        //const init = new NewGameSettings();

        if(state.timeLimit === -1) {
            onSettingsConfirmed({...state, timed: false});
            onClose();
        } else {
            onSettingsConfirmed({...state, timed: true});
            onClose();
        }
    }

    useEffect(() => {
        setState(new NewGameSettings());
    }, [startNewGameState]);

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
                            <Stack direction='column'>
                                <RadioGroup mb={8} colorScheme="black" onChange={(v: string) => settingsChanged({difficulty: Number(v) as EDifficulty})} defaultValue='2'>
                                <Stack direction='column'>
                                    <Radio colorScheme="blue" value='1'>Easy</Radio>
                                    <Radio colorScheme="blue" value='2'>Medium</Radio>
                                    <Radio colorScheme="blue" value='3'>Hard</Radio>
                                    <Radio colorScheme="blue" value='4'>Impossible</Radio>
                                </Stack>
                                </RadioGroup>
                                <Box hidden={state.simpleMode === true}>
                                    <RadioGroup colorScheme="blue" onChange={(v) => settingsChanged({rounds: Number(v)})} defaultValue='1'>
                                    <Stack direction='row'>
                                        <Text>Rounds:</Text>
                                        <Radio colorScheme="blue" value='1'>1</Radio>
                                        <Radio colorScheme="blue" value='3'>3</Radio>
                                        <Radio colorScheme="blue" value='5'>5</Radio>
                                        <Radio colorScheme="blue" value='10'>10</Radio>
                                    </Stack>
                                    </RadioGroup>
                                    <RadioGroup colorScheme="blue" onChange={setTimeLimit} defaultValue='-1'>
                                    <Stack direction='row'>
                                        <Text>Round time:</Text>
                                        <Radio colorScheme="blue" value='0.10'>0.10</Radio>
                                        <Radio colorScheme="blue" value='1'>1</Radio>
                                        <Radio colorScheme="blue" value='2'>2</Radio>
                                        <Radio colorScheme="blue" value='3'>3</Radio>
                                        <Radio colorScheme="blue" value='5'>5</Radio>
                                        <Radio colorScheme="blue" value='-1'>Unlimited</Radio>
                                    </Stack>
                                    </RadioGroup>
                                </Box>
                                <Checkbox defaultChecked onChange={(v: any) => settingsChanged({combineQU: v.target.checked})}>Use QU</Checkbox>
                                <Checkbox onChange={(v: any) => settingsChanged({boardSize: v.target.checked === true ? 5 : 4})}>Use big board (5x5)</Checkbox>
                                <Checkbox defaultChecked onChange={(v: any) => settingsChanged({includeRedCube: v.target.checked})}>Use bonus die</Checkbox>
                            </Stack>
                            </VStack>
                        </Center>
                    </ModalBody>
                    <ModalFooter>
                    <Button onClick={cancelled}>Cancel</Button>
                    <Button onClick={() => onConfirm(state)}>Accept</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default DialogNewGame;