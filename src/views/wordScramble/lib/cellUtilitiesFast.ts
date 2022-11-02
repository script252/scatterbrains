import { createWord } from "./wordScrambleLib";
import { Word, WordScrambleGameState } from "./wordScrambleTypes";

function getCellId(col: number, row: number, gs: WordScrambleGameState): number {
    return ((row * gs.gameSettings.boardSize) + col);
}

// Ported an optimized C++ implementation
function dfs(board: string[][], s: string, i: number, j: number, n: number, m: number, idx: number, cellIds: number[], gs: WordScrambleGameState): number[][] {
        
    if(i<0 || i>=n||j<0||j>=m){
        return [];
    }
     
    if(s[idx] !== board[i][j]){
        return [];
    }
    if(idx === s.length-1){
        return [cellIds];
    }
     
    const temp: string = board[i][j];
    board[i][j]='*';

    const a: number[][] = dfs(board,s,i,j+1,n,m,idx+1, [...cellIds, getCellId(j+1, i, gs)], gs);
    const b: number[][] = dfs(board,s,i,j-1,n,m,idx+1, [...cellIds, getCellId(j-1, i, gs)], gs);
    const c: number[][] = dfs(board,s,i+1,j,n,m,idx+1, [...cellIds, getCellId(j, i+1, gs)], gs);
    const d: number[][] = dfs(board,s,i-1,j,n,m,idx+1, [...cellIds, getCellId(j, i-1, gs)], gs);
    const e: number[][] = dfs(board,s,i+1,j+1,n,m,idx+1, [...cellIds, getCellId(j+1, i+1, gs)], gs);
    const f: number[][] = dfs(board,s,i-1,j+1,n,m,idx+1, [...cellIds, getCellId(j+1, i-1, gs)], gs);
    const g: number[][] = dfs(board,s,i+1,j-1,n,m,idx+1, [...cellIds, getCellId(j-1, i+1, gs)], gs);
    const h: number[][] = dfs(board,s,i-1,j-1,n,m,idx+1, [...cellIds, getCellId(j-1, i-1, gs)], gs);
     
    board[i][j]=temp;
    return [...a, ...b, ...c, ...d, ...e, ...f, ...g, ...h];
}

function wordBoggle(board: string[][], dictionary: string[], gameState: WordScrambleGameState): Word[] {
    let n = board.length;
    let m = board[0].length;
    let store: Set<Word> = new Set();
    for(let i=0;i<dictionary.length;i++){
        let s: string = dictionary[i];
        for(let j = 0; j < n; j++){
            for(let k = 0; k < m; k++){
                const ids:number[][] = dfs(board,s,j,k,n,m,0,[((j * gameState.gameSettings.boardSize) + k)], gameState);
                if(ids.length > 0){
                    //let newWord: Word = new Word();
                    ids.forEach((wordIds: number[]) => {
                        if(wordIds.length > 0) {
                            const newWord: Word = createWord(wordIds, gameState);
                            store.add(newWord);
                        }
                    });
                }
            }
        }
    }
    
    return Array.from(store);
}

export function findWordsFast(gameState: WordScrambleGameState, words: string[]): Word[] {
    const size = gameState.gameSettings.boardSize;

    let board = Array.from({ length: size }, () => 
        Array.from({ length: size }, () => '')
    );

    for(let j = 0; j < size; j++) {
        for(let k = 0; k < size; k++) {
            const index = (j * size) + k;
            board[j][k] = gameState.cells[index].value.toLowerCase();
        }
    }
    
    return wordBoggle(board, words, gameState);
}