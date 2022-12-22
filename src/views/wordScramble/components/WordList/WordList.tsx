import { Box, Flex, SimpleGrid, Spacer, Text } from "@chakra-ui/layout";
import React, {useLayoutEffect, useRef, useState} from "react";
import { Word } from "../../lib/wordScrambleTypes";

function WordList(props: any) {

    const {foundWords = [], notFoundWords = [], showNotFound = false, onClickWord = (word: Word) => {}}: {foundWords: Word[], notFoundWords: Word[], showNotFound: boolean, onClickWord:(word: Word)=>void} = props;

    const scrollBox = useRef<HTMLDivElement>(null);

    const [count, setCount] = useState(0);

    useLayoutEffect(()=> {
        if(scrollBox?.current !== null) {
            if(foundWords.length > count) {
                scrollBox.current.scrollTop = Number.MAX_SAFE_INTEGER;
                setCount(foundWords.length);
            }
        }
    }, [foundWords, notFoundWords, count]);

    return (
        <Box ref={scrollBox} bg='gray.800' w="100%" h="10rem" overflowY="auto" borderRadius="0.5rem" scrollBehavior="auto">
            <SimpleGrid columns={[2, 2, 2]} spacing={0}>
                {showNotFound && notFoundWords.map((word: Word, index: number) => {
                    return (
                        <Box key={index} onClick={() => onClickWord(word)}>
                            <Flex pl='1rem' pr='1rem'><Text color="gray.400">{word.wordString}</Text><Spacer></Spacer><Text color={word.hasBonus ? 'red.600' : 'gray.600'}>{word.score}</Text></Flex>
                        </Box>
                        );
                })}
                {foundWords.map((word: Word, index: number) => {
                    return (
                        <Box key={index} onClick={() => onClickWord(word)}>
                            <Flex pl='1rem' pr='1rem'><Text color="gray.100">{word.wordString}</Text><Spacer></Spacer><Text color={word.hasBonus ? 'red.300' : 'gray.100'}>{word.score}</Text></Flex>
                        </Box>
                        );
                })}
            </SimpleGrid>
        </Box>
    );
}

export default WordList;