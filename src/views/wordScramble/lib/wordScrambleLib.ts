import { ensureFieldsPresent } from "../../../lib/utilities";
import { findWordsFast } from "./cellUtilitiesFast";
import { CellData, CellDirs, CellDir, NewGameSettings, standardCubes, WordScrambleGameState, DirStrings, wordScores, TurnScore, ScoreState } from "./wordScrambleTypes";

const words: string[] = require('an-array-of-english-words');

function createScores(settings: NewGameSettings): ScoreState[] {

    let scoreStates: ScoreState[] = [];
    for(let i = 0; i < settings.rounds; i++) {
        scoreStates.push(new ScoreState());
        console.log(scoreStates);
        scoreStates[i].discoveredWordsSet.has('bob');
    }

    return scoreStates;
}

export function init(settings: NewGameSettings): WordScrambleGameState {

    // Generate and fill cells based on difficulty
    const emptyCells = new Array<any>(settings.boardSize * settings.boardSize)
        .fill(new CellData());

    const rolledCubes = getRolledCubes();

    const initialState: WordScrambleGameState = {
        ...new WordScrambleGameState(),
        gameSettings: {...settings},
        score: createScores(settings),
        cells: emptyCells.map((cell, index:number) => {
            const row: number = Math.floor(index / settings.boardSize);
            const col: number = Math.floor(index % settings.boardSize);
            const letter = rolledCubes[index]
            return {
                id: index, 
                col: col, 
                row: row, 
                value: addQU(settings, letter)
            } as CellData;
        }),
    };

    console.log('init', initialState);
    return initialState;
}

function addQU(settings: NewGameSettings, letter: string) {
    if(settings.combineQU === true) {
        return letter === 'Q' ? 'QU' : letter;   // UGLY hack to add QU
    }
    return letter;
}

export function roll(gameState: WordScrambleGameState): WordScrambleGameState {

    console.log(gameState.gameSettings);

    if(gameState.currentTurn >= gameState.gameSettings.rounds - 1) {
        const gs: WordScrambleGameState = {
            ...gameState,
            gameOver: true,
            showVictory: true
        };

        return gs;
    }

    const rolledCubes = getRolledCubes();
    const gs: WordScrambleGameState = {
        ...gameState,
        gameSettings: gameState.gameSettings,
        selected: [],
        lastScoredWord: [],
        currentTurn: gameState.currentTurn + 1,
        turnHasEnded: false,
        cells: gameState.cells.map((cell, index:number) => {
            const row: number = Math.floor(index / gameState.gameSettings.boardSize);
            const col: number = Math.floor(index % gameState.gameSettings.boardSize);
            const letter = rolledCubes[index]
            return {
                id: index, 
                col: col, 
                row: row, 
                value: addQU(gameState.gameSettings, letter)
            } as CellData;
        }),
    };

    const words: string[] = findWords(gs);
    const gsWithWords: WordScrambleGameState = {
        ...gs,
        possibleWordCount: words.length, possibleWords: words,
    }
    return gsWithWords;
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
        const newWord: boolean = !getTurnScore(gameState).discoveredWordsSet.has(lowerCaseWord);
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
export function getAdjacentCell(cell: CellData, gameState: WordScrambleGameState, dir: CellDir): CellData | undefined {
    // console.log(`Getting adjacent to row/col: ${dir[0]}, ${dir[1]}`);
    return getCellAtCoord(cell.col + dir[0], cell.row + dir[1], gameState);
}

export function getAllValidAdjacentCellIndices(cell: CellData, gameState: WordScrambleGameState, omitList: Set<CellData> = new Set()): number[] {

    let adjCells: (number|undefined)[] = [];
    for(let i=0; i<8; i++) {
        const adj = getAdjacentCell(cell, gameState, CellDirs.get(DirStrings[i]) as number[])?.id
        
        if(adj !== undefined && !omitList.has(gameState.cells[adj]))
            adjCells.push(adj);
    }

    return adjCells as number[];
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
        getTurnScore(gs).discoveredWordsSet.add(word.toLowerCase());
        gs.lastScoredWord = [...gameState.selected];
        gs.score[gs.currentTurn] = calcTurnScore(gs, gs.score[gs.currentTurn]);
    } else {
        gs.lastWrongWord = [...gameState.selected];
    }

    return gs;
}

export function clearSelected(gameState: WordScrambleGameState, clearSelection: boolean = true, clearScored: boolean = true, clearWrong: boolean = true): WordScrambleGameState {
    return {
        ...gameState, 
        selected: clearSelection === true ? [] : [...gameState.selected], 
        lastScoredWord: clearScored === true ? [] : [...gameState.lastScoredWord],
        lastWrongWord: clearWrong === true ? [] : [...gameState.lastWrongWord],
    };
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
                return {...gameState, selected: [], lastWrongWord: [...gameState.selected]};
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
    getTurnScore(gs).discoveredWords = Array.from(getTurnScore(gs).discoveredWordsSet);

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
        fieldsFilled.score.map((s: ScoreState) => s.discoveredWordsSet = new Set<string>(s.discoveredWords));
        return fieldsFilled;
    } catch (err) {
        console.warn('No save state found, generating new game', gameState);
        return gameState;
    }
}

export function findWords(gameState: WordScrambleGameState): string[] {
    return findWordsFast(gameState, words.filter((w:string) => w.length <= gameState.cells.length && w.length > 2));
}

export function getCurrentTurnScore(gameState: WordScrambleGameState): TurnScore {
    const allScores: number[] = Array.from(getTurnScore(gameState).discoveredWordsSet).map((word: string) => wordScores[Math.min(word.length, 8)]);
    const turnScore = allScores.length > 0 ? allScores.reduce((prev: number, curr: number, index: number) => curr + prev) : 0;

    const found: number = getTurnScore(gameState).discoveredWordsSet.size;
    const wordsInBoard: number = gameState.possibleWordCount;

    return {
        turnScore: turnScore,
        found: found,
        wordsInBoard: wordsInBoard
    };
}

export function getTurnScore(gameState: WordScrambleGameState): ScoreState {
    return gameState.score[gameState.currentTurn];
}

export function calcTurnScore(gameState: WordScrambleGameState, score: ScoreState): ScoreState {

    const allScores: number[] = Array.from(score.discoveredWordsSet).map((word: string) => wordScores[Math.min(word.length, 8)]);
    const turnScore = allScores.length > 0 ? allScores.reduce((prev: number, curr: number, index: number) => curr + prev) : 0;

    const found: number = score.discoveredWordsSet.size;
    const wordsInBoard: number = gameState.possibleWordCount;

    return {
        turnScore: turnScore,
        found: found,
        wordsInBoard: wordsInBoard,
        discoveredWordsSet: score.discoveredWordsSet,
        discoveredWords: score.discoveredWords
    };
}