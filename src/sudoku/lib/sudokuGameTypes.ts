export interface CellData {
    id: number,
    value: number|null,
    answer: number,
    clusterId: number,
    col: number,
    row: number,
}

export class SudokuGameState {
    showErrors: boolean = false;
    cells: CellData[] = [];
    selected: number|null = null;
    highlighted: (number|null)[] = [];
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