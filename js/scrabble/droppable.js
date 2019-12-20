/*
91.61 GUI Programming I: Implementing a Bit of Scrabble with Drag-and-Drop
Kevin Z. Huang , kevin_huang2@student.uml.edu
Copyright (c) 2019 by Kevin Z. Huang.
Assignment to create a game of Scrabble
Created December 14, 2019 at 5:02 PM
Updated by KZH on December 20, 2019 at 1:13 AM
*/
function load_droppable_targets() {
  $("#get_new_tile").droppable( {
    accept: ".ui-draggable",
    appendTo: "body",
    drop: function(event, ui) {
      var draggableID = ui.draggable.attr("id");
      var droppableID = $(this).attr("id");

      // Let the user know what's going on.
      $("#messages").html("<br><div class='highlight_centered_success'> \
      Swapping old tile for a new one.<br> Check the rack / board for your new tile!</div>");

      var new_letter = get_random_tile();

      // Put the old letter back.
      var old_letter = find_letter(draggableID);

      // Debugging
      console.log("Entering $(\"#get_new_tile\").droppable()");
      console.log("draggableID = " + draggableID);
      console.log("Old letter = " + old_letter + " New letter = " + new_letter);

      for(var i = 0; i < 26; i++) {
        // If we found the letter we are trying to swap
        if(pieces[i].letter == old_letter) {
          pieces[i].remaining++;  // Then increment by one so it's back in the bag.
        }
      }

      // Now we can change the letter of the tile to the new letter.
      for(var i = 0; i < 7; i++) {
        if(game_tiles[i].id == draggableID) {       // Find the tile in the game tile array.
          game_tiles[i].letter = new_letter;        // Assign the new letter to the tile.
        }
      }

      $("#" + draggableID).attr("src", "img/scrabble/Scrabble_Tile_" + new_letter + ".jpg");

      // Place the tile back where it came from, either the rack or the game board.
      var posX = startPos.left;
      var posY = startPos.top;

      // Move the draggable image so it doesn't fly around randomly like to the bottom of the screen or whatever.
      ui.draggable.css("left", posX);
      ui.draggable.css("top", posY);
      ui.draggable.css("position", "absolute");

      // Update the letter's remaining table
      update_remaining_table();

      // Update the word as well, in case the user changed the word.
      find_word();
    }

  });

  $("#the_rack").droppable( {
    accept: ".ui-draggable",
    appendTo: "body",
    drop: function(event, ui) {
      var draggableID = ui.draggable.attr("id");
      var droppableID = $(this).attr("id");

      // Get board array length. This will be useful for our checks next.
      var gameboard_length = game_board.length;

      // Need to check for complete words, if there's any then change some logic.
      var number_of_words = complete_words.length;

      // See if this element is in the array and at the beginning or end.
      for(var i = 0; i < gameboard_length; i++) {
        if (game_board[i].tile == draggableID) {

          // Make the spot droppable again.
          var spot_id = "#" + game_board[i].id;
          $(spot_id).droppable("enable");

          game_board.splice(i, 1);

          find_word();            // Update the word & score.

          var currentPos = ui.helper.position();
          var posX = parseInt(currentPos.left);
          var posY = parseInt(currentPos.top);

          // Move the draggable image so it doesn't fly around randomly like to the bottom of the screen or whatever.
          ui.draggable.css("left", posX);
          ui.draggable.css("top", posY);
          ui.draggable.css("position", "absolute");

          // Move the tile over to the rack. Prevents weird bugs where the table changes sizes and thinks there's two tiles in one spot.
          $('#rack').append($(ui.draggable));

          if(number_of_words > 0) {

            // See if its time to remove these letters.
            if(gameboard_length - 1 <= used_letters) {
              // Remove disabled tiles.
              game_board.splice(0, gameboard_length);

              // Reset the used_letters counter.
              used_letters = 0;
            }
          }

          find_word();              // Update word & score.
          return;                   // Quit now.
        }
      }
    }
  });

  $("#scrabble_board td").droppable({
    accept: ".ui-draggable",
    appendTo: "body",
    drop: function(event, ui) {

      var draggableID = ui.draggable.attr("id");    // The current Scrabble tile ID
      var droppableID = $(this).attr("id");         // The current spot on the game board ID
      var duplicate = false;
      var dup_index = 0;
      //left_right
      var insert_beg = false;
      var star_spot = "row0_col0";      //Start position
      var gameboard_length = 0;         // The length of the game board array (global array).
      var number_of_words = 0;          // Number of played words.
      var valid = 0;                    // Used for determining valid right angles.
      var prev_spaceID = "";            // Used for determining left/right vs up/down and also inserting at the beginning / end. And even saved letters.

      // Remove old error messages.
      $("#messages").html("");

      // Get board array length. This will be useful for our checks next.
      gameboard_length = game_board.length;

      // Also determine how many words are currently played.
      number_of_words = complete_words.length;

      // For debugging purposes.
      console.log("Entering: $(\"#scrabble_board td\").droppable()");
      console.log("draggableID: " + draggableID );
      console.log("droppableID: " + droppableID );


      for (var i = 0; i < gameboard_length; i++) {
        if (game_board[i].tile == draggableID) {
          duplicate = true;       // We've got a duplicate.
          dup_index = i;          // Save the index for later.
        }
      }

      if (duplicate == true) {
          $("#messages").html("<br><div class='highlight_centered_error'> \
          Sorry, tiles that are already placed on the board cannot be moved. \
          You will need to return the tile to the rack to move it. \
          You are also allowed to swap two tiles by dropping a new tile on top of a \
          currently played tile.</div>");

          ui.draggable.draggable('option', 'revert', true);
          return;
      }

      //Swap tiles
      if( $(this).find(".ui-draggable").length == 1 ) {

        var original_tile = $("#" + droppableID).find("img")[0].id;

        // startPos has the original position of the current droppable.
        var posX = startPos.left;
        var posY = startPos.top;

        // Set the position of the old tile.
        $("#" + original_tile).css("left", posX);
        $("#" + original_tile).css("top", posY);
        $("#" + original_tile).css("position", "absolute");

        // Move the tile over to the rack. Prevents weird bugs where the table changes sizes and thinks there's two tiles in one spot.
        $('#rack').append($("#" + original_tile));

        ui.draggable.css("top", $(this).css("top"));
        ui.draggable.css("left", $(this).css("left"));
        ui.draggable.css("position", "relative");

        // Append the new tile to the game board
        $(this).append($(ui.draggable));

        // Now update the game board array with the new letter.
        for(var i = 0; i < gameboard_length; i++) {
          if(game_board[i].tile == original_tile) {
            game_board[i].tile = draggableID;
          }
        }

        find_word();        // Update the word
        return;             // We're done so quit.
      }

      if(number_of_words == 0) {
        if (gameboard_length == 0) {
          if (droppableID != star_spot) {
            /* The only valid place is the star, row7_col7 */
            $("#messages").html("<br><div class='highlight_centered_error'> \
            Please start at the first slot on the left the game board.</div>");

            ui.draggable.draggable('option', 'revert', true);
            return;
          }
          else {
            $("#messages").html("");      // Remove that old error message.
          }
        }

        if (gameboard_length == 1 || (gameboard_length == 2 && duplicate == true) ) {

          var past_pos = find_table_position(game_board[0].id);
          var cur_pos = find_table_position(droppableID);

          allowed_arrays = [
            [ parseInt(past_pos[0]) - 1, past_pos[1] ],     // these two are l / r
            [ parseInt(past_pos[0]) + 1, past_pos[1] ],
            [ past_pos[0], parseInt(past_pos[1]) - 1],     // these two are t / b
            [ past_pos[0], parseInt(past_pos[1]) + 1]
          ];

          // See if we have one of the allowed positions.
          var test = cur_pos.toString();

          if (test == allowed_arrays[0].toString() || test == allowed_arrays[1].toString() ) {
            // Yeah! And it's top to bottom!
            console.log("Allowed. T/B");
            left_right = false;

            // Need to insert at the front if we're inserting at the top.
            if (test == allowed_arrays[0].toString()) {
              console.log("Inserting at the beginning of the game board array.");
              insert_beg = true;
            }
          }
          else if (test == allowed_arrays[2].toString() || test == allowed_arrays[3].toString() ) {
            // Yep! And it's left to right too!
            console.log("Allowed. L/R");
            left_right = true;

            // Need to insert at the front if we're inserting from the left.
            if (test == allowed_arrays[2].toString()) {
              console.log("Inserting at the beginning of the game board array.");
              insert_beg = true;
            }
          }
          else {
            // Tell the user what the error was.
            $("#messages").html("<br><div class='highlight_centered_error'> \
            Sorry, diagonals are not allowed once at least one tile has been placed.</div>");

            // Force the draggable to revert. Idea from:
            // https://stackoverflow.com/questions/6071409/draggable-revert-if-outside-this-div-and-inside-of-other-draggables-using-both
            ui.draggable.draggable('option', 'revert', true);
            return;
          }

        }

        if (gameboard_length >= 2) {

          if (left_right == true) {     // **** Left and right case   ****
            // First col - 1 and last col + 1 are valid, with same row.
            var valid_left = find_table_position(game_board[0].id);
            var valid_right = find_table_position(game_board[gameboard_length - 1].id);
            var cur_pos = find_table_position(droppableID);

            // Add or subtract for the valid position.
            valid_left[1] = parseInt(valid_left[1]) - 1;
            valid_right[1] = parseInt(valid_right[1]) + 1;

            var test = cur_pos.toString();      // Test against the current position.

            // See if this is a valid move!
            if ( test == valid_left.toString() || test == valid_right.toString() ) {
              // Yes! It is allowed!
              console.log("Allowed. L/R. Game board length = " + gameboard_length);

              if( test == valid_left.toString() ) {
                insert_beg = true;
              }
            }
            else {                // Not allowed.
              // Tell the user what the error was.
              $("#messages").html("<br><div class='highlight_centered_error'> \
              Sorry, only left and right placements are allowed when 2 or more tiles are played.</div>");

              ui.draggable.draggable('option', 'revert', true);
              return;
            }
          }
          else {
            var valid_top = find_table_position(game_board[0].id);
            var valid_bottom = find_table_position(game_board[gameboard_length - 1].id);
            var cur_pos = find_table_position(droppableID);


            valid_top[0] = parseInt(valid_top[0]) - 1;
            valid_bottom[0] = parseInt(valid_bottom[0]) + 1;

            var test = cur_pos.toString();
            if ( test == valid_top.toString() || test == valid_bottom.toString() ) {
              // Yes! It is allowed!
              console.log("Allowed. T/B. Game board length = " + gameboard_length);

              if (test == valid_top.toString()) {
                insert_beg = true;
              }
            }
            else {
              $("#messages").html("<br><div class='highlight_centered_error'> \
              Sorry, only up and down positions are allowed when 2 or more tiles are played.</div>");


              ui.draggable.draggable('option', 'revert', true);
              return;
            }
          }
        }
      }

      else {

        var possible_moves = [];


        for(var i = 0; i < number_of_words; i++) {
          // Get number of tiles in the current word.
          var num_tiles = complete_words[i].length;

          for(var x = 0; x < num_tiles; x++) {
            var cur_letterID = complete_words[i][x].id;
            var coordinates = find_table_position(cur_letterID);    // Get the row / col values.

            if(gameboard_length < 1) {
              valid = [
                "row" + (parseInt(coordinates[0]) - 1) + "_col" + coordinates[1],     // top of space
                "row" + (parseInt(coordinates[0]) + 1) + "_col" + coordinates[1],     // bottom of space
                "row" + (coordinates[0]) + "_col" + (parseInt(coordinates[1]) - 1),   // left of space
                "row" + (coordinates[0]) + "_col" + (parseInt(coordinates[1]) + 1)    // right of space
              ];
            }
            // Only allow left to right spaces.
            else if(gameboard_length >= 1 && left_right == true) {
              valid = [
                "row" + (coordinates[0]) + "_col" + (parseInt(coordinates[1]) - 1),   // left of space
                "row" + (coordinates[0]) + "_col" + (parseInt(coordinates[1]) + 1)    // right of space
              ];

              // Make sure we stay in the same row.
              var test_spaceID = game_board[0];
              var test_coord = find_table_position(test_spaceID);

              // Row is [0], so if these are the same, we're good.
              if (test_coord[0] == valid[0]) {
                // valid
              }
              // Not valid otherwise.
              else {
                valid = [];   // make it null so it won't match.
              }
            }
            // Only allow top to bottom spaces.
            else if(gameboard_length >= 1 && left_right == false) {
              valid = [
                "row" + (parseInt(coordinates[0]) - 1) + "_col" + coordinates[1],     // top of space
                "row" + (parseInt(coordinates[0]) + 1) + "_col" + coordinates[1]      // bottom of space
              ];

              // Make sure to stay in the same column.
              var test_spaceID = game_board[0];
              var test_coord = find_table_position(test_spaceID);

              // Col is [1], so if these are the same, we're good.
              if (test_coord[1] != valid[1]) {
                valid = [];   // Not valid. Make it null so it won't match.
              }               // Note, no need for else since else does nothing in this case.
            }

            // Make sure each space is not disabled, and not in the possible moves array already.
            if(gameboard_length == 0) {
              for(y = 0; y < 4; y++) {
                // See if we find our space.
                if(String(valid[y]) == String(droppableID)) {
                  prev_spaceID = cur_letterID;      // We did! Save this ID then.
                }
                possible_moves.push(String(valid[y]));
              }
            }
            else {
              for(y = 0; y < 2; y++) {
                // See if we find our space.
                if(String(valid[y]) == String(droppableID)) {
                  prev_spaceID = cur_letterID;      // We did! Save this ID then.
                }
                possible_moves.push(String(valid[y]));
              }
            }
          }
        }
        for(var i = 0; i < gameboard_length; i++) {
          var cur_letterID = game_board[i].id;
          var coordinates = find_table_position(cur_letterID);    // Get the row / col values.

          if(gameboard_length < 1) {
            valid = [
              "row" + (parseInt(coordinates[0]) - 1) + "_col" + coordinates[1],     // top of space
              "row" + (parseInt(coordinates[0]) + 1) + "_col" + coordinates[1],      // bottom of space
              "row" + (coordinates[0]) + "_col" + (parseInt(coordinates[1]) - 1),   // left of space
              "row" + (coordinates[0]) + "_col" + (parseInt(coordinates[1]) + 1)    // right of space
            ];
          }
          // Only allow left to right spaces.
          else if(gameboard_length >= 1 && left_right == true) {
            valid = [
              "row" + (coordinates[0]) + "_col" + (parseInt(coordinates[1]) - 1),   // left of space
              "row" + (coordinates[0]) + "_col" + (parseInt(coordinates[1]) + 1)    // right of space
            ];
          }
          // Only allow top to bottom spaces.
          else if(gameboard_length >= 1 && left_right == false) {
            valid = [
              "row" + (parseInt(coordinates[0]) - 1) + "_col" + coordinates[1],     // top of space
              "row" + (parseInt(coordinates[0]) + 1) + "_col" + coordinates[1]      // bottom of space
            ];
          }

          if(gameboard_length == 0) {
            for(y = 0; y < 4; y++) {
              if(String(valid[y]) == droppableID) { // See if we find our space.
                prev_spaceID = cur_letterID;        // We did! Save this ID then.
              }
              possible_moves.push(String(valid[y]));
            }
          }
          else {
            for(y = 0; y < 2; y++) {
              if(String(valid[y]) == droppableID) { // See if we find our space.
                prev_spaceID = cur_letterID;        // We did! Save this ID then.
              }
              possible_moves.push(String(valid[y]));
            }
          }
        }

        var is_valid = possible_moves.indexOf(droppableID);

        // It is a valid move if is_valid isn't -1.
        if(is_valid != -1) {
          $("#messages").html("");      // Valid move, so erase the last error message.

          var past_row, past_col;       // Need to get last position and current position.
          var new_row, new_col;         // Last is basically the tile immediately next to the tile we placed.
                                        // Say we added an "S" to the end of "Home", the "e" in "Home" would be the last position.
          var tmp_pos = find_table_position(droppableID);
          new_row = parseInt(tmp_pos[0]);
          new_col = parseInt(tmp_pos[1]);

          tmp_pos = find_table_position(prev_spaceID);
          past_row = parseInt(tmp_pos[0]);
          past_col = parseInt(tmp_pos[1]);

          // Determine if we are going left to right or top to bottom.
          if(gameboard_length == 0) {
            if(past_row == new_row) {
              left_right = true;        // Yep the rows are the same, so it's left to right.
            }
            else {
              left_right = false;       // Nope, rows are different, it's top to bottom.
            }
          }

          // Determine if we should insert at the beginning or the end.
          if(left_right == true) {                            // Left to right check.
            if(new_col <= past_col) {                         // YES
              insert_beg = true;
            }
            else if (new_col < past_col) {                    // NO
              insert_beg = false;
            }
          }
          else if (left_right == false) {                     // Must be Up/Down
            if(new_row <= past_row) {                         // YES
              insert_beg = true;
            }
            else if (new_row > past_row) {                    // NO
              insert_beg = false;
            }
          }

          // Determine if the prev space should be added to the game board array.
          if(gameboard_length == 0) {
            // Go up or down to grab the entire previous word.
            // Current space is: droppableID
            if(left_right == true) {         // All the way to the left.
              // Need to go left and see if we find any disabled spaces.
              // We know this row is: new_row

              // Var to determine when to stop checking words.
              var test_word = true;

              // Go all the way to the left or right.
              var col_index = parseInt(new_col);          // Index for the column.

              if(insert_beg != true) {
                col_index = new_col - 1;                  // Start going to the left.
              }
              else {
                col_index = new_col + 1;                  // Start going to the right.
              }

              // While there's a letter to add, keep adding.
              // Once test_word is false, we stop adding letters to the array.
              while(test_word == true) {
                var row_pos = new_row;                  // Row position stays constant.
                var col_pos = col_index;                // Column must change.

                // See if this a valid disabled space.
                var test_cord = "row" + row_pos + "_col" + col_pos;

                // If this is a valid disabled space, sweet! Add it to the array!
                if(find_letter(test_cord) != -1 && test_word == true) {
                  // Create an object to add.
                  var tmp_obj = {};
                  tmp_obj['id'] = test_cord;          // This style works as an object.
                  tmp_obj['tile'] = test_cord;

                  // Do we insert at the beginning or the end?
                  if(insert_beg != true) {          // No! Beginning!
                    game_board.unshift(tmp_obj);
                    col_index--;
                  }
                  else {                            // Yes, the end!
                    game_board.push(tmp_obj);
                    col_index++;
                  }

                  used_letters++;                   // Keep track of used letters.
                }
                else {
                  // Time to break. This prevents reading the entire row and adding silly letters.
                  test_word = false;
                }
              }
            }
            else {                                // Up / Down case

              // Go all the way to the left or right.
              var row_index = parseInt(new_row);          // Index for the row.

              if(insert_beg != true) {
                row_index = new_row - 1;                  // Start going up.
              }
              else {
                row_index = new_row + 1;                  // Start going down.
              }

              // While there's a letter to add, keep adding.
              // Once test_word is false, we stop adding letters to the array.
              while(test_word == true) {
                var row_pos = row_index;                  // Row must change.
                var col_pos = new_col;                    // Column position stays constant.

                // See if this a valid disabled space.
                var test_cord = "row" + row_pos + "_col" + col_pos;

                // If this is a valid disabled space, sweet! Add it to the array!
                if(find_letter(test_cord) != -1 && test_word == true) {
                  // Create an object to add.
                  var tmp_obj = {};
                  tmp_obj['id'] = test_cord;          // This style works as an object.
                  tmp_obj['tile'] = test_cord;

                  // Do we insert at the beginning or the end?
                  if(insert_beg != true) {            // No! Beginning!
                    game_board.unshift(tmp_obj);
                    row_index--;
                  }
                  else {                              // Yes, the end!
                    game_board.push(tmp_obj);
                    row_index++;
                  }

                  used_letters++;                  // Keep track of used letters.
                }
                else {
                  // Time to break. This prevents reading the entire row and adding silly letters.
                  test_word = false;
                }
              }
            }
          }
        }
        else {
          $("#messages").html("<br><div class='highlight_centered_error'> \
          Sorry, that wasn't a valid move. Tiles must be placed at right angles, as diagonals are not allowed.</div>");

          if(gameboard_length > 0) {
            // Check for left / right to provide the most accurate error message.
            if(left_right == true) {
              $("#messages").html("<br><div class='highlight_centered_error'> \
              Sorry, that wasn't a valid move. Tiles must be placed on the same row (left / right) after one tile has been placed on a row.</div>");
            }
            // Must be top / down, so provide that error message.
            else {
              $("#messages").html("<br><div class='highlight_centered_error'> \
              Sorry, that wasn't a valid move. Tiles must be placed on the same column (top / down) after one tile has been placed on a column.</div>");
            }
          }

          // Force the draggable to revert. Idea from:
          // https://stackoverflow.com/questions/6071409/draggable-revert-if-outside-this-div-and-inside-of-other-draggables-using-both
          ui.draggable.draggable('option', 'revert', true);
          return;
        }
      }

      var obj = {};
      obj['id'] = droppableID;          // This style works as an object.
      obj['tile'] = draggableID;

      if (duplicate == false) {
        if (insert_beg == false) {
          // Push back to the game board array.
          game_board.push(obj);
        }
        else {
          // Push to the front of the game board array.
          game_board.unshift(obj);    
        }

      }

      $(this).append($(ui.draggable));
      ui.draggable.css("top", $(this).css("top"));
      ui.draggable.css("left", $(this).css("left"));
      ui.draggable.css("position", "relative");

      // Update the word as it stands now.
      find_word();
    },
    zIndex: -1
  });
}
