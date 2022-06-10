import { Box, Text } from "@chakra-ui/react";
import "./cell.scss";

// A single sudoku game cell
function Cell(props: any) {

    const { onClick, value, isSelected, size = "2rem" } = props;

    const cellStyle = {
        width: size,
        height: size,
        minWidth: size,
        bgColor: "white",
        border: '1px',
        borderColor: 'gray.500',
        color: "black",
        lineHeight: "1"
    }

    const getStyles = () => {
        return ""
    }

    return (
        <Box {...cellStyle} onClick={onClick}>
            <Text>{value}</Text>
        </Box>
    );
}

export default Cell;