import { Box, Text } from "@chakra-ui/react";
import "./cell.scss";

// A single sudoku game cell
function Cell(props: any) {

    const { onClick, value, /*answer,*/ isSelected, isHighlighted, isError="false", debugText } = props;

    const getBgColor = () => {
        if(isSelected === true)
            return "cyan.200";
        if(isHighlighted === true)
            return "cyan.100";
        return "white";
    }

    const cellStyle = {
        width: "100%", //size,
        height: "100%", //size,
        //minWidth: size,
        bgColor: getBgColor(),
        border: '1px',
        borderColor: 'gray.500',
        color: isError ? "red" : "black",
        //lineHeight: "normal",
        display: "flex",
        
        //justifyContent: "center",
    }

    return (
        <Box {...cellStyle} userSelect="none" onClick={onClick}>
            {value === 0 && (<Text fontSize="min(5vw, 32pt)" m="auto" visibility="hidden">0</Text>)}
            {value !== 0 && (<Text fontSize="min(5vw, 32pt)" m="auto">{value}</Text>)}
            {/* {answer !== 0  && value !== answer && (<Text fontSize="3xl">{answer}</Text>)} */}
            {debugText && (<Text fontSize="100%">{debugText}</Text>)}
        </Box>
    );
}

export default Cell;