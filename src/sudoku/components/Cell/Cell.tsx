import { Box, Text } from "@chakra-ui/react";
import "./cell.scss";

// A single sudoku game cell
function Cell(props: any) {

    const { onClick, value, /*answer,*/ isSelected, isHighlighted, isError="false", size = "2rem", debugText } = props;

    const getBgColor = () => {
        if(isSelected === true)
            return "cyan.200";
        if(isHighlighted === true)
            return "cyan.100";
        return "white";
    }

    const cellStyle = {
        width: size,
        height: size,
        minWidth: size,
        bgColor: getBgColor(),
        border: '1px',
        borderColor: 'gray.500',
        color: isError ? "red" : "black",
        lineHeight: "normal",
    }

    return (
        <Box {...cellStyle} userSelect="none" onClick={onClick}>
            {value !== 0 && (<Text fontSize="3xl">{value}</Text>)}
            {/* {answer !== 0  && value !== answer && (<Text fontSize="3xl">{answer}</Text>)} */}
            {debugText && (<Text fontSize="md">{debugText}</Text>)}
        </Box>
    );
}

export default Cell;