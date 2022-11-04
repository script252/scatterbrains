const wordScores = [0,0,0,1,1,2,3,5,11];

function createWord(cellIds, gs) {

  const newWord = cellIds.reduce((prev, curr, id) => {

      return {
          id: prev.id.toString().padStart(2, '0') + curr.toString().padStart(2, '0'),
          wordString: prev.wordString + gs.cells[curr].value,
          wordCellIndices: [...prev.wordCellIndices, curr],
          score: 0,
          hasBonus: prev.hasBonus || gs.cells[curr].isBonus === true
      };
  }, {id: 0, wordString: '', wordCellIndices: [], score: 0, hasBonus: false});

  const scoredWord = {
      ...newWord,
      score: wordScores[Math.min(newWord.wordString.length, 8)] * (newWord.hasBonus === true ? 2 : 1),
  }

  return scoredWord;
}

function getCellId(col, row, gs) {
    return ((row * gs.gameSettings.boardSize) + col);
}

// Ported an optimized C++ implementation
function dfs(board, s, i, j, n, m, idx, cellIds, gs) {
        
    if(i<0 || i>=n||j<0||j>=m){
        return [];
    }
     
    if(s[idx] !== board[i][j]){
        return [];
    }
    if(idx === s.length-1){
        return [cellIds];
    }
     
    const temp = board[i][j];
    board[i][j]='*';

    const a = dfs(board,s,i,j+1,n,m,idx+1, [...cellIds, getCellId(j+1, i, gs)], gs);
    const b = dfs(board,s,i,j-1,n,m,idx+1, [...cellIds, getCellId(j-1, i, gs)], gs);
    const c = dfs(board,s,i+1,j,n,m,idx+1, [...cellIds, getCellId(j, i+1, gs)], gs);
    const d = dfs(board,s,i-1,j,n,m,idx+1, [...cellIds, getCellId(j, i-1, gs)], gs);
    const e = dfs(board,s,i+1,j+1,n,m,idx+1, [...cellIds, getCellId(j+1, i+1, gs)], gs);
    const f = dfs(board,s,i-1,j+1,n,m,idx+1, [...cellIds, getCellId(j+1, i-1, gs)], gs);
    const g = dfs(board,s,i+1,j-1,n,m,idx+1, [...cellIds, getCellId(j-1, i+1, gs)], gs);
    const h = dfs(board,s,i-1,j-1,n,m,idx+1, [...cellIds, getCellId(j-1, i-1, gs)], gs);
     
    board[i][j]=temp;
    return [...a, ...b, ...c, ...d, ...e, ...f, ...g, ...h];
}

function wordBoggle(board, dictionary, gameState) {
    let n = board.length;
    let m = board[0].length;
    let store = new Set();
    for(let i=0;i<dictionary.length;i++){
        let s = dictionary[i];
        for(let j = 0; j < n; j++){
            for(let k = 0; k < m; k++){
                const ids = dfs(board,s,j,k,n,m,0,[((j * gameState.gameSettings.boardSize) + k)], gameState);
                if(ids.length > 0){
                    //let newWord: Word = new Word();
                    ids.forEach((wordIds) => {
                        if(wordIds.length > 0) {
                            const newWord = createWord(wordIds, gameState);
                            store.add(newWord);
                        }
                    });
                }
            }
        }
    }
    
    return Array.from(store);
}

function findWordsFast(gameState, words) {
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

onmessage = (e) => {
    if(e.data.type === 'findWords') {
      console.log('WebWorker: finding words');
      const results = findWordsFast(e.data.gameState, e.data.dictionary);
      self.postMessage({type: 'findWordsResults', words: results});
    }
}