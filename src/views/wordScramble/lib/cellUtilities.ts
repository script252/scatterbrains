import { getAllValidAdjacentCellIndices } from "./wordScrambleLib";
import { CellData, WordScrambleGameState } from "./wordScrambleTypes";

export function findAllWords(gameState: WordScrambleGameState, words: string[]): string[] {
    console.log('Finding all words...');
    // For each cell
    const startTime = Date.now();
    const result = gameState.cells.map((c: CellData) => getCellBranches(c, gameState, [c])).map((s:CellData[][]) => s.map((path:CellData[]) => path.flatMap((c:CellData)=> c.value).join(''))).flat(1);
    console.log(result);
    const time = Date.now();
    console.log(`Done: `, time-startTime);
    return [];
}

function getCellBranches(cell: CellData, gameState: WordScrambleGameState, path: CellData[]): CellData[][] {

    if(path.length > 5) return [path];

    if(path.length >= gameState.cells.length)
        return [path];

    // Get all valid neighbors (none already tested)
    const pathIds: number[] = path.map((p:CellData) => p.id);
    const nextCellIds: number[] = getAllValidAdjacentCellIndices(cell, gameState);
    const filteredNext = nextCellIds.filter((id:number) => !pathIds.some((pId:number) => pId === id) );
    //console.log('Path: ', pathIds);
    //console.log(nextCellIds);
    //console.log(filteredNext);

    if(filteredNext.length > 0) {
        //const newPath = [...path, gameState.cells[filteredNext[0]]];
        return filteredNext.map((id:number) => getCellBranches(gameState.cells[id], gameState, [...path, gameState.cells[id]])).flat(1);
    }

    return [path];
}