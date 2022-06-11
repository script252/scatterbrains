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