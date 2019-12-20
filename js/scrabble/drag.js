/*
91.61 GUI Programming I: Implementing a Bit of Scrabble with Drag-and-Drop
Kevin Z. Huang , kevin_huang2@student.uml.edu
Copyright (c) 2019 by Kevin Z. Huang.
Assignment to create a game of Scrabble
Created December 14, 2019 at 5:02 PM
Updated by KZH on December 20, 2019 at 1:13 AM
*/
function load_scrabble_pieces() {
  var base_url = "img/scrabble/Scrabble_Tile_";       // base URL of the image
  var random_letter = "";                             // Random letter for the tile
  var piece = "";                                     // HTML for the current tile (image tag)
  var piece_ID = "";                                  // ID for the current tile. In the form "piece#" where # is between 0 and 6.
  var pos;                                            // Position of the rack.
  var img_left, img_top;                              // Used to set the tile's position, based on the position of the rack (pos)

  // Load up 7 pieces
  for(var i = 0; i < 7; i++) {
    // This gets a random letter (letter's index in the array).
    random_letter = get_random_tile();

    // Make the img HTML and img ID so we can easily append the tiles.
    piece = "<img class='pieces' id='piece" + i + "' src='" + base_url + random_letter + ".jpg" + "'></img>";
    piece_ID = "#piece" + i;
    game_tiles[i].letter = random_letter;


    pos = $("#the_rack").position();

    // Now figure out where to reposition
    img_left = pos.left + 30 + (50 * i);
    img_top = pos.top + 30;


    $("#rack").append(piece);

    // Move the piece relative to where the rack is located on the screen.
    $(piece_ID).css("left", img_left).css("top", img_top).css("position", "absolute");

    // Make the piece draggable.
    $(piece_ID).draggable({
      appendTo: scrabble_board,
      revert: "invalid",            // This is key. Only the rack and game board are considered valid!
      start: function(ev, ui) {
        startPos = ui.helper.position();  // startPos is a global variable found in variables.js
      },
      stop: function() {
        $(this).draggable('option','revert','invalid');
      }
    });
  }
}
