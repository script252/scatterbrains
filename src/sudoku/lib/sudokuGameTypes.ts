export interface CellData {
    id: number,
    value: number|null,
    answer: number,
    clusterId: number,
    col: number,
    row: number,
}

export interface SudokuGameState {
    showErrors: boolean,
    cells: CellData[],
    selected: number|null,
    highlighted: (number|null)[]
}

export enum ENewGameDialogResult {
    easy = 'easy',
    medium = 'medium',
    hard = 'hard',
    cancel = 'cancel',
}