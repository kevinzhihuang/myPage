/*
91.61 GUI Programming I: Implementing a Bit of Scrabble with Drag-and-Drop
Kevin Z. Huang , kevin_huang2@student.uml.edu
Copyright (c) 2019 by Kevin Z. Huang.
Assignment to create a game of Scrabble
Created December 14, 2019 at 5:02 PM
Updated by KZH on December 20, 2019 at 1:13 AM
*/
$( document ).ready(function() {
  load_pieces_array();        // Load up the default pieces array.
  load_scrabble_pieces();     // Load up the 7 random Scrabble pieces.
  load_droppable_targets();   // Load up the targets for the Scrabble pieces.
  update_remaining_table();   // Update the Letters Remaining table.
  fill_in_table();            // Add special items to the table.
});
