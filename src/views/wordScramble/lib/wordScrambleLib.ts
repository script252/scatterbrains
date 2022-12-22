import { ensureFieldsPresent } from "../../../lib/utilities";
import { CellData, CellDirs, CellDir, NewGameSettings, standardCubes, WordScrambleGameState, DirStrings, wordScores, ScoreState, bigCubes, challengeCube, Word, getDifficultyPercent } from "./wordScrambleTypes";

const words: string[] = require('an-array-of-english-words');

function createScores(settings: NewGameSettings): ScoreState[] {

    let scoreStates: ScoreState[] = [];
    for(let i = 0; i < settings.rounds; i++) {
        scoreStates.push(new ScoreState());
    }

    return scoreStates;
}

export function init(settings: NewGameSettings, quickRestart: boolean = false): WordScrambleGameState {

    // Generate and fill cells based on difficulty
    const emptyCells = new Array<any>(settings.boardSize * settings.boardSize)
        .fill(new CellData());

    const rolledCubes = getRolledCubes(settings.boardSize === 5, settings.includeRedCube);

    const initialState: WordScrambleGameState = {
        ...new WordScrambleGameState(),
        gameSettings: {...settings},
        score: quickRestart === true ? createScores(new NewGameSettings()) : createScores(settings),
        timer: 100,
        cells: emptyCells.map((cell, index:number) => {
            const row: number = Math.floor(index / settings.boardSize);
            const col: number = Math.floor(index % settings.boardSize);
            const letter = rolledCubes[0][index]
            return {
                id: index, 
                col: col, 
                row: row, 
                value: addQU(settings, letter),
                isBonus: rolledCubes[1] === index
            } as CellData;
        }),
    };

    //console.log('init', initialState);
    return initialState;
}

function addQU(settings: NewGameSettings, letter: string) {
    if(settings.combineQU === true) {
        return letter === 'Q' ? 'QU' : letter;   // UGLY hack to add QU
    }
    return letter;
}

// Loads a game if one is available.  Initializes new game if not.
export function startGame(startNew: boolean = false, quickRestartSettings?: NewGameSettings): Promise<WordScrambleGameState> {
    return new Promise<WordScrambleGameState>((resolve: any) => {
        const initialGameState: WordScrambleGameState = init(new NewGameSettings());

        // Don't initialize when just opening the new game dialog
        if(startNew === true) {
          resolve({...initialGameState, showNewGame: true});
          return;
        }
        
        const gs = quickRestartSettings === undefined ? 
            loadGameState(initialGameState as WordScrambleGameState) : 
            init(quickRestartSettings, true);

        if(gs.possibleWords.length <= 0) {
            console.log('Searching for words...');
            findWords(gs).then((words: Word[]) => {

                // Post-findWords
                const uniqueWords: Set<string> = new Set<string>(words.map((w:Word)=> w.wordString));
                console.log(`Found ${uniqueWords.size} unique words, ${words.length} possible word patterns.`);
                //console.log(words);
            
                const gsWithCounts = {...gs, showNewGame: startNew, possibleWordCount: uniqueWords.size, possibleWords: words}
                    
                // FIXME: imperative
                gsWithCounts.score[gsWithCounts.currentTurn] = calcTurnScore(gsWithCounts, gsWithCounts.score[gsWithCounts.currentTurn], 2);
                gsWithCounts.score[gsWithCounts.currentTurn].missedWords = words;
                
                saveGameState(gsWithCounts);
                //console.log('postInit', gsWithCounts);
                
                resolve(gsWithCounts);
            });
        } else {
            resolve({...gs, possibleWords: gs.possibleWords});
        }
    });
}

export function restartGame(settings: NewGameSettings): Promise<WordScrambleGameState> {
    return startGame(false, settings);//.then((gs) => roll(gs));
}

export function checkForWin(gameState: WordScrambleGameState): boolean {
    //const requiredPercentage: number = getDifficultyPercent(gameState.gameSettings.difficulty);
    const score = gameState.score[gameState.currentTurn];
    //const requiredWordCount: number = Math.round(requiredPercentage * score.wordsInBoard);

    // Player can win by either score or word count
    return score.found >= score.wordsNeededToWinCount || score.turnScore >= score.scoreNeededToWin;
}

export function roll(gameState: WordScrambleGameState): Promise<WordScrambleGameState> {
    return new Promise<WordScrambleGameState>((resolve: any) => {
        //console.log(gameState.gameSettings);

        // FIXME: should be in checkForWin
        if(gameState.currentTurn >= gameState.gameSettings.rounds - 1) {
            const gs: WordScrambleGameState = {
                ...gameState,
                gameOver: true,
                showVictory: true
            };

            resolve(gs);
        }

        const rolledCubes = getRolledCubes(gameState.gameSettings.boardSize === 5, gameState.gameSettings.includeRedCube);
        const gs: WordScrambleGameState = {
            ...gameState,
            gameSettings: gameState.gameSettings,
            selected: [],
            lastScoredWord: [],
            currentTurn: gameState.currentTurn + 1,
            turnHasEnded: false,
            timer: 100,
            cells: gameState.cells.map((cell, index:number) => {
                const row: number = Math.floor(index / gameState.gameSettings.boardSize);
                const col: number = Math.floor(index % gameState.gameSettings.boardSize);
                const letter = rolledCubes[0][index]
                return {
                    id: index, 
                    col: col, 
                    row: row, 
                    value: addQU(gameState.gameSettings, letter),
                    isBonus: rolledCubes[1] === index
                } as CellData;
            }),
        };

        findWords(gs).then((words: Word[]) => {

            // Post-findWords
            const uniqueWords: Set<string> = new Set<string>(words.map((w:Word)=> w.wordString));
            console.log(`Found ${uniqueWords.size} unique words, ${words.length} possible word patterns.`);
            //console.log(words);
        
            const gsWithCounts = {...gs, possibleWordCount: uniqueWords.size, possibleWords: words};
                
            // FIXME: imperative
            gsWithCounts.score[gsWithCounts.currentTurn] = calcTurnScore(gsWithCounts, gsWithCounts.score[gsWithCounts.currentTurn], 2);
            gsWithCounts.score[gsWithCounts.currentTurn].missedWords = words;
            
            saveGameState(gsWithCounts);
            console.log('postInit', gsWithCounts);
            
            resolve(gsWithCounts);
        });
    });
    // const uniqueWords: Set<string> = new Set<string>(words.map((w: Word) => w.wordString));
    // const gsWithWords: WordScrambleGameState = {
    //     ...gs,
    //     possibleWordCount: uniqueWords.size, possibleWords: words,
    // }

    // // FIXME: imperative
    // gsWithWords.score[gsWithWords.currentTurn] = calcTurnScore(gsWithWords, gsWithWords.score[gsWithWords.currentTurn], 2);
    // gsWithWords.score[gsWithWords.currentTurn].missedWords = words;

    //console.log('Rolled: ', gsWithWords);
    //return gsWithWords;
}

export function getRolledCubes(useBig: boolean = false, useBonus: boolean = false): [string[], number] {

    const cubes = useBig === true ? [...bigCubes] : [...standardCubes];
    const randomBonusIndex = Math.round(Math.random() * cubes.length - 1);
    const availableCubes = useBonus === true ? cubes.map((c:string, i:number) => i === randomBonusIndex ? challengeCube : c) : cubes;

    // This is terribly imperative
    let scrambledCubes = [];
    let bonusCubeIndex = -1;
    while(availableCubes.length > 0) {
        const randomFace:number = Math.round(Math.random() * 5);
        const randomCellIndex = Math.round(Math.random() * availableCubes.length - 1);
        const randomCube = availableCubes.splice(randomCellIndex, 1)[0];
        const end:number = scrambledCubes.push(randomCube[randomFace]);

        if(randomCube === challengeCube) {
            bonusCubeIndex = end - 1;
        }
    }

    return [scrambledCubes, bonusCubeIndex];
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

export function getSelectedHasBonus(gameState: WordScrambleGameState): boolean {
    return gameState.selected.some(s => gameState.cells[s].isBonus === true);
}

export function onSelectionComplete(gameState: WordScrambleGameState, validate: boolean = true): WordScrambleGameState {

    const gs = {
        ...gameState,
        selected: []
    };

    const word: string = getSelectedString(gameState);
    const valid = validate === true ? isWordValid(word, gameState) : true;
    
    if(valid === true) {
        getTurnScore(gs).foundWords.push(createWord(gameState.selected, gameState));
        getTurnScore(gs).discoveredWordsSet.add(word.toLowerCase());

        gs.lastScoredWord = [...gameState.selected];
        gs.score[gs.currentTurn] = calcTurnScore(gs, gs.score[gs.currentTurn], 2);
        gs.showVictory = checkForWin(gs);
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
    //console.log('Saved state: ', gs);
    return gs;  // Doesn't get changed
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

export function createWord(cellIds: number[], gs: WordScrambleGameState): Word {

    const newWord: Word = cellIds.reduce<Word>((prev: Word, curr: number, id: number) => {

        return {
            id: prev.id.toString().padStart(2, '0') + curr.toString().padStart(2, '0'),
            wordString: prev.wordString + gs.cells[curr].value,
            wordCellIndices: [...prev.wordCellIndices, curr],
            score: 0,
            hasBonus: prev.hasBonus || gs.cells[curr].isBonus === true
        };
    }, new Word());

    const scoredWord = {
        ...newWord,
        score: wordScores[Math.min(newWord.wordString.length, 8)] * (newWord.hasBonus === true ? 2 : 1),
    }

    return scoredWord;
}

const worker = new Worker('./webWorker.js', {name: 'RunFindWordsWorker', type: 'module'});

export function findWords(gameState: WordScrambleGameState): Promise<Word[]> {
    return new Promise((resolve: any) => {

        const dictionary = words.filter((w:string) => w.length <= gameState.cells.length && w.length > 2)
        //findWordsFast(gameState, dictionary);

        worker.onmessage = (e: any) => {
            if(e.data.type === 'findWordsResults') {
                //console.log('Got results: ', e.data.words);
                resolve(e.data.words);
            }
        }

        worker.postMessage({type: 'findWords', gameState: gameState, dictionary: dictionary});
    });
}

export function getTurnScore(gameState: WordScrambleGameState): ScoreState {
    return gameState.score[gameState.currentTurn];
}

export function calcMaxPossibleScore(gameState: WordScrambleGameState): number {

    let scores = new Map<string, number>();

    // Calculate highest possible score for every word
    gameState.possibleWords.forEach((word) => {
        const ex = scores.get(word.wordString);
        scores.set(word.wordString, Math.max(word.score, !!ex ? ex : 0));
    });

    return Array.from(scores.values()).reduce((prev, curr) => prev + curr);
}

// Calculate score totals for turn
export function calcTurnScore(gameState: WordScrambleGameState, score: ScoreState, bonusMultiplier: number = 1): ScoreState {

    const allScores: number[] = Array.from(score.discoveredWordsSet).map((word: string, index: number) => { 
        const hasBonus = score.foundWords ? score.foundWords[index].hasBonus === true : false;
        return wordScores[Math.min(word.length, 8)] * (hasBonus === true ? bonusMultiplier : 1);
    });
    const turnScore = allScores.length > 0 ? allScores.reduce((prev: number, curr: number, index: number) => curr + prev) : 0;
    const found: number = score.discoveredWordsSet.size;
    const wordsInBoard: number = gameState.possibleWordCount;

    const missedWords: Word[] = score.missedWords.filter((missed: Word) => !score.discoveredWordsSet.has(missed.wordString));

    // Need to find maximum possible score; this means if 
    // there are duplicate words with different scores,
    // only the larger one should be used
    const maxPossibleScore = calcMaxPossibleScore(gameState);
    //console.log('Max possible score: ', maxPossibleScore);

    const diffScale = getDifficultyPercent(gameState.gameSettings.difficulty);

    return {
        turnScore: turnScore,
        found: found,
        wordsInBoard: wordsInBoard,
        discoveredWordsSet: score.discoveredWordsSet,
        foundWords: score.foundWords,
        missedWords: missedWords,
        discoveredWords: score.discoveredWords,
        wordsNeededToWinCount: Math.round(wordsInBoard * diffScale),
        scoreNeededToWin: Math.round(maxPossibleScore * diffScale),
    };
}