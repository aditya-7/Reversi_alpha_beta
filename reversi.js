
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

function findWeightOfBoard(board){
  var checkFor = 'X';
  var value = 0;
  if(original_player == 'B') checkFor = '0';
  for(var i=0; i<8; i++){
    for(var j=0; j<8; j++){
      if(board[i][j] === '*') continue;
      if(board[i][j] === checkFor) value+= weights[i][j];
      else value-= weights[i][j];
    }
  }
  return value;
}

var root = {
  key : 'root',
  value: null,    // Value which is determined using the heuristic function/ alpha-beta algorithm.
  parent: null,   // The parent of this node; for root node it will be null.
  children : {},  // If the length of array is null, it means its a terminal node.
  state: board,   // The state of the board at this node.
  player: null, // Based on who's playing first
  level: 0,
  move: 'root'
};

childNodes = [root];
var allChildsAtDepth = {
  'root' : root
};
var allMoves = ['root'];
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
    childNodes[j].children = children;
    _.forEach(children, function(board, key){
      var some_key = childNodes[j].key + '->' + key;
      temp_nodes_array.push({
        key: some_key,
        move: key,  // to show the move made
        value : null, //checIfTerminalNode(children[i]),
        parent: childNodes[j].key,
        children : {},
        state: board,
        player: player,
        level: i,
      });
      allMoves.push(some_key);
      allChildsAtDepth[some_key] = JSON.parse(JSON.stringify(temp_nodes_array[temp_nodes_array.length-1]));
    });
  }
  childNodes = temp_nodes_array;
}

allMoves.sort();
// console.log('allMoves', allMoves);
// console.log('allChildsAtDepth', allChildsAtDepth);
console.log('UniqueKey\t\t\t\t\tMove');
for(var i=0; i<allMoves.length; i++){
  console.log(allMoves[i] + '\t\t\t\t' + allChildsAtDepth[allMoves[i]].move);
}
