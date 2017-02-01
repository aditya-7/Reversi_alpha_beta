var _ = require('lodash');

//Note that board starts from [0][0] and ends at [7][7] here.

var whites = [{row: 3, col:5},{row: 4, col:4}];
var blacks = [{row: 3, col:3 },{row: 4, col:5},{row: 3, col:4},{row: 2, col:4}]
var board = [];
var current_coin;
var allValidMoves = [];

var possible_movements = [
  {row:-1, col:-1}, {row:-1, col:0}, {row:-1, col:1},
  {row:0, col:-1}, {row:0, col:1},
  {row:1, col:-1}, {row:1, col:0}, {row:1, col:1},
];

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
console.log('\n\n********ORIGINAL STATE OF BOARD********');
printBoard(board); // print the actual board

function traverseRecursively(current_board, coin, row_col){
  var row = row_col.row;
  var col = row_col.col;
  var new_row = (coin.row)+row;
  var new_col = (coin.col)+col;
  if(
    // check if the first movement gives you a blank square
    current_board[new_row][new_col] == '*' &&
    (current_coin.row + row) == new_row &&
    (current_coin.col + col) == new_col
  ){
    return false;
  }
  if(
    new_row >= 8 || new_col >= 8 || // check if we reached the end of the board
    current_board[new_row][new_col] === 'X' // check if the current movement gives you a white coin
  ){
    // Either of the 2 conditions makes it is an illegal move.
    return false;
  }
  else {  //in here it can only be a * or O, as we are cutting out the chance to show 'X' in the above if.
    if(current_board[new_row][new_col] === 'O'){ //check if the current movement gives you a black coin
      coin = {row: new_row, col: new_col};  //update coin to the next square through the same movement
      current_board[new_row][new_col] = 'X';
      traverseRecursively(current_board, coin, {row:row, col:col}); //traverse recursively through the same path
    }else {
      if(new_row + row < 8 && new_col + col < 8) {
        //if the black coin is not at the end of the board after all this, then we can be sure that it is a valid move.
        current_board[new_row][new_col] = 'X';
        allValidMoves.push({board:current_board, move: row_col, coin: current_coin});
        return true;
      }else{
        //if the black coin is at the end of the board, its still not a valid move.
        return false;
      }
    }
  }
}

for(var j=0; j<whites.length; j++){
  current_coin = whites[j];
  for(var i=0; i<possible_movements.length; i++){
    //cloning the object because we need to maintain the original state of the board for the next coin
    traverseRecursively(JSON.parse(JSON.stringify(board)), current_coin, possible_movements[i]);
  }
}

for (var i = 1; i <= allValidMoves.length; i++) {
  console.log('\n\n************************ '+ i + ' ************************');
  console.log('current coin: ',allValidMoves[i-1].coin);
  console.log('move: ',allValidMoves[i-1].move);
  printBoard(allValidMoves[i-1].board);
}
