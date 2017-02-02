
var _ = require('lodash');
var getAllValidMoves = require('./getAllValidMoves');
var whites = [{row: 3, col:5},{row: 4, col:4}, {row:5, col:0}, {row:1, col:0}];
var blacks = [{row: 3, col:3 },{row: 3, col:4},{row: 2, col:4}, {row:4, col:1}, {row:2, col:1}];
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

console.log('\n\n********ORIGINAL STATE OF BOARD********');
printBoard(board); // print the actual board
//
var valid_moves_now = getAllValidMoves(board, whites, blacks);

console.log('\n\n********STATE OF BOARD WITH ALL VALID MOVES********');

_.forEach(valid_moves_now, function(board, key){
  console.log('\n\nwhen new coin placed at : ' +  key + '\n');
  printBoard(board);
});
