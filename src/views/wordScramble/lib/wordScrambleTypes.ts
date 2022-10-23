export const standardCubes: string[] = [
    "AAEEGN", "ABBJOO", "ACHOPS", "AFFKPS",
    "AOOTTW", "CIMOTU", "DEILRX", "DELRVY",
    "DISTTY", "EEGHNW", "EEINSU", "EHRTVW",
    "EIOSST", "ELRTTY", "HIMNQU", "HLNNRZ"
];

export const CellDirs = {
    up: [0, -1],
    upRight: [1, -1],
    right: [1, 0],
    downRight: [1, 1],
    down: [0, 1],
    downLeft: [-1, 1],
    left: [-1, 1],
    upLeft: [-1, -1],
}

export interface CellDir {
    colAndRow: number[];
}

export class CellData {
    id: number|null = null;
    value: string = '';
    col: number|null = null;
    row: number|null = null;
}

export class WordScrambleGameState {
    gameSettings: NewGameSettings = new NewGameSettings();
    cells: CellData[] = [];
    selected: (number|null)[] = [];
    showVictory: boolean = false;
    showNewGame: boolean = false;
}

export class NewGameSettings {
    boardSize: number = 4;
    timed: boolean = true;
    timeLimit: number = 60;  // Seconds
}