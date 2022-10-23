import { Box, Text } from "@chakra-ui/react";
import "./cell.scss";

// A single sudoku game cell
function Cell(props: any) {

    const { id, onClick, value, isSelected, debugText } = props;

    const getBgColor = () => {
        if(isSelected === true)
            return "cyan.200";
        return "lightgray";
    }

    const cellStyle = {
        width: "100%",
        height: "100%",
        bgColor: getBgColor(),
        border: '1px',
        borderColor: 'gray.500',
        display: "flex",
    }

    const onMouseEnter = (e: any) => {
        if(e?.buttons === 1) {
            onClick(e);
        }
    }

    return (
        <Box {...cellStyle} userSelect="none" 
            onClick={onClick} onMouseDown={onClick} onMouseEnter={onMouseEnter} 
            position="relative" pointerEvents="all" id={id} className="letter">
            
            {value !== undefined && (<Text className="letter-circle" fontSize="min(10vw, 44pt)" m="auto" pointerEvents="none">{value}</Text>)}
            {debugText && (<Text fontSize="100%">{debugText}</Text>)}
            
        </Box>
    );
}

export default Cell;