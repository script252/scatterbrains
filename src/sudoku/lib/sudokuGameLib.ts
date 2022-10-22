import { CellData, ECellEdge, NewGameSettings, SudokuGameState } from "./sudokuGameTypes";

import sudoku from "./sudoku-generator/sudoku";
import { ensureFieldsPresent } from "../../lib/utilities";

export function init(settings: NewGameSettings): SudokuGameState {
    
    //console.log('Starting new sudoku game:', settings);

    const sg = sudoku();
    const puzzleString: string = sg.generate(Number(settings.difficulty), false);
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
        .fill(new CellData());

    const getClusterId = (col: number, row: number): number => {
        const colClust = Math.floor((col) / 3);
        const rowClust = Math.floor((row) / 3);
        
        return rowClust + (colClust * 3);
    }

    const initialState: SudokuGameState = {
        ...new SudokuGameState(),
        cells: emptyCells.map((cell, index:number) => {
            const row: number = Math.floor(index / 9);
            const col: number = Math.floor(index % 9);
            const clusterId = getClusterId(col, row);
            return {
                id: index, 
                col: col, 
                row: row, 
                value: puzzleFixed[index], 
                answer: answerFixed[index], 
                clusterId: clusterId,
                edgeType: ECellEdge.none,
                notes: [0, 0, 0, 0, 0, 0, 0, 0, 0],
                
                //debugText: getClusterId(col, row)
            } as CellData;
        }).map((cell, index:number, cells: CellData[]) => {

            const clusterCells = cells.filter((c: CellData) => c.clusterId === cell.clusterId);
            // Find index of same id cell in clusterCells
            const edgeIndex: number = clusterCells.findIndex(cc => cc.id === cell.id);

            return {
                ...cell,
                edgeType: edgeIndex,
                //debugText: edgeIndex
            }
        }),
        showErrors: settings.highlightErrors
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

export function onEnteredNote(cell: CellData, value: number, gameState: SudokuGameState): SudokuGameState {

    if(gameState.selected === null)
        return gameState;
    
    const getNoteToggleValue = (cellValue: number, value: number) => {
        return value === cellValue ? 0 : cellValue;
    }

    const gs = {
        ...gameState,
        cells: [...gameState.cells.map((cell: CellData) => (cell.id === gameState.selected as number) ? {...cell, notes: [...cell.notes.map((n, i) => i === (value - 1) ? getNoteToggleValue(value, n) : n)]} : cell)],
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
        const loadedStateParsed: SudokuGameState = JSON.parse(loadedState) as SudokuGameState || gameState;

        ensureFieldsPresent(loadedStateParsed, new SudokuGameState(), SudokuGameState);

        return loadedStateParsed || gameState;
    } catch (err) {
        return gameState;
    }
}