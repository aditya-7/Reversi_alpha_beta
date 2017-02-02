var _ = require('lodash');

module.exports = function getAllValidMoves(board, whites, blacks){
  var current_coin, adjacent_coin, current_traversal;
  var allValidMoves = [];

  var possible_movements = [
    {row:-1, col:-1}, {row:-1, col:0}, {row:-1, col:1},
    {row:0, col:-1}, {row:0, col:1},
    {row:1, col:-1}, {row:1, col:0}, {row:1, col:1},
  ];

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
      new_row > 7 || new_col > 7 || new_row < 0 || new_col < 0 ||// check if we reached the end of the board
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
        if((new_row + row < 8) && (new_col + col < 8) && (new_row + row >= 0) && (new_col + col >= 0)) {
          //if the black coin is not at the end of the board after all this, then we can be sure that it is a valid move.
          current_board[new_row][new_col] = 'X';
          adjacent_coin = {row: new_row, col: new_col};
          allValidMoves.push({board:current_board, move: row_col, coin: adjacent_coin});
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
  var final_board_values = {};  //Where the final board values for current move will be present.

  function addMatrix(valid_move){
    // this method will replace other blacks to white wherever it is needed
    var board_now = final_board_values[valid_move.coin.row + ',' + valid_move.coin.col];
    for(var i=0; i<8; i++){
      for(var j=0; j<8; j++){
        if(board_now[i][j] == 'X' ||  valid_move.board[i][j] == 'X'){
          board_now[i][j] = 'X';
        }
      }
    }
    final_board_values[valid_move.coin.row + ',' + valid_move.coin.col] = board_now;  //Replace the existing board value with the updated coins
  }

  for (var i = 1; i <= allValidMoves.length; i++) {
    if(final_board_values[allValidMoves[i-1].coin.row + ',' + allValidMoves[i-1].coin.col] !== undefined){
      // if the move has already been played with another white coin
      addMatrix(allValidMoves[i-1]);
    }else{
      // if the move has not been played with another white coin
      final_board_values[allValidMoves[i-1].coin.row + ',' + allValidMoves[i-1].coin.col] = allValidMoves[i-1].board;
    }
  }

  return final_board_values;

}
