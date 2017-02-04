module.exports = function alpha_beta(allChildsAtDepth, allKeys, player){

  var _ALPHA = -99999;
  var _BETA = 99999;

  var allMovesInTraversal = ['root'];
  for(var i=1; i<allKeys.length; i++){
    if(allKeys[i].indexOf(allKeys[i-1]) > -1){
      allMovesInTraversal.push(allKeys[i]);
    }
    else{
      var some_key = allKeys[i-1  ];
      while(allKeys[i].indexOf(some_key) === -1){
        some_key = some_key.substring(0,some_key.length-5);
        allMovesInTraversal.push(some_key);
      }
      allMovesInTraversal.push(allKeys[i]);
    }
  }
  console.log('final traversal: ',allMovesInTraversal);

  var weights = [
    [99, -8, 8, 6, 6, 8, -8, 99],
    [-8, -24, -4, -3, -3, -4, -24, -8],
    [8, -4, 7, 4, 4, 7, -4, 8],
    [6, -3, 4, 0, 0, 4, -3, 6],
    [6, -3, 4, 0, 0, 4, -3, 6],
    [8, -4, 7, 4, 4, 7, -4, 8],
    [-8, -24, -4, -3, -3, -4, -24, -8],
    [99, -8, 8, 6, 6, 8, -8, 99]
  ];

  function findWeightOfBoard(board){
    // The heuristic function returns the weight of terminal nodes
    var checkFor = 'X';
    var value = 0;
    if(player == 'B') checkFor = '0';
    for(var i=0; i<8; i++){
      for(var j=0; j<8; j++){
        if(board[i][j] === '*') continue;
        if(board[i][j] === checkFor) value+= weights[i][j];
        else value-= weights[i][j];
      }
    }
    return value;
  }

  function updateAlphaBeta(node){

  }

  allChildsAtDepth['root'].alpha = _ALPHA;
  allChildsAtDepth['root'].beta = _BETA;
  // console.log(allChildsAtDepth['root']);

  for(var i=1; i<allMovesInTraversal.length; i++){
    // if(allMovesInTraversal[i].indexOf(allMovesInTraversal[i-1]) > -1){
      // child node, pass down the alpha beta value.
      // but check if its a terminal node first.
      // allChildsAtDepth[allMovesInTraversal[i]].alpha = allChildsAtDepth[allMovesInTraversal[i-1]].alpha;
      // allChildsAtDepth[allMovesInTraversal[i]].beta = allChildsAtDepth[allMovesInTraversal[i-1]].beta;
      if(allChildsAtDepth[allMovesInTraversal[i]].children.length === 0){
        // it is a terminal node
        allChildsAtDepth[allMovesInTraversal[i]].value = findWeightOfBoard(allChildsAtDepth[allMovesInTraversal[i]].state);
        updateAlphaBeta(allMovesInTraversal);
      }
    // }
    // if((allChildsAtDepth[allMovesInTraversal].level) % 2 === 0){
      // The player is white/MAXIMISER
      // getAlpha();
    // }
  }

  for(var i=0;i<allMovesInTraversal.length;i++){
    console.log(allChildsAtDepth[allMovesInTraversal[i]].key + ' ' + allChildsAtDepth[allMovesInTraversal[i]].value)
  }

};
