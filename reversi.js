
var _ = require('lodash');
var alpha_beta = require('./alpha_beta_pruning');
var getAllValidMoves = require('./getAllValidMoves');

// var whites = [{row: 3, col:5},{row: 4, col:4}, {row:5, col:0}, {row:1, col:0}];
// var blacks = [{row: 3, col:3 },{row: 3, col:4},{row: 2, col:4}, {row:4, col:1}, {row:2, col:1}];

// use this combo to test pruning
// var whites = [{row:3,col:3}, {row:4, col:5}];
// var blacks = [{row: 2, col:3},{row: 3, col:4}];

// use this combo to test pass move
var whites =[{row:3, col:3}, {row:3, col:5}];
var blacks =[{row:3, col:4}];
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
var DEPTH = 2;
var allChildsAtDepth;
var original_player = 'W';

function checkForPassMove(board){
  var x = false;
  var y = false;
  var z = false;
  for(var i=0; i<8; i++){
    for(var j=0; j<8; j++){
      if(board[i][j] === 'X') x = true;
      else if(board[i][j] === 'O') y = true;
      else z = true;
      if( x && y && z) return {'pas': board};
    }
  }
  return {};
}

var root = {
  key : 'root',
  value: null,    // Value which is determined using the heuristic function/ alpha-beta algorithm.
  alpha: null,
  beta: null,
  parent: null,   // The parent of this node; for root node it will be null.
  children : [],  // If the length of array is null, it means its a terminal node.
  state: board,   // The state of the board at this node.
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
    if(_.isEmpty(children)){
      //MAKE CHECK FOR A PASS MOVE
      children = checkForPassMove(childNodes[j].state)
    }
    _.forEach(children, function(board, key){
      var some_key = childNodes[j].key + '->' + key;
      temp_nodes_array.push({
        key: some_key,
        move: convertToBoardMove(key),  // to show the move made
        value : null,
        alpha: null,
        beta: null,
        parent: childNodes[j].key,
        children : [],
        state: board,
        level: i,
      });
      allChildsAtDepth[childNodes[j].key].children.push(some_key);
      allKeys.push(some_key);
      allChildsAtDepth[some_key] = JSON.parse(JSON.stringify(temp_nodes_array[temp_nodes_array.length-1]));
    });
  }
  childNodes = temp_nodes_array;
}

allKeys.sort();
alpha_beta(allChildsAtDepth, allKeys, original_player);
