var _ = require('lodash');

//Note that board starts from [0][0] and ends at [7][7] here.

var whites = [{row: 3, col:5},{row: 4, col:4}];
var blacks = [{row: 3, col:3 },{row: 4, col:5},{row: 3, col:4},{row: 2, col:4}]
var board = [];
var current_coin, valid_board;
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
      process.stdout.write(some_board[row][col] + '  ');
    }
    console.log('\n ');
  }
}

printBoard(board); // print the actual board

function traverseRecursively(current_board, coin, row, col){
  var new_row = (coin.row)+row;
  var new_col = (coin.col)+col;
  if(!(
    ( new_row < 8 && new_col < 8) || // check if we reached the end of the board
    current_board[new_row][new_col] === 'X' || // check if the current movement gives you a white coin
    (  // check if the first movement gives you a blank square
      current_board[new_row][new_col] === '*' &&
      (current_coin.row === new_row+row) && (current_coin.col === new_col+col)
    )
  )){
    // Either of three conditions makes it is an illegal move.
    return {valid: false};
  }
  else {  //in here it can only be a * or O, as we are cutting out the chance to show 'X' in the above else.
    if(current_board[new_row][new_col] === 'O'){ //check if the current movement gives you a black coin
      coin = {row: new_row, col: new_col};  //update coin to the next square through the same movement
      current_board[new_row][new_col] = 'X';
      traverseRecursively(current_board, coin, row, col); //traverse recursively through the same path
    }else {
      if(new_row + row < 8 && new_col + col < 8) {
        //if the black coin is not at the end of the board
        current_board[new_row][new_col] = 'X';
        valid_board = current_board;
        return {valid: true, board: current_board};
      }else{
        //if the black coin is at the end of the board, its still not a valid move.
        return {valid: false};
      }
    }
  }
}

var current_coin = whites[0];
valid_board = board;
traverseRecursively(board, whites[0], -1, -1);
console.log('\n\nthe state of board after the valid move is');
printBoard(valid_board);
