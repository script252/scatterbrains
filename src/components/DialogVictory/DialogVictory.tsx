import React from 'react';
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Center } from "@chakra-ui/react";
import { Button, Text } from "@chakra-ui/react";

function DialogVictory(props: any) {
    const { onClose } = useDisclosure();
  
    const { gameState, onCloseVictory } = props;

    const closeVictory = () => {
        onCloseVictory();  // Could pass back a 'play another game' option here
        onClose();
    }

    return (
      <>  
        <Modal onClose={onClose} isOpen={gameState.showVictory} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>You won!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Center>
                    <Text>It took you {gameState.turns} turns to match all the cards</Text>
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