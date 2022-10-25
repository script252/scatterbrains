import { getAllValidAdjacentCellIndices } from "./wordScrambleLib";
import { CellData, WordScrambleGameState } from "./wordScrambleTypes";

export async function asyncFindAllWords(gameState: WordScrambleGameState, words: string[]): Promise<string[]> {

    return Promise.resolve(findAllWords(gameState, words));
}

export function findAllWords(gameState: WordScrambleGameState, words: string[]): string[] {

    const wordsHash: Set<string> = new Set(words);

    console.log('Finding all words...');
    // For each cell
    const foundWords: Set<string> = new Set();
    const startTime = Date.now();
    //const result = gameState.cells.map((c: CellData) => getCellBranches(c, gameState, [c], words, foundWords)).map((s:CellData[][]) => s.map((path:CellData[]) => path.flatMap((c:CellData)=> c.value).join(''))).flat(1);
    gameState.cells.forEach((c:CellData) => getCellBranches(c, gameState, [c], wordsHash, foundWords, c.value.toLowerCase()));
    const time = Date.now();
    console.log(`Searched in ${time-startTime}ms`);

    //const pathsSet: Set<string> = new Set(result);
    //console.log(`Unique possible letter combinations: ${pathsSet.size}`);
    console.log(`Found words: ${foundWords.size}`);

    return Array.from(foundWords);
}

async function getCellBranches(cell: CellData, gameState: WordScrambleGameState, path: CellData[], wordDict: Set<string>, /*This changes!*/foundWords: Set<string>, pathWord: string) {

    if(pathWord.length > 16)
        return;

    const wordSoFar: string = pathWord;
    if(wordSoFar.length > 2 && !foundWords.has(wordSoFar)) {
        if(testWord(wordSoFar, wordDict) === true)
            foundWords.add(wordSoFar);
    }

    // Get all valid neighbors (none already tested)
    const pathSet: Set<CellData> = new Set(path);
    const nextCellIds: number[] = getAllValidAdjacentCellIndices(cell, gameState, pathSet);

    if(pathWord === 'h')
        console.log('Next cell ids:', nextCellIds);

    nextCellIds.forEach((id:number) => getCellBranches(gameState.cells[id], gameState, [...path, gameState.cells[id]], wordDict, foundWords, pathWord.padEnd(pathWord.length+1, gameState.cells[id].value.toLowerCase())));
}

function testWord(word: string, words: Set<string>): boolean {
    const isWord: boolean = words.has(word);
    return isWord;
}