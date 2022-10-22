export enum ECellEdge {
    topLeft = 0,
    top = 1,
    topRight = 2,
    left = 3,
    center = 4,
    right = 5,
    bottomLeft = 6,
    bottom = 7,
    bottomRight = 8,
    none = 9,
}

export class CellData {
    id: number|null = null;
    value: number|null = null;
    answer: number|null = null;
    clusterId: number|null = null;
    col: number|null = null;
    row: number|null = null;
    edgeType: ECellEdge = ECellEdge.none;
    notes: number[] = [1,2,3,4,5,6,7,8,9];
}

export class SudokuGameState {
    showErrors: boolean = false;
    cells: CellData[] = [];
    selected: number|null = null;
    highlighted: (number|null)[] = [];
    showVictory: boolean = false;
    noteMode: boolean = false;
    showNewGame: boolean = false;
}

export enum EDifficulty {
    easy = '62',
    medium = '53',
    hard = '44',
    harder = '35',
    insane = '26',
    inhuman = '17',
    cancel = 'cancel',
}

export class NewGameSettings {
    difficulty: EDifficulty = EDifficulty.easy;
    highlightErrors: boolean = true;
}