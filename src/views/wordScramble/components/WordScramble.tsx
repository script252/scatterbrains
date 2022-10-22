import React from 'react';
import './WordScramble.scss';
import { Center, Text, Box } from '@chakra-ui/layout';

function WordScramble(props: any) {

  return (
      <Box className="word-scramble">
          <Center>
            <Text fontSize="md"></Text>
          </Center>
      </Box>
  );
}

export default WordScramble;