import { SudokuGameState } from "./sudokuGameTypes";

export function init(difficulty: any): SudokuGameState {
    
    // Generate and fill cells based on difficulty
    
    const emptyRow = [null, null, null, null, null, null, null, null, null];
    const someNumbers = [9, null, null, null, null, 4, null, 1, null];
    const emptyCells = [someNumbers, emptyRow, emptyRow, emptyRow, emptyRow, emptyRow, emptyRow, emptyRow, emptyRow]

    const initialState: SudokuGameState = {
        cells: emptyCells
    }
    
    return initialState;
}

export function onCellClicked(cell: any, gameState: SudokuGameState): SudokuGameState {
    return gameState;
}