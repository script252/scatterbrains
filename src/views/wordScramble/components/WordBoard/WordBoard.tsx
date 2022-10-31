import { Container, SimpleGrid } from "@chakra-ui/layout";
import { useState } from "react";
import { CellData, WordScrambleGameState } from "../../lib/wordScrambleTypes";
import Cell from "../Cell/Cell";
import * as WordScrambleLib from '../../lib/wordScrambleLib';


function WordBoard(props: any) {

    const {gameState, onStateChange = () => null, cellSize=52, locked=false}: {
        gameState: WordScrambleGameState, 
        onStateChange: any, 
        onSelectionComplete: any,
        cellSize: number, 
        locked: boolean
    } = props;

    const [dragging, setDragging] = useState(false);

    // OPTIMIZE: sets would be faster
    const isCellSelected = (id: number|null) => gameState.selected.some((c:number|null) => c === id);
    const isCellScored = (id: number|null) => gameState.lastScoredWord.some((c:number|null) => c === id);
    const isCellWrong = (id: number|null) => gameState.lastWrongWord.some((c:number|null) => c === id);

    const getCellIdAtLocation = (clientX: number, clientY: number) => {
        const elem = document.elementFromPoint(clientX, clientY);
        const cellId:number = elem?.id ? Number(elem?.id) : -1;
        return cellId;
      }

    const onClick = (cell: CellData, gs: WordScrambleGameState, dragging: boolean = false) => {
        //console.log('onClick, dragging: ', dragging);
        if(locked === true) return;
        setDragging(dragging);
        const clearedScored = WordScrambleLib.clearSelected(gs, false, true, true);
        onStateChange(WordScrambleLib.saveGameState(WordScrambleLib.onCellClicked(cell, clearedScored, dragging)));
    }
  
    const onTouchStart = (e: any) => {
        if(locked === true) return;
        if(dragging === false) {
            //console.log('onTouchStart: single click', e);
            const cellId = getCellIdAtLocation(e.touches[0].clientX, e.touches[0].clientY);
            if(cellId !== -1) {
            const clearedScored = WordScrambleLib.clearSelected(gameState, false, true, true);
            onStateChange(WordScrambleLib.saveGameState(WordScrambleLib.onCellClicked(gameState.cells[cellId], clearedScored, false)));
            }
        }
    }
  
    const onTouchDrag = (e: any) => {
      //console.log('onTouchDrag');
      if(locked === true) return;
      const cellId = getCellIdAtLocation(e.touches[0].clientX, e.touches[0].clientY);
      if(cellId !== -1) {
        onClick(gameState.cells[cellId], gameState, true);
      }
    }
  
    const onTouchEnd = (e: any) => {
        if(locked === true) return;
        if(dragging === true) {
            //console.log('onTouchEnd', e);
            setDragging(false);
            onSelectionComplete();
        }
        e.preventDefault();  // Don't trigger a mouse click event
    }
  
    const onMouseUp = (e: any) => {
        if(locked === true) return;
        if(dragging) {
            //console.log('onDragEnd', e);
            onSelectionComplete();
        }
    }
  
    const onMouseDown = (e: any, cell: CellData) => {
      //console.log('onDragStart', e);
      if(locked === true) return;
      onClick(cell, gameState, false);
      
      e.preventDefault();
    }

    const onSelectionComplete = () => {
        onStateChange(WordScrambleLib.saveGameState(WordScrambleLib.onSelectionComplete(gameState)));
    }

    return (
        <Container maxW="100%" className="cell-grid-container" 
                      m="0" p="0" mt="1rem" bgColor="gray.700" borderRadius="0.5rem">
            <SimpleGrid 
            spacing={0} columns={gameState.gameSettings.boardSize} 
            gap={4} p="4px" className="cell-grid" width="100%" 
            overflow="hidden"
            onTouchMove={onTouchDrag}
            onTouchEnd={onTouchEnd}
            onTouchStart={onTouchStart}
            >
                {gameState.cells.map((cell: CellData, index: number) => {
                    return (
                        <Cell 
                            key={index} 
                            {...cell}
                            isSelected={ isCellSelected(index) }
                            isScored={ isCellScored(index) }
                            isWrong={ isCellWrong(index) }
                            size={cellSize+"px"} 
                            //onClick={(e: any) => {console.log('Cell onClick'); onClick(cell, gameState)}}
                            onDrag={(e: any) => onClick(cell, gameState, true)}
                            onMouseUp={(e:any) => onMouseUp(e)}
                            onMouseDown={(e: any) => onMouseDown(e, cell)}
                            // debugText={cell.id}
                        ></Cell>
                    )
                })}
            </SimpleGrid>
        </Container>
    );
}

export default WordBoard;