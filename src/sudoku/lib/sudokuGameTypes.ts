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

export interface CellData {
    id: number,
    value: number|null,
    answer: number,
    clusterId: number,
    col: number,
    row: number,
    edgeType: ECellEdge,
    notes: number[],
}

export class SudokuGameState {
    showErrors: boolean = false;
    cells: CellData[] = [];
    selected: number|null = null;
    highlighted: (number|null)[] = [];
    showVictory: boolean = false;
}

export enum ENewGameDialogResult {
    easy = '62',
    medium = '53',
    hard = '44',
    harder = '35',
    insane = '26',
    inhuman = '17',
    cancel = 'cancel',
}