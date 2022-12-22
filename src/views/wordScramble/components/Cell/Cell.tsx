import { Box, Text } from "@chakra-ui/react";
import "./cell.scss";

// A single sudoku game cell
function Cell(props: any) {

    const { id, onClick, onDrag, onMouseDown, onMouseUp, value, isSelected, isScored, isWrong, isBonus, isHighlighted, debugText } = props;

    const style = [
        "cell letter", 
        isBonus ? " bonus" : "",
        isHighlighted ? " highlighted" : "",
        isSelected ? " selected" : "", 
        isScored ? " flash-word-score" : "", 
        isWrong ? " flash-word-wrong" : "",
    ].join('');

    const onMouseEnter = (e: any) => {
        if(e?.buttons === 1) {
            onDrag(e);
        }
    }

    return (
        <Box userSelect="none" m="0"
            
            position="relative" pointerEvents="all" id={id} className={style}>
            
            {value !== undefined && (<Text className="letter-circle" fontSize="min(10vw, 44pt)" m="auto" pointerEvents="none">{value}</Text>)}
            {debugText && (<Text fontSize="100%">{debugText}</Text>)}
            
            <Box 
                onClick={onClick} onMouseDown={onMouseDown} onMouseEnter={onMouseEnter} onMouseUp={onMouseUp}
                borderRadius='full' m="25%" position="absolute" h="50%" w="50%">
            </Box>
        </Box>
    );
}

export default Cell;