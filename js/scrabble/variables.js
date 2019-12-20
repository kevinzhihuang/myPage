/*
91.61 GUI Programming I: Implementing a Bit of Scrabble with Drag-and-Drop
Kevin Z. Huang , kevin_huang2@student.uml.edu
Copyright (c) 2019 by Kevin Z. Huang.
Assignment to create a game of Scrabble
Created December 14, 2019 at 5:02 PM
Updated by KZH on December 20, 2019 at 1:13 AM
*/
var pieces = [];

// NOTE: "pieceX" means NO tile present on that drop zone.
// Also note this is EMPTY until tiles are placed onto the game board.
var game_board = [];

// JavaScript array to keep track of past words
var complete_words = [];

// JavaScript array of objects to determine what letter each piece is.
var game_tiles = [
  {"id": "piece0", "letter": "A"},
  {"id": "piece1", "letter": "B"},
  {"id": "piece2", "letter": "C"},
  {"id": "piece3", "letter": "D"},
  {"id": "piece4", "letter": "E"},
  {"id": "piece5", "letter": "F"},
  {"id": "piece6", "letter": "G"}
];

// Boolean for reading left to right or top to bottom
var left_right = false;

// For detecting multiple words played
var number_of_words = 0;

// Used for getting the original position of a draggable object.
var startPos;

// Save the score of all the words saved.
var word_score = 0;

// First letter for 2nd and on words played.
var first_letter = "";

var used_letters = 0;
