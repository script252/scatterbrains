import { getAllValidAdjacentCellIndices } from "./wordScrambleLib";
import { CellData, WordScrambleGameState } from "./wordScrambleTypes";

export function findAllWords(gameState: WordScrambleGameState, words: string[]): string[] {
    console.log('Finding all words...');
    // For each cell
    const foundWords: Set<string> = new Set();
    const startTime = Date.now();
    const result = gameState.cells.map((c: CellData) => getCellBranches(c, gameState, [c], words, foundWords)).map((s:CellData[][]) => s.map((path:CellData[]) => path.flatMap((c:CellData)=> c.value).join(''))).flat(1);
    const time = Date.now();
    console.log(`Created ${result.length} paths in ${time-startTime}ms`);

    const pathsSet: Set<string> = new Set(result);
    console.log(`Unique possible letter combinations: ${pathsSet.size}`);
    console.log(`Found words: ${foundWords.size}`);

    return [];
}

function getCellBranches(cell: CellData, gameState: WordScrambleGameState, path: CellData[], wordDict: string[], /*This is changed!*/foundWords: Set<string>): CellData[][] {

    const wordSoFar: string = path.map((c:CellData)=> c.value).join('');
    if(testWord(wordSoFar, wordDict) === true)
        foundWords.add(wordSoFar);

    if(path.length > 4) return [path];

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
        return filteredNext.map((id:number) => getCellBranches(gameState.cells[id], gameState, [...path, gameState.cells[id]], wordDict, foundWords)).flat(1);
    }

    return [path];
}

function testWord(word: string, words: string[]): boolean {
    const lowerCaseWord = word.toLowerCase();
    const isWord: boolean = words.some((dw:string) => {return lowerCaseWord === dw});
    //if(isWord === true) console.log('Found word: ', lowerCaseWord);
    return isWord;
}