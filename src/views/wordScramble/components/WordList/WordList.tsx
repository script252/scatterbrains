import { Box, SimpleGrid } from "@chakra-ui/layout";
import React from "react";

function WordList(props: any) {
    return (

            <Box bg='gray.800' w="100%" h="10rem" overflowY="auto">
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