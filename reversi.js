
var _ = require('lodash');
var getAllValidMoves = require('./getAllValidMoves');
// var whites = [{row: 3, col:5},{row: 4, col:4}, {row:5, col:0}, {row:1, col:0}];
// var blacks = [{row: 3, col:3 },{row: 3, col:4},{row: 2, col:4}, {row:4, col:1}, {row:2, col:1}];

var whites = [{row:3,col:3}, {row:4, col:5}];
var blacks = [{row: 2, col:3},{row: 3, col:4}];
var board = [];

//Note that board starts from [0][0] and ends at [7][7] here.

// arrange the board
for(var row=0; row<8; row++){
  board[row] = [];
  for(var col=0; col<8; col++){
    if(
      _.some( whites, {'row': row, 'col': col} ) //check if white is placed on [row, col] square on board
    ){
      board[row][col] = 'X';
    }else if(
      _.some( blacks, {'row': row, 'col': col} ) //check if black is placed on [row, col] square on board
    ){
      board[row][col] = 'O';
    }else board[row][col] = '*';  //if no black or white is placed, put a * to show empty square
  }
}

function printBoard (some_board){
  // print the state of board
  for(var row=0; row<8; row++){
    for(var col=0; col<8; col++){
      process.stdout.write(some_board[row][col] + '   ');
    }
    console.log('\n ');
  }
}

function updateWhiteBlack (board){
  var new_whites = [];
  var new_blacks = [];
  for(var i=0; i<8; i++){
    for(var j=0; j<8; j++){
      if(board[i][j] === 'X'){
        new_whites.push({row:i, col:j});
      }else if(board[i][j] === 'O'){
        new_blacks.push({row:i, col:j});
      }
    }
  }
  return {
    whites: new_whites,
    blacks: new_blacks
  }
}

console.log('\n\n********ORIGINAL STATE OF BOARD********');
printBoard(board); // print the actual board

var childNodes;
var DEPTH = 3;
var allChildsAtDepth;
var original_player = 'W';
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

function findWeightOfBoard(board, level){
  var checkFor = 'X';
  var Xchecker = false;
  var Ychecker = false;
  var value = 0;
  if(original_player == 'B') checkFor = '0';
  for(var i=0; i<8; i++){
    for(var j=0; j<8; j++){
      if(board[i][j] === '*') continue;
      if(board[i][j] === checkFor){
        value+= weights[i][j];
        if(Xchecker == true && level <DEPTH) return null;
        Ychecker = true;
      }
      else{
        value-= weights[i][j];
        if(Ychecker == true && level <DEPTH) return null;
        Xchecker = true;
      }
    }
  }
  return value;
}

function convertToBoardMove(move){
  var col;
  switch (move[2]) {
    case '0':
      col = 'a'; break;
    case '1':
      col = 'b'; break;
    case '2':
      col = 'c'; break;
    case '3':
      col = 'd'; break;
    case '4':
      col = 'e'; break;
    case '5':
      col = 'f'; break;
    case '6':
      col = 'f'; break;
    default:  //case '7'
      col = 'h';
  }
  var row = Number(move[0]) + 1;
  return col+row;
}

var root = {
  key : 'root',
  value: null,    // Value which is determined using the heuristic function/ alpha-beta algorithm.
  parent: null,   // The parent of this node; for root node it will be null.
  children : [],  // If the length of array is null, it means its a terminal node.
  state: board,   // The state of the board at this node.
  player: null,   // Based on who's playing first
  level: 0,
  move: 'root'
};

childNodes = [root];
var allChildsAtDepth = {
  'root' : root
};
var allKeys = ['root'];
var temp_nodes_array = [];
for(var i=1; i<= DEPTH; i++){
  temp_nodes_array = [];
  for(var j=0; j<childNodes.length; j++){
    var coins = updateWhiteBlack(childNodes[j].state);
    var pl, op;
    if(i%2 == 1){ //player is white
      pl = coins.whites;
      op = coins.blacks;
      player = 'W';
    }else { //player is black
      pl = coins.blacks;
      op = coins.whites;
      player = 'B';
    }
    var children = getAllValidMoves(childNodes[j].state, pl, op, player);
    _.forEach(children, function(board, key){
      var some_key = childNodes[j].key + '->' + key;
      var some_value = findWeightOfBoard(board, i);
      temp_nodes_array.push({
        key: some_key,  // is this useful? I dont think so!
        move: convertToBoardMove(key),  // to show the move made
        value : some_value,
        parent: childNodes[j].key,
        children : [],
        state: board,
        player: player,
        level: i,
      });
      allChildsAtDepth[childNodes[j].key].children.push(some_key);
      childNodes[j].children.push(some_key);
      allKeys.push(some_key);
      allChildsAtDepth[some_key] = JSON.parse(JSON.stringify(temp_nodes_array[temp_nodes_array.length-1]));
    });
  }
  childNodes = temp_nodes_array;
}

allKeys.sort();
console.log(allKeys);
var allMovesInTraversal = ['root'];
for(var i=1; i<allKeys.length; i++){
  if(allKeys[i].indexOf(allKeys[i-1]) > -1){
    allMovesInTraversal.push(allKeys[i]);
  }
  else{
    var some_key = allKeys[i-1  ];
    var some_array = [];
    while(allKeys[i].indexOf(some_key) === -1){
      some_key = some_key.substring(0,some_key.length-5);
      // some_array.unshift(some_key);
      allMovesInTraversal.push(some_key);
    }
    for(var j=some_array.length-1; j>0; j--){
      if(some_array[j] !== some_array[j-1]){
        allMovesInTraversal.push(some_array[j]);
      }
    }
    allMovesInTraversal.push(allKeys[i]);
  }
}
console.log('final traversal: ',allMovesInTraversal);
for(var i=0;i<allMovesInTraversal.length;i++){
  console.log(allChildsAtDepth[allMovesInTraversal[i]].move + ' ' + allChildsAtDepth[allMovesInTraversal[i]].value)
}
