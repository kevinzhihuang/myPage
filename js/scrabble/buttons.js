/*
91.61 GUI Programming I: Implementing a Bit of Scrabble with Drag-and-Drop
Kevin Z. Huang , kevin_huang2@student.uml.edu
Copyright (c) 2019 by Kevin Z. Huang.
Assignment to create a game of Scrabble
Created December 14, 2019 at 5:02 PM
Updated by KZH on December 20, 2019 at 1:13 AM
*/
function submit_word() {
  var word = $("#word").html();

  // The user needs to play a tile first...
  if (word == "____") {
    // The user isn't so smart. Tell them to try again.
    $("#messages").html("<br><div class='highlight_centered_error'> \
    Sorry, but you need to play a tile before I can check!</div>");
    console.log("Please play some tiles first.");
    return -1;
  }

  if ( 1 ) {
    $("#messages").html("<br><div class='highlight_centered_success'> \
    Nice job! \"" + word + "\" is considered a word by the game's dictionary!<br><br> \
    <button class='smaller_button' onclick='confirm_save_word();'>Save & Play Again.</button><br><br></div>");
    return 1;
  }
  else {
    // User isn't so smart. Tell them to try again.
    $("#messages").html("<br><div class='highlight_centered_error'> \
    Sorry. \"" + word + "\" is not a word in the English dictionary. \
    I suggest trying a different word. Or try resetting your tiles and trying again.</div>");
    return -1;
  }

}

function confirm_save_word() {
  save_word();
  reset_game();
}

function save_word() {
  var game_board_length = game_board.length;      // Get gameboard array length
  var word;                                       // array for the current word
  var index = 0;

  // Let the user know what's going on.
  $("#messages").html("<br><div class='highlight_centered_success'> \
  SAVING WORD.</div>");

  // Move the game board array into the compete_words array.
  // First make an array and save everything in the game array into it.
  word = [];

  // Save everything in the game area into this new array.
  for(var i = 0; i < game_board_length; i++) {
    var obj = {};
    obj["id"] = game_board[i].id;
    obj["letter"] = find_letter(game_board[i].tile);
    var tile_ID = game_board[i].tile;

    word.push(obj);   // Push obj back.

    $("#" + obj["id"]).droppable('disable');

    // Make the draggable disabled too so that the user can't drag the tile back to the rack.
    try {
      $("#" + tile_ID).draggable('disable');

      $("#" + tile_ID).attr("id", "disabled" + (i + complete_words.length) );  // start at 0, add length to make unique

      // Generate a new letter to be used.
      var new_letter = get_random_tile();

      // Change the game tiles array to reflect the new letter.
      for(var x = 0; x < 7; x++) {
        if(game_tiles[x].id == tile_ID) {
          index = x;  // index for the new piece.
          game_tiles[x].letter = new_letter;
        }
      }

      // Used in the next part, to create a new tile.
      var base_URL = "img/scrabble/Scrabble_Tile_";

      // Create a new draggable object with the new letter and ID of the old one.
      var new_piece = "<img class='pieces' id='piece" + index + "' src='" + base_URL + new_letter + ".jpg" + "'></img>";

      // Append to the rack.
      $("#rack").append(new_piece);

      // Make the piece draggable.
      $("#piece" + index).draggable({
        appendTo: scrabble_board,
        revert: "invalid",            // This is key. Only the rack and game board are considered valid!
        start: function(ev, ui) {
          // Save original position. (used for swapping tiles)
          startPos = ui.helper.position();
        },
        stop: function() {
          // If an invalid event is found, this will return the draggable object to its
          // default "invalid" option. From this Stackoverflow post (also used in the droppable part.)
          $(this).draggable('option','revert','invalid');
        }
      });
    }
    catch(e) {
    }
  }

  // Save the current word score. This will become the total score now.
  word_score = parseInt($("#score").html());  // Save it as an int.

  // Save the given word in the complete_words array
  complete_words.push(word);

  // Now that we've saved the game board array, let's empty it.
  game_board = [];

  // Reset all the Scrabble tiles
  reset_tiles();

  // And update the word / score as well.
  find_word();

  // Update remaining letters table.
  update_remaining_table();

  // Should be done now!
  return;
}


function reset_tiles() {
  // Let the user know what's going on.
  $("#messages").html("<br><div class='highlight_centered_success'> \
  MOVING ALL TILES BACK TO THE RACK.</div>");

  // Load up the 7 pieces and move them back to the game rack.
  for(var i = 0; i < 7; i++) {
    var piece_ID = "#piece" + i;

    // Reposition the tile on top of the rack, nicely in a row with the other tiles.

    var pos = $("#the_rack").position();

    // Now figure out where to reposition the board piece.

    var img_left = pos.left + 30 + (50 * i);      // This controls left to right placement.
    var img_top = pos.top + 30;                   // This controls top to bottom placement.

    // Move the piece relative to where the rack is located on the screen.
    $(piece_ID).css("left", img_left).css("top", img_top).css("position", "absolute");

    $('#rack').append($(piece_ID));
  }

  // Now delete everything in the game board array. Do this by just emptying the array.
  game_board = [];

  // Reset the used letters counter.
  used_letters = 0;

  // Update the word that is displayed.
  find_word();

  // Done! Woot. That wasn't so hard, was it?
  return;
}

function confirm_reset() {
  reset_game_board();
}

function reset_game() {
  var word_count = complete_words.length;

  // First clear the game board array.
  game_board = [];

  // Now reset the pieces array.
  load_pieces_array();

  // Remove all the scrabble tiles in the rack.
  for(var i = 0; i < 7; i++) {
    var tileID = '#' + game_tiles[i].id;
    $(tileID).draggable("destroy");    // Destroys the draggable element.
    $(tileID).remove();                // Removes the tile from the page.
  }

  // Remove all the scrabble tiles on the game board.
  for(var i = 0; i < word_count; i++) {
    // Get the individual spaces to remove.
    for(var x = 0; x < complete_words[i].length; x++) {
      var space = complete_words[i][x].id;

      // Make the space droppable again.
      $("#" + space).droppable("enable");

      // Remove the tile attached to the space.
      $("#disabled" + (i + x)).remove();    // The i + x will access all of them, since i starts at 0.
    }
  }

  // Clear the complete word array.
  complete_words = [];

  // Load up some new Scrabble pieces!
  load_scrabble_pieces();

  // Resets the HTML "Word: " and "Score: " display.
  find_word();    // Technically this returns -1 and just wipes the display clean.

  // Update the "Letters Remaining" table.
  update_remaining_table();

  // Let the user know what's going on.
  $("#messages").html("<br><div class='highlight_centered_success'> \
  BOARD AND TILES RESET.<br>CHECK THE RACK FOR NEW TILES.</div>");

  // Now we're done! Woot!
  return;
}

function reset_game_board() {
  var word_count = complete_words.length;

  // First clear the game board array.
  game_board = [];

  // Now reset the pieces array.
  load_pieces_array();

  // Set the score back to zero.
  word_score = 0;

  // Reset the used letters counter.
  used_letters = 0;

  // Remove all the scrabble tiles in the rack.
  for(var i = 0; i < 7; i++) {
    var tileID = '#' + game_tiles[i].id;
    $(tileID).draggable("destroy");    // Destroys the draggable element.
    $(tileID).remove();
  }

  // Remove all the scrabble tiles on the game board.
  for(var i = 0; i < word_count; i++) {
    // Get the individual spaces to remove.
    for(var x = 0; x < complete_words[i].length; x++) {
      var space = complete_words[i][x].id;

      // Make the space droppable again.
      $("#" + space).droppable("enable");

      // Remove the tile attached to the space.
      $("#disabled" + (i + x)).remove();    // The i + x will access all of them, since i starts at 0.
    }
  }

  // Clear the complete word array.
  complete_words = [];

  // Load up some new Scrabble pieces!
  load_scrabble_pieces();

  // Resets the HTML "Word: " and "Score: " display.
  find_word();    // Technically this returns -1 and just wipes the display clean.

  // Update the "Letters Remaining" table.
  update_remaining_table();

  // Let the user know what's going on.
  $("#messages").html("<br><div class='highlight_centered_success'> \
  BOARD AND TILES RESET.<br>CHECK THE RACK FOR NEW TILES.</div>");

  return;
}
