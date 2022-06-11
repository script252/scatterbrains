import { Box, Button, SimpleGrid, Text } from "@chakra-ui/react";
//import "./cell-input-buttons.scss";

function CellInputButtons(props: any) {

    const { onClick, buttonSize = "144px" } = props;
    const numbers = [1,2,3,4,5,6,7,8,9];

    return (
        <Box>
            <SimpleGrid columns={3} spacing={0} m={0}>
            {numbers.map(((value: number) => {
                return (
                    <Box p={2} height={buttonSize} >
                        <Button width="100%" height="100%" colorScheme='teal' onClick={() => onClick(value)}><Text fontSize="md">{value}</Text></Button>
                    </Box>
                )
                })
            )}
            </SimpleGrid>
        </Box>
    );
}

export default CellInputButtons;