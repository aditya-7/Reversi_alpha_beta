module.exports = function alpha_beta(allChildsAtDepth, allKeys, player){

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

  var _ALPHA = -99999;
  var _BETA = 99999;
  allChildsAtDepth['root'].alpha = _ALPHA;
  allChildsAtDepth['root'].beta = _BETA;

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

  function maximiser(key){
    allChildsAtDepth[key].alpha = (allChildsAtDepth[key].alpha > allChildsAtDepth[key].value) ? allChildsAtDepth[key].alpha : allChildsAtDepth[key].value;
  }

  function minimiser(key){
    allChildsAtDepth[key].beta = (allChildsAtDepth[key].beta < allChildsAtDepth[key].value) ? allChildsAtDepth[key].beta : allChildsAtDepth[key].value;
  }

  function updateAlphaBetaForLeaf(key){
    allChildsAtDepth[key].value = findWeightOfBoard(allChildsAtDepth[key].state);
    if(allChildsAtDepth[key].level % 2 === 0) maximiser(key);
    else minimiser(key);
  }

  function parent_node_value(key, code){
    var children = allChildsAtDepth[key].children;
    var max = null;
    var min = null;
    for(var i=0;i<children.length;i++){
      if(allChildsAtDepth[children[i]].value === null) continue;
      if(max === null){ // min === null
        max = allChildsAtDepth[children[i]].value;
        min = allChildsAtDepth[children[i]].value;
      }else{
        if(allChildsAtDepth[children[i]].value > max) max = allChildsAtDepth[children[i]].value;
        if(allChildsAtDepth[children[i]].value < min) min = allChildsAtDepth[children[i]].value;
      }
    }
    if(code === 'MAX') return max;
    return min; // if code == 'MIN'
  }

  function updateAlphaBetaForParent(key){
    if(allChildsAtDepth[key].level % 2 === 0){
      allChildsAtDepth[key].value = parent_node_value(key, 'MAX');
      maximiser(key);
    }else {
      allChildsAtDepth[key].value = parent_node_value(key, 'MIN');
      minimiser(key);
    }
  }

  for(var i=1; i<allMovesInTraversal.length; i++){
    if(allChildsAtDepth[allMovesInTraversal[i]].parent === allMovesInTraversal[i-1]){
      // console.log('parent to child',allMovesInTraversal[i]);
      // pass down the alpha-beta values
      allChildsAtDepth[allMovesInTraversal[i]].alpha = allChildsAtDepth[allMovesInTraversal[i-1]].alpha;
      allChildsAtDepth[allMovesInTraversal[i]].beta = allChildsAtDepth[allMovesInTraversal[i-1]].beta;

      // if a terminal node is encountered, find values of the terminal node
      if(allChildsAtDepth[allMovesInTraversal[i]].children.length === 0){
        updateAlphaBetaForLeaf(allMovesInTraversal[i]);
      }

    }else{
      // console.log('child to parent',allMovesInTraversal[i]);
      updateAlphaBetaForParent(allMovesInTraversal[i]);
      // if alpha >= beta here, prune.

    }
    // console.log('alpha',allChildsAtDepth[allMovesInTraversal[i]].alpha);
    // console.log('beta',allChildsAtDepth[allMovesInTraversal[i]].beta);
    // console.log('value',allChildsAtDepth[allMovesInTraversal[i]].value);
    // console.log('\n');
  }
  var final_traversal = allMovesInTraversal[allMovesInTraversal.length-1];
  while(final_traversal !== 'root'){
    final_traversal = final_traversal.substring(0,final_traversal.length-5);
    console.log('final_traversal',final_traversal);
    updateAlphaBetaForParent(final_traversal);
  }

    for(var i=0;i<allKeys.length;i++){
      console.log(allChildsAtDepth[allKeys[i]].key + '\nvalue ' + allChildsAtDepth[allKeys[i]].value);
      console.log('alpha '+ allChildsAtDepth[allKeys[i]].alpha + ' beta ' + allChildsAtDepth[allKeys[i]].beta + '\n');
    }

};
