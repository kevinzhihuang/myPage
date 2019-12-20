/*
91.61 GUI Programming I: Implementing a Bit of Scrabble with Drag-and-Drop
Kevin Z. Huang , kevin_huang2@student.uml.edu
Copyright (c) 2019 by Kevin Z. Huang.
Assignment to create a game of Scrabble
Created December 14, 2019 at 5:02 PM
Updated by KZH on December 20, 2019 at 1:13 AM
*/
function find_word(read_left) {
  var word = "";                              // The current word.
  var current_score = 0;                      // Current Score always starts at 0.
  var saved_score = word_score;               // Saved score from previous words.
  var board_length = game_board.length;       // Current game board
  var word_count = complete_words.length;     // All saved words

  // The word is now blank.
  $("#word").html("____");
  $("#score").html(saved_score);

  // Go through the game board and generate a possible word.
  for(var i = 0; i < board_length; i++) {
    word += find_letter(game_board[i].tile);
    current_score += find_score(game_board[i].tile);
  }

  current_score += (current_score * should_double_triple_word());
  saved_score += current_score;

  // Put the score of the dropped tile into the HTML doc.
  $("#score").html(saved_score);

  // If the word is not empty, show it on the screen!
  if(word != "") {
    $("#word").html(word);
    return;
  }

  // Otherwise blank
  $("#word").html("____");
}

function should_double_triple_word() {
  // Get board array length. This will be useful for our checks next.
  var gameboard_length = game_board.length;

  // Go through the game board and see if any spots have the
  // class "double_word" or "triple_word"
  for (var i = 0; i < gameboard_length; i++) {
    var space_ID = "#" + game_board[i].id

    if ( $(space_ID).hasClass('double_word') == true ) {
      // Sweet! Double the word's value!
      return 1;
    }
    else if ( $(space_ID).hasClass('triple_word') == true ) {
      // SWEET! IT'S A TRIPLE!
      return 2;
    }
  }

  // Otherwise return 0.
  return 0;
}

function find_score(given_id) {
  // First figure out which letter we have.
  var letter = find_letter(given_id);
  var score = 0;

  for(var i = 0; i < 27; i++) {
    // Get an object to look at.
    var obj = pieces[i];

    // See if this is the right object.
    if(obj.letter == letter) {
      score = obj.value;

      // Need to determine if this piece is a DOUBLE or not.
      var extra = score * should_double_triple_letter(given_id);
      score = score + extra;

      return score;
    }
  }

  // Badness
  return -1;
}

function should_double_triple_letter(given_id) {
  var space;

  for(var i = 0; i < game_board.length; i++) {
    if(game_board[i].tile == given_id){
      space = "#" + game_board[i].id;
    }
  }
  if ( $(space).hasClass("double_letter") == true ) {
    // Sweet! Double the letter's value!
    return 1;
  }
  else if ( $(space).hasClass("triple_letter") == true ) {
    // SWEET! IT'S A TRIPLE!
    return 2;
  }

  // Otherwise return 1.
  return 0;
}
