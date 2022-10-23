import { ensureFieldsPresent } from "../../../lib/utilities";
import { CellData, NewGameSettings, standardCubes, WordScrambleGameState } from "./wordScrambleTypes";

export function init(settings: NewGameSettings): WordScrambleGameState {
    
    console.log('Starting new word scramble game:', settings);

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

export function onCellClicked(cell: CellData, gameState: WordScrambleGameState): WordScrambleGameState {
    const gs = {
        ...gameState,
        selected: [...gameState.selected, cell.id],
    }

    return gs;
}

export function saveGameState(gs: WordScrambleGameState): WordScrambleGameState {
    localStorage.setItem('wordScrambleGameState', JSON.stringify(gs));
    return gs;
}

export function loadGameState(gameState: WordScrambleGameState): WordScrambleGameState {

    try {
        // Set game state from saved value (if there is one)
        const loadedState: string = localStorage.getItem('wordScrambleGameState') || '';
        const loadedStateParsed: WordScrambleGameState = JSON.parse(loadedState) as WordScrambleGameState;

        const fieldsFilled = ensureFieldsPresent(loadedStateParsed, new WordScrambleGameState(), WordScrambleGameState);

        return fieldsFilled;
    } catch (err) {
        console.warn('No save state found, generating new game', gameState);
        return gameState;
    }
}