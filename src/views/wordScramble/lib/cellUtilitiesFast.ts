import { WordScrambleGameState } from "./wordScrambleTypes";

// Ported an optimized C++ implementation
function dfs(board: string[][], s: string, i: number, j: number, n: number, m: number, idx: number): boolean {
        
    if(i<0 || i>=n||j<0||j>=m){
        return false;
    }
     
    if(s[idx]!= board[i][j]){
        return false;
    }
    if(idx == s.length-1){
        return true;
    }
     
    const temp: string = board[i][j];
    board[i][j]='*';

    const a: boolean = dfs(board,s,i,j+1,n,m,idx+1);
    const b: boolean = dfs(board,s,i,j-1,n,m,idx+1);
    const c: boolean = dfs(board,s,i+1,j,n,m,idx+1);
    const d: boolean = dfs(board,s,i-1,j,n,m,idx+1);
    const e: boolean = dfs(board,s,i+1,j+1,n,m,idx+1);
    const f: boolean = dfs(board,s,i-1,j+1,n,m,idx+1);
    const g: boolean = dfs(board,s,i+1,j-1,n,m,idx+1);
    const h: boolean = dfs(board,s,i-1,j-1,n,m,idx+1);
     
    board[i][j]=temp;
    return a||b||c||e||f||g||h||d;
}

function wordBoggle(board: string[][], dictionary: string[]): string[] {
    let n= board.length;
    let m = board[0].length;
    let store: Set<string> = new Set();
    for(let i=0;i<dictionary.length;i++){
        let s: string = dictionary[i];
        for(let j = 0; j < n; j++){
            for(let k = 0; k < m; k++){
                if(dfs(board,s,j,k,n,m,0)){
                    store.add(s);
                }
            }
        }
    }
    
    return Array.from(store);
}

export function findWordsFast(gameState: WordScrambleGameState, words: string[]): string[] {
    const size = 4;

    let board = Array.from({ length: size }, () => 
        Array.from({ length: size }, () => '')
    );

    for(let j = 0; j < size; j++) {
        for(let k = 0; k < size; k++) {
            const index = (j * size) + k;
            board[j][k] = gameState.cells[index].value.toLowerCase();
        }
    }
    
    return wordBoggle(board, words);
}