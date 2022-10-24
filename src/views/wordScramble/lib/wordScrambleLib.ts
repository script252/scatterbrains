import { ensureFieldsPresent } from "../../../lib/utilities";
import { findAllWords } from "./cellUtilities";
import { CellData, CellDirs, CellDir, NewGameSettings, standardCubes, WordScrambleGameState } from "./wordScrambleTypes";

const words: string[] = require('an-array-of-english-words');
//const words: Map = new Map([wordsArray]);

export function init(settings: NewGameSettings): WordScrambleGameState {

    // Generate and fill cells based on difficulty
    const emptyCells = new Array<any>(settings.boardSize * settings.boardSize)
        .fill(new CellData());

    const rolledCubes = getRolledCubes();

    const initialState: WordScrambleGameState = {
        ...new WordScrambleGameState(),
        cells: emptyCells.map((cell, index:number) => {
            const row: number = Math.floor(index / settings.boardSize);
            const col: number = Math.floor(index % settings.boardSize);
            return {
                id: index, 
                col: col, 
                row: row, 
                value: rolledCubes[index], 
            } as CellData;
        }),
    };

    return initialState;
}

export function getRolledCubes(): string[] {
    const availableCubes = [...standardCubes];

    // This is terribly imperative
    let scrambledCubes = [];
    while(availableCubes.length > 0) {
        const randomFace:number = Math.round(Math.random() * 5);
        scrambledCubes.push(availableCubes.splice(Math.random() * availableCubes.length - 1, 1)[0][randomFace]);
    }

    return scrambledCubes;
}

function isWordValid(word: string, gameState: WordScrambleGameState): boolean {

    // Validation:
    // 3 letters min
    // exists in word list
    // isn't already in discovered word list
    const lowerCaseWord = word.toLowerCase();
    const minLength: boolean = lowerCaseWord.length > 2;
    if(minLength === true) {
        
        const newWord: boolean = !gameState.score.discoveredWordsSet.has(lowerCaseWord);
        if(newWord === true) {
            const isWord: boolean = words.some((dw:string) => {return lowerCaseWord === dw});
            return isWord === true;
        }
    }

    return false;
}

// May return undefined
function getCellAtCoord(col: number, row: number, gameState: WordScrambleGameState): CellData | undefined {
    const bSize = gameState.gameSettings.boardSize;
    if(col >= bSize || row >= bSize || col < 0 || row < 0)
        return undefined;

    const index = col + (row * bSize);
    return gameState.cells[index];
}

// May return undefined
function getAdjacentCell(cell: CellData, gameState: WordScrambleGameState, dir: CellDir): CellData | undefined {
    // console.log(`Getting adjacent to row/col: ${dir[0]}, ${dir[1]}`);
    return getCellAtCoord(cell.col + dir[0], cell.row + dir[1], gameState);
}

export function getAllValidAdjacentCellIndices(cell: CellData, gameState: WordScrambleGameState): number[] {
    
    //console.log('Dir values: ', Array.from(CellDirs.values()));

    // OPTIMIZE: doing a lot of copying in here
    const adjCells: (number|undefined)[] = Array.from(CellDirs.values())
        .map((value: number[]) => {
            const adj = getAdjacentCell(cell, gameState, value);
            
            // Don't add already selected cells?
            return adj?.id;
        });

    return adjCells.filter(c => c !== undefined) as number[];
}

function selectCell(cell: CellData, gameState: WordScrambleGameState): WordScrambleGameState {
    if(cell && !gameState.selected.some(s => s === cell?.id)) {
        const gs = {
            ...gameState,
            selected: [...gameState.selected, cell.id],
        }
        return gs;
    }
    return gameState;
}

export function getSelectedString(gameState: WordScrambleGameState): string {
    return gameState.selected.map(s => gameState.cells[s].value).join('');
}

export function onSelectionComplete(gameState: WordScrambleGameState, validate: boolean = true): WordScrambleGameState {

    const gs = {
        ...gameState,
        selected: []
    };

    const word: string = getSelectedString(gameState);
    const valid = validate === true ? isWordValid(word, gameState) : true;
    if(valid === true) {
        gs.score.discoveredWordsSet.add(word.toLowerCase());
        console.log('Found a valid word!', word);
        console.log('State:', gs);
    }

    return gs;
}

export function onCellClicked(cell: CellData, gameState: WordScrambleGameState, dragging: boolean = false): WordScrambleGameState {

    // Limit selection if we've started a chain
    if(gameState.selected.length > 0) {
        const latestCell = gameState.cells[gameState.selected[gameState.selected.length - 1]];
        const adjCells = new Set(getAllValidAdjacentCellIndices(latestCell, gameState));
        //console.log(`Adj cells, from starting cell id: ${latestCell.id}`, adjCells);

        // If cell has already been selected, and this is an individual
        // cell being added to the set, then clear the selection.
        // Otherwise, cut the selection chain back to the clicked cell
        if(gameState.selected.some((id:number)=> id === cell.id)) {
            if(dragging === false) {
                return {...gameState, selected: []};
            } else {
                // If dragging over the previous cell, clip selected
                const prevCell = gameState.selected.findIndex(s => s === cell.id);
                if(prevCell !== -1) {
                    const clipped: number[] = gameState.selected.slice(0, prevCell+1);
                    return {...gameState, selected: clipped};
                }
            }
        }

        if(adjCells.has(cell.id)) {
            const gs = selectCell(cell, gameState);
            
            // Need to test for individual click completions;
            // they are only considered complete if the word is valid
            if(isWordValid(getSelectedString(gs), gs)){
                if(dragging === false) {
                    return onSelectionComplete(gs, false);
                }
            }

            return gs;
        }

    } else {
        
        // Allow any cell if none already selected
        return selectCell(cell, gameState);
    }

    return gameState;
}

export function saveGameState(gs: WordScrambleGameState): WordScrambleGameState {
    
    // Stick set into array so it can be saved
    gs.score.discoveredWords = Array.from(gs.score.discoveredWordsSet);

    localStorage.setItem('wordScrambleGameState', JSON.stringify(gs));
    return gs;
}

export function loadGameState(gameState: WordScrambleGameState): WordScrambleGameState {

    try {
        // Set game state from saved value (if there is one)
        const loadedState: string = localStorage.getItem('wordScrambleGameState') || '';
        const loadedStateParsed: WordScrambleGameState = JSON.parse(loadedState) as WordScrambleGameState;

        const fieldsFilled: WordScrambleGameState = ensureFieldsPresent(loadedStateParsed, new WordScrambleGameState(), WordScrambleGameState);

        // Fill set with saved scored words
        fieldsFilled.score.discoveredWordsSet = new Set<string>(fieldsFilled.score.discoveredWords);
        findAllWords(fieldsFilled, words);
        return fieldsFilled;
    } catch (err) {
        console.warn('No save state found, generating new game', gameState);
        return gameState;
    }
}