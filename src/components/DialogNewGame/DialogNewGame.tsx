import React from 'react';
import { useDisclosure } from "@chakra-ui/hooks";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Box, Center } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";

function DialogNewGame(props: any) {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    const { onSizeSelected } = props;

    const selectedSize = (rows: number, columns: number, onClose: any) => {
        onSizeSelected(rows, columns);
        onClose();
    }

    return (
      <>
        <Box m={4}>
        <Button colorScheme='teal' onClick={onOpen}>New Game</Button>
  
        <Modal onClose={onClose} isOpen={isOpen} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Select Size</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                <Center>
                    <Button colorScheme='teal' onClick={() => selectedSize(3, 4, onClose)}>3x4</Button>
                    <Button colorScheme='teal' onClick={() => selectedSize(4, 4, onClose)}>4x4</Button>
                    <Button colorScheme='teal' onClick={() => selectedSize(6, 6, onClose)}>6x6</Button>
                    <Button colorScheme='teal' onClick={() => selectedSize(8, 8, onClose)}>8x8</Button>
                    <Button colorScheme='teal' onClick={() => selectedSize(16, 16, onClose)}>16x16</Button>
                </Center>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        </Box>
      </>
    )
}

export default DialogNewGame;