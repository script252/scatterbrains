import { Box, SimpleGrid, Text } from "@chakra-ui/react";
import "./cell.scss";

const bc = 'lightGray';
const dbc = 'black';

const edgeStyles: string[] = [
    `${dbc} ${bc} ${bc} ${dbc}`,
    `${dbc} ${bc} ${bc} ${bc}`,
    `${dbc} ${dbc} ${bc} ${bc}`,
    `${bc} ${bc} ${bc} ${dbc}`,
    `${bc} ${bc} ${bc} ${bc}`,
    `${bc} ${dbc} ${bc} ${bc}`,
    `${bc} ${bc} ${dbc} ${dbc}`,
    `${bc} ${bc} ${dbc} ${bc}`,
    `${bc} ${dbc} ${dbc} ${bc}`,
]

// A single sudoku game cell
function Cell(props: any) {

    const { onClick, value, isSelected, isHighlighted, notes, isError="false", edgeType, debugText } = props;

    const getBgColor = () => {
        if(isSelected === true)
            return "cyan.200";
        if(isHighlighted === true)
            return "cyan.100";
        return "white";
    }

    const cellStyle = {
        width: "100%", //"100%", //size,
        height: "100%", //size,
        //maxWidth: size,
        //minHeight: size,
        //minWidth: size,
        bgColor: getBgColor(),
        border: '1px',
        //borderStyle: edgeStyles[edgeType],
        borderColor: edgeStyles[edgeType], //'gray.500',
        color: isError ? "red" : "black",
        //lineHeight: "normal",
        display: "flex",
        
        //justifyContent: "center",
    }

    return (
        <Box {...cellStyle} userSelect="none" onClick={onClick} position="relative">
            {value === 0 && (<Text fontSize="min(4vw, 22pt)" m="auto" visibility="hidden">0</Text>)}
            {value !== 0 && (<Text fontSize="min(4vw, 22pt)" m="auto">{value}</Text>)}
            {/* {answer !== 0  && value !== answer && (<Text fontSize="3xl">{answer}</Text>)} */}
            {debugText && (<Text fontSize="100%">{debugText}</Text>)}
            {value === 0 && (
                <SimpleGrid columns={3} position="absolute" top="0" left="0" minH="100%" minW="100%">
                    {notes.map((note:number, i:number) => (
                        <Box w="100%" minH="2ch">
                            <Text fontSize="min(2vw, 8pt)" align="center" display={note ? 'block' : 'none'} key={i}>{note}</Text>
                        </Box>
                    ))}
                </SimpleGrid>
            )}
        </Box>
    );
}

export default Cell;


