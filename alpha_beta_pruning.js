module.exports = function alpha_beta(allChildsAtDepth, allKeys){
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
  for(var i=0;i<allMovesInTraversal.length;i++){
    console.log(allChildsAtDepth[allMovesInTraversal[i]].move + ' ' + allChildsAtDepth[allMovesInTraversal[i]].value)
  }
};
