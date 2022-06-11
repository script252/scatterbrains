import { CellData, SudokuGameState } from "./sudokuGameTypes";
import { makepuzzle, solvepuzzle/*, ratepuzzle*/ } from "sudoku";

export function init(difficulty: any): SudokuGameState {
    
    const puzzle: number[] = makepuzzle();
    const answer: number[] = solvepuzzle(puzzle);

    const puzzleFixed: number[] = puzzle.map((c:number) => c === 0 ? 9 : c);
    const answerFixed: number[] = answer.map((c:number) => c === 0 ? 9 : c);

    console.log(puzzle, answer);

    // Generate and fill cells based on difficulty
    const emptyCells = new Array<any>(81)
        .fill(null)

    const getClusterId = (col: number, row: number): number => {
        const colClust = Math.floor((col) / 3);
        const rowClust = Math.floor((row) / 3);
        
        return rowClust + (colClust * 3);
    }

    const initialState: SudokuGameState = {
        showErrors: true,
        cells: emptyCells.map((cell, index:number) => {
            const row: number = Math.floor(index / 9);
            const col: number = Math.floor(index % 9);
            return {id: index, col: col, row: row, value: puzzleFixed[index], answer: answerFixed[index], clusterId: getClusterId(col, row)}
        }),
        selected: null,
        highlighted: []
    }
    
    return initialState;
}

export function onCellClicked(cell: CellData, gameState: SudokuGameState): SudokuGameState {

    const clusterCells = findCellClusterCells(cell, gameState).map(c => c.id);
    const rowCells = findCellRowCells(cell, gameState).map(c => c.id);
    const colCells = findCellColCells(cell, gameState).map(c => c.id);;

    const gs = {
        ...gameState,
        selected: cell.id,
        highlighted: [...clusterCells, ...rowCells, ...colCells]
    }

    return gs;
}

export function onEnteredInput(cell: CellData, value: number, gameState: SudokuGameState): SudokuGameState {

    if(gameState.selected === null)
        return gameState;
    
    const gs = {
        ...gameState,
        cells: [...gameState.cells.map((cell: CellData) => (cell.id === gameState.selected as number) ? {...cell, value: value} : cell)]//.splice(gameState.selected as number, 1, {...cell, value: value})]
    }

    return gs;
}

function findCellClusterCells(cell: CellData, gs: SudokuGameState): CellData[] {
    return gs.cells.filter((c: CellData, i: number) => c.clusterId === cell.clusterId);
}

function findCellRowCells(cell: CellData, gs: SudokuGameState): CellData[] {
    return gs.cells.filter((c: CellData, i: number) => c.row === cell.row);
}

function findCellColCells(cell: CellData, gs: SudokuGameState): CellData[] {
    return gs.cells.filter((c: CellData, i: number) => c.col === cell.col);
}