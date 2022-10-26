import { Box, SimpleGrid } from "@chakra-ui/layout";
import React, {useLayoutEffect, useRef} from "react";

function WordList(props: any) {

    const scrollBox = useRef<HTMLDivElement>(null);

    useLayoutEffect(()=> {
        if(scrollBox?.current !== null) {
            scrollBox.current.scrollTop = 1000;
        }
    }, [props.children]);

    return (

            <Box ref={scrollBox} bg='gray.800' w="100%" h="10rem" overflowY="auto" borderRadius="0.5rem" scrollBehavior="auto">
                <SimpleGrid columns={[2, 2, 2]} spacing={0}>
                    {React.Children.map(props.children, (word, index) => {
                        return (
                            <Box>{word}</Box>
                            );
                    })}
                </SimpleGrid>
            </Box>
        
    );
}

export default WordList;