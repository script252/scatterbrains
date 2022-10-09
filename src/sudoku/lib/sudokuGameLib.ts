import { CellData, SudokuGameState } from "./sudokuGameTypes";

import sudoku from "./sudoku-generator/sudoku";

export function init(difficulty: number): SudokuGameState {
        
    const sg = sudoku();
    const puzzleString: string = sg.generate(difficulty, false);
    const puzzle: string[] = puzzleString.split('');
    
    const answerString: string | false = sg.solve(puzzle, false);

    if(answerString === false) {
        console.error('Generated puzzle could not be solved!');
        return new SudokuGameState();
    }

    const answer: string[] = (answerString as string).split('');
    const puzzleFixed: number[] = puzzle.map((c:string) => c === '.' ? 0 : Number(c));
    const answerFixed: number[] = answer.map((c:string) => c === '.' ? 0 : Number(c));

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
        highlighted: [],
        showVictory: false
    };

    return initialState;
}

function checkForVictory(gs: SudokuGameState): SudokuGameState {

    return {
        ...gs,
        showVictory: !gs.cells.some(((cell: CellData) => cell.value !== cell.answer))
    };
}

export function onCellClicked(cell: CellData, gameState: SudokuGameState): SudokuGameState {

    const clusterCells = findCellClusterCells(cell, gameState).map(c => c.id);
    const rowCells = findCellRowCells(cell, gameState).map(c => c.id);
    const colCells = findCellColCells(cell, gameState).map(c => c.id);;

    const gs = {
        ...gameState,
        selected: cell.id,
        highlighted: [...clusterCells, ...rowCells, ...colCells],
    }

    return gs;
}

export function onEnteredInput(cell: CellData, value: number, gameState: SudokuGameState): SudokuGameState {

    if(gameState.selected === null)
        return gameState;
    
    const gs = {
        ...gameState,
        cells: [...gameState.cells.map((cell: CellData) => (cell.id === gameState.selected as number) ? {...cell, value: value} : cell)],
    }

    return checkForVictory(gs);
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

export function saveGameState(gs: SudokuGameState): SudokuGameState {
    localStorage.setItem('sudokuGameState', JSON.stringify(gs));
    return gs;
}

export function loadGameState(gameState: SudokuGameState): SudokuGameState {

    try {
        // Set game state from saved value (if there is one)
        const loadedState: string = localStorage.getItem('sudokuGameState') || '';
        const loadedStateParsed = JSON.parse(loadedState) || gameState;
        return loadedStateParsed || gameState;
    } catch (err) {
        return gameState;
    }
}