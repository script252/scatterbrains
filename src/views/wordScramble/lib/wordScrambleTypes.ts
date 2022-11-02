export const standardCubes: string[] = [
    "AAEEGN", "ABBJOO", "ACHOPS", "AFFKPS",
    "AOOTTW", "CIMOTU", "DEILRX", "DELRVY",
    "DISTTY", "EEGHNW", "EEINSU", "EHRTVW",
    "EIOSST", "ELRTTY", "HIMNQU", "HLNNRZ"
];

export const bigCubes: string[] = [
    "QBZJXK", "TOUOTO", "OVWRGR", "AAAFSR", "AUMEEG",
    "HHLRDO", "NHDTHO", "LHNROD", "AFAISR", "YIFASR",
    "TELPCI", "SSNSEU", "RIYPRH", "DORDLN", "CCWNST",
    "TTOTEM", "SCTIEP", "EANDNN", "MNNEAG", "UOTOWN",
    "AFAEEE", "YIFPSR", "EEEEMA", "ITITIE", "ETILIC",
];

export const challengeCube: string = "IQMKLU";

export const CellDirs = new Map([
    ['up', [0, -1]],
    ['upRight', [1, -1]],
    ['right', [1, 0]],
    ['downRight', [1, 1]],
    ['down', [0, 1]],
    ['downLeft', [-1, 1]],
    ['left', [-1, 0]],
    ['upLeft', [-1, -1]],
]);

export const DirStrings = [
    'up',
    'upRight',
    'right',
    'downRight',
    'down',
    'downLeft',
    'left',
    'upLeft'
];

export type CellDir = number[];

export class CellData {
    id: number = -1;
    value: string = '';
    col: number = -1;
    row: number = -1;
    isBonus?: boolean = false;
}

// Word scoring for length
export const wordScores = [0,0,0,1,1,2,3,5,11];

export class Word {
    id: string = "";
    wordString: string = "";
    wordCellIndices: number[] = [];
    score: number = 0;
    hasBonus: boolean = false;
}

export class ScoreState {
    // So we can quickly check for already added words
    // This doesn't convert to json!
    discoveredWordsSet: Set<string> = new Set();
    // Sets must be converted in order to save,
    // this is a copy of discoveredWordsSet
    discoveredWords: string[] = [];
    //discoveredWordCells?: number[][] = [];
    //missedWords: string[] = [];
    turnScore: number = 0;
    found: number = 0;
    wordsInBoard: number = 0;

    foundWords: Word[] = [];
    missedWords: Word[] = [];
}

export class TurnScore {
    turnScore: number = 0;
    found: number = 0;
    wordsInBoard: number = 0;

}

export class WordScrambleGameState {
    gameSettings: NewGameSettings = new NewGameSettings();
    cells: CellData[] = [];
    selected: number[] = [];
    highlighted: number[] = [];     // For when a selection is made by the game: clicking on the word list
    lastScoredWord: number[] = [];
    lastWrongWord: number[] = [];
    showVictory: boolean = false;
    showNewGame: boolean = false;
    currentTurn: number = 0;
    turnHasEnded: boolean = false;
    timer: number = 100;
    gameOver: boolean = false;
    score: ScoreState[] = [new ScoreState()];
    possibleWordCount: number = -1;
    //possibleWords: string[] = [];
    possibleWords: Word[] = [];  // Every possible combination of valid words. Includes duplicate words.
}

export class NewGameSettings {
    boardSize: number = 4;
    timed: boolean = true;
    timeLimit: number = 60;  // Seconds
    rounds: number = 3;
    combineQU: boolean = true;
    includeRedCube: boolean = true;
}