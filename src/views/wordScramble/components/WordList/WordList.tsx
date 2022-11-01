import { Box, Flex, SimpleGrid, Spacer, Text } from "@chakra-ui/layout";
import React, {useLayoutEffect, useRef} from "react";
import { wordScores } from "../../lib/wordScrambleTypes";

function WordList(props: any) {

    const {foundWords = [], notFoundWords = [], showNotFound = false}: {foundWords: string[], notFoundWords: string[], showNotFound: boolean} = props;

    const scrollBox = useRef<HTMLDivElement>(null);

    useLayoutEffect(()=> {
        if(scrollBox?.current !== null) {
            scrollBox.current.scrollTop = 1000;
        }
    }, [foundWords, notFoundWords]);

    return (

            <Box ref={scrollBox} bg='gray.800' w="100%" h="10rem" overflowY="auto" borderRadius="0.5rem" scrollBehavior="auto">
                <SimpleGrid columns={[2, 2, 2]} spacing={0}>
                    {foundWords.map((word: string, index: number) => {
                        return (
                            <Box key={index}>
                                <Flex pl='1rem' pr='1rem'><Text color='gray.300'>{word}</Text><Spacer></Spacer><Text color="gray.100">{wordScores[Math.min(word.length, 8)]}</Text></Flex>
                            </Box>
                            );
                    })}
                    {showNotFound && notFoundWords.map((word: string, index: number) => {
                        return (
                            <Box key={index}>
                                <Flex pl='1rem' pr='1rem'><Text color='orange.300'>{word}</Text><Spacer></Spacer><Text color="gray.100">{wordScores[Math.min(word.length, 8)]}</Text></Flex>
                            </Box>
                            );
                    })}
                </SimpleGrid>
            </Box>
        
    );
}

export default WordList;