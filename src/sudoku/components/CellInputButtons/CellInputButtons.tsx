import { Box, Button, SimpleGrid, Text } from "@chakra-ui/react";
//import "./cell-input-buttons.scss";

function CellInputButtons(props: any) {

    const { onClick, buttonSize = "144px" } = props;
    const numbers = [1,2,3,4,5,6,7,8,9];

    return (
        <Box className="button-container" position="relative" width="70vh" height="25vh">
            <SimpleGrid columns={3} spacing={0} m="auto" height="100%">
            {numbers.map(((value: number) => {
                return (
                    <Box key={value} p={2} position="relative" height="100%" >
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