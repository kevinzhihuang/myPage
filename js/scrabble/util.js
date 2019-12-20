/*
91.61 GUI Programming I: Implementing a Bit of Scrabble with Drag-and-Drop
Kevin Z. Huang , kevin_huang2@student.uml.edu
Copyright (c) 2019 by Kevin Z. Huang.
Assignment to create a game of Scrabble
Created December 14, 2019 at 5:02 PM
Updated by KZH on December 20, 2019 at 1:13 AM
*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function find_table_position(droppableID) {

  // Figure out the row / col
  var test = String(droppableID).split('_');
  var row = String(test[0]).split('row');
  row = row[1];
  var col = String(test[1]).split('col');
  col = col[1];

  var arry = [];      // Save the row / col in an array, so that we can return both at once.
  arry.push(row);
  arry.push(col);

  // Return the row / col in an array.
  return arry;
}

function find_letter(given_id) {

  // Go through the 7 pieces,
  for(var i = 0; i < 7; i++) {
    // If we found the piece we're looking for return
    if(game_tiles[i].id == given_id) {
      return game_tiles[i].letter;
    }
  }

  // Or try looking in the completed word array
  for(var i = 0; i < complete_words.length; i++) {
    for(var x = 0; x < complete_words[i].length; x++) {
      if(given_id == complete_words[i][x].id) {
        return complete_words[i][x].letter;
      }
    }
  }

  // If we get here, error
  return -1;
}

function get_random_tile() {
  // Need take into account that there are 100 tiles total, not just 26 options.
  var all_letters = [];
  var total_letters = 0;

  for (var i = 0; i < 26; i++) {
    var current_letter = pieces[i].letter;    // Get current letter, "A" to start
    var remaining = pieces[i].remaining;      // Remaining letters, "9" for A at the start.
    total_letters += remaining;               // Keep track of ALL the letters

    for (var x = 0; x < remaining; x++) {
      all_letters.push(current_letter);       // Add "remaining"
    }
  }

  // Pick a random number and return that letter.
  var random_num = getRandomInt(0, total_letters - 1);   // Off by one error
  var letter = all_letters[random_num];       // Save the letter.

  // Find the letter to decrement.
  for (var i = 0; i < 26; i++) {
    if (pieces[i].letter == letter) {
      pieces[i].remaining--;                  // Decrement letter remaining for this letter.
      return letter;                          // Return the letter's index.
    }
  }

  // Error if we get here.
  return -1;
}

function update_remaining_table() {
  var x = 0;
  var first = true;

  // Go through every cell in the table and update it.
  $('#letters_remain tr').each(function() {

    if (x > 25) {   // hack to make Blank show "2".
      // Quit before bad things happen.
      return true;
    }

    $(this).find('td').each(function() {
      // Skip the first row, we don't want to mess with it.
      if (first == true) {
        first = false;
        return false;
      }

      if (x > 25) {
        // Quit before bad things happen.
        return false;
      }

      // Easier to use variables for this stuff.
      var letter = pieces[x].letter;
      var remaining = pieces[x].remaining;

      // Using "$(this)" access each cell.
      $(this).html(letter + ": " + remaining);

      x++;    // Keep looping
      return true;
    });
    return true;
  });

  return true;
}


// This function is an easy way to reset the pieces array / objects.
function load_pieces_array() {
  pieces = [
    {"letter":"A", "value":  1,  "amount":  9,  "remaining":  9},
    {"letter":"B", "value":  3,  "amount":  2,  "remaining":  2},
    {"letter":"C", "value":  3,  "amount":  2,  "remaining":  2},
    {"letter":"D", "value":  2,  "amount":  4,  "remaining":  4},
    {"letter":"E", "value":  1,  "amount": 12,  "remaining": 12},
    {"letter":"F", "value":  4,  "amount":  2,  "remaining":  2},
    {"letter":"G", "value":  2,  "amount":  3,  "remaining":  3},
    {"letter":"H", "value":  4,  "amount":  2,  "remaining":  2},
    {"letter":"I", "value":  1,  "amount":  9,  "remaining":  9},
    {"letter":"J", "value":  8,  "amount":  1,  "remaining":  1},
    {"letter":"K", "value":  5,  "amount":  1,  "remaining":  1},
    {"letter":"L", "value":  1,  "amount":  4,  "remaining":  4},
    {"letter":"M", "value":  3,  "amount":  2,  "remaining":  2},
    {"letter":"N", "value":  1,  "amount":  6,  "remaining":  6},
    {"letter":"O", "value":  1,  "amount":  8,  "remaining":  8},
    {"letter":"P", "value":  3,  "amount":  2,  "remaining":  2},
    {"letter":"Q", "value": 10,  "amount":  1,  "remaining":  1},
    {"letter":"R", "value":  1,  "amount":  6,  "remaining":  6},
    {"letter":"S", "value":  1,  "amount":  4,  "remaining":  4},
    {"letter":"T", "value":  1,  "amount":  6,  "remaining":  6},
    {"letter":"U", "value":  1,  "amount":  4,  "remaining":  4},
    {"letter":"V", "value":  4,  "amount":  2,  "remaining":  2},
    {"letter":"W", "value":  4,  "amount":  2,  "remaining":  2},
    {"letter":"X", "value":  8,  "amount":  1,  "remaining":  1},
    {"letter":"Y", "value":  4,  "amount":  2,  "remaining":  2},
    {"letter":"Z", "value": 10,  "amount":  1,  "remaining":  1},
    {"letter":"_", "value":  0,  "amount":  0,  "remaining":  0}    // Temporary set to 0 until I implement this.
  ];                                                                // Normally 2 should be in the array.
}

function fill_in_table() {
  var row = 0;
  var col = 0;

  // CURRENTLY USING BACKGROUND IMAGES FOR THE SPECIAL SPACES.

  $('#scrabble_board tr').each(function() {
    col = 0;
    $(this).find('td').each(function() {
      $(this).attr('id', 'row' + row + '_' + 'col' + col);
      col++;

    });
    row++;
  });
}
