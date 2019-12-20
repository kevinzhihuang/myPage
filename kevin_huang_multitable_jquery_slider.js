/*
91.61 GUI Programming I: Creating an Interactive Dynamic Table
Kevin Z. Huang , kevin_huang2@student.uml.edu
Copyright (c) 2019 by Kevin Z. Huang.
Assignment to try out javascript and make an interactive Dynamic
table
Created December 6, 2019 at 5:02 PM
Updated by KZH on December 8, 2019 at 4:15 PM
*/

/*Inspiration was taken from examples provided in professor's piazza posts
and I attempted to create my own versions of shown examples*/
var tabIndex = 1;

/*
    This function tries to submit the form. It will only submit if the form is valid.
    It gets called on various events:
    - on page load (automagically generated a 0 by 0 table by default)
    - on keyup (if the user types "5" it generates a new table using this input)
    - on slide (slider moves, new table is generated)
*/
function auto_submit() {
  // If the form is valid
  if( $("form#mult_form").valid() == true ) {
    // Then make it submit, which should update the tab in the process.
    $("form#mult_form").submit();
  }
}
/*
 *   Saves the current multiplication table into a new tab.
 */
function save_tab() {
  // I've decided to only allow 15 tabs, more will require deletion
  var tabCount = $("#tabs li").length + 1;
  console.log("Current tab count is: " + tabCount);

  if(tabCount > 15) {
    alert("Sorry, only 15 multiplication tables may be saved at the same time. Please delete one to save another table.");
    return false;
  }

  // Initializing jQuery tabs
  $( "#tabs" ).tabs();

  // Get the dimensions of the current table.
  var hor_start = Number(document.getElementById('horiz_start').value);
  var hor_end = Number(document.getElementById('horiz_end').value);
  var vert_start = Number(document.getElementById('vert_start').value);
  var vert_end = Number(document.getElementById('vert_end').value);

  tabIndex++;   // Increment the index each time we add a new tab.

  // Create the title bar, this will be a string to send to .append()
  var title = "<li class='tab'><a href='#tab-" + tabIndex + "'>" + hor_start +
              " - " + hor_end + " , " + vert_start + " - " + vert_end + "</a>" +
              "<span class='ui-icon ui-icon-close' role='presentation'></span>" + "</li>";

  // Add a new Title bar.
  $( "div#tabs ul" ).append( title );

  // Add the current multiplication table.
  $( "div#tabs" ).append('<div id="tab-' + tabIndex + '">' + $("#multiplication_table").html() + '</div>');

  // Refresh the tabs div so that the new tab shows up.
  $( "#tabs" ).tabs("refresh");

  // Make the new tab active, so that the user knows it updated.
  $( "#tabs" ).tabs("option", "active", -1);

  // Add a remove button
  $( "#tabs" ).delegate( "span.ui-icon-close", "click", function() {
      var panelID = $( this ).closest( "li" ).remove().attr( "aria-controls" );
      $( "#" + panelID ).remove();

      // Refresh the tabs!
      // Using try / catch to prevent exceptions from appearing in the console.
      try {
        $( "#tabs" ).tabs("refresh");
      }
      catch (e) {
        //console.log(e);
      }

      // If this is the last tab then reset
      if( $('div#tabs ul li.tab').length == 0) {
        try {
          $("#tabs").tabs("destroy");
        }
        catch (e) {
        }

        return false;   // Prevents default behavior
      }
  });
}

function slider() {

  // The slider code is based off of jQuery's UI page.

  // Horizontal Start Slider
  $("#slider_hor_start").slider({
    min: -50,
    max: 50,
    slide: function(event, ui) {
      $("#horiz_start").val(ui.value);
      auto_submit();  // Call the auto submit function on slide.
    }
  });
  $("#horiz_start").on("keyup", function() {
    $("#slider_hor_start").slider("value", this.value);
    auto_submit();  // Call the auto submit function on keyup as well.
  });

  // Horizontal End Slider
  $("#slider_hor_end").slider({
    min: -50,
    max: 50,
    slide: function(event, ui) {
      $("#horiz_end").val(ui.value);
      auto_submit();  // Call the auto submit function on slide.
    }
  });
  $("#horiz_end").on("keyup", function() {
    $("#slider_hor_end").slider("value", this.value);
    auto_submit();  // Call the auto submit function on keyup as well.
  });

  // Vertical Start Slider
  $("#slider_vert_start").slider({
    min: -50,
    max: 50,
    slide: function(event, ui) {
      $("#vert_start").val(ui.value);
      auto_submit();  // Call the auto submit function on slide.
    }
  });
  $("#vert_start").on("keyup", function() {
    $("#slider_vert_start").slider("value", this.value);
    auto_submit();  // Call the auto submit function on keyup as well.
  });

  // Vertical End Slider
  $("#slider_vert_end").slider({
    min: -50,
    max: 50,
    slide: function(event, ui) {
      $("#vert_end").val(ui.value);
      auto_submit();  // Call the auto submit function on slide.
    }
  });
  $("#vert_end").on("keyup", function() {
    $("#slider_vert_end").slider("value", this.value);
    auto_submit();  // Call the auto submit function on keyup as well.
  });
}


function validate() {
  $("#mult_form").validate({
    // Rules for validating the form.
    rules: {
      horiz_start: {
        number: true,
        min: -50,
        max: 50,
        required: true
      },
      horiz_end: {
        number: true,
        min: -50,
        max: 50,
        required: true
      },
      vert_start: {
        number: true,
        min: -50,
        max: 50,
        required: true
      },
      vert_end: {
        number: true,
        min: -50,
        max: 50,
        required: true
      }
    },
    messages: {
      horiz_start: {
        number: "You did not enter a valid number.<br/>Please enter a number between -50 and 50 for the Horizontal start.",
        min: "Number entered is too small.<br/>Please enter a number greater than or equal to -50 for the Horizontal start.",
        max: "Number entered is too large.<br/>Please enter a number less than or equal to 50 for the Horizontal start.",
        required: "No number was entered.<br/>A number between -50 and 50 is required for the Horizontal start."
      },
      horiz_end: {
        number: "You did not enter a valid number.<br/>Please enter a number between -50 and 50 for the Horizontal start.",
        min: "Number entered is too small.<br/>Please enter a number greater than or equal to -50 for the Horizontal start.",
        max: "Number entered is too large.<br/>Please enter a number less than or equal to 50 for the Horizontal start.",
        required: "No number was entered.<br/>A number between -50 and 50 is required for the Horizontal start."
      },
      vert_start: {
        number: "You did not enter a valid number.<br/>Please enter a number between -50 and 50 for the Horizontal start.",
        min: "Number entered is too small.<br/>Please enter a number greater than or equal to -50 for the Horizontal start.",
        max: "Number entered is too large.<br/>Please enter a number less than or equal to 50 for the Horizontal start.",
        required: "No number was entered.<br/>A number between -50 and 50 is required for the Horizontal start."
      },
      vert_end: {
        number: "You did not enter a valid number.<br/>Please enter a number between -50 and 50 for the Horizontal start.",
        min: "Number entered is too small.<br/>Please enter a number greater than or equal to -50 for the Horizontal start.",
        max: "Number entered is too large.<br/>Please enter a number less than or equal to 50 for the Horizontal start.",
        required: "No number was entered.<br/>A number between -50 and 50 is required for the Horizontal start."
      }
    },

    // This gets called when the form is submitted and valid.
    submitHandler: function() {
      table_calc();
      return false;
    },

    invalidHandler: function() {
      // Wipe the previous table / error messages
      // This way nothing will show up if a user tries to submit with an error.
      $("#warning_msg").empty();
      $("#multiplication_table").empty();
    },
    errorElement: "div",
    errorPlacement: function(error, element) {
      error.insertAfter(element);
    },

    onkeyup: function( element, event ) {
      auto_submit();
    }
  });
}



function table_calc() {
  var hor_start = Number(document.getElementById('horiz_start').value);
  var hor_end = Number(document.getElementById('horiz_end').value);
  var vert_start = Number(document.getElementById('vert_start').value);
  var vert_end = Number(document.getElementById('vert_end').value);

  $("#warning_msg").empty();

  // Swap beginning / ending numbers if the start is larger than the beginning.
  if (hor_start > hor_end) {

    // Alert the user that this is happening!
    $("#warning_msg").append("<p class='warning_class'>Swapping the Horizontal start and Horizontal end.</p>");

    var tmp_num = hor_start;
    hor_start = hor_end;
    hor_end = tmp_num;
  }

  // Also swap vertical beginning / ending
  if (vert_start > vert_end) {

    // Alert the user that this is happening!
    $("#warning_msg").append("<p class='warning_class'>Swapping the Vertical start and Vertical end.</p>");

    var tmp_num = vert_start;
    vert_start = vert_end;
    vert_end = tmp_num;
  }

  //using matrix containing arrays instead of array because didnt work well last time
  var matrix = {};

  // Figure out how many rows / columns we have.
  var rows = Math.abs(hor_end - hor_start);
  var columns = Math.abs(vert_end - vert_start);

  // Indexes for the 2D array.
  var horz = hor_start;
  var vert = vert_start;

  /*  Calculate the multiplication table using an object (matrix) and a bunch
      of arrays. I use a temp. array, calculate out a whole row's values, and
      then save that row's array in the object.*/
  for (var x = 0; x <= columns; x++) {
    var tmp_arr = [];

    for (var y = 0; y <= rows; y++) {
      // Calculate the given spot in the multiplication table.
      var calc = horz * vert;
      tmp_arr[y] = calc;
      horz++;
    }

    // Save the current row in the object.
    matrix["row" + x] = tmp_arr;

    horz = hor_start;        // Reset each pass since we're moving down a row.
    vert++;
  }

  var content = "";

  // Opening table tags.
  content += "<table>";

  // First row, and put an empty spot in the top left corner.
  content += "<tr><td></td>";

  for (var a = hor_start; a <= hor_end; a++) {
    content += "<td>" + a + "</td>";
  }

  // Close the first row.
  content += "</tr>";

  // Print out the left most column using this variable.
  var vert = vert_start;

  // Fill in each row after the first.
  for (var x = 0; x <= columns; x++) {
    // Set the left most column first.
    content += "<tr><td>" + vert + "</td>";

    // Add in all the multiplication for this row.
    for (var y = 0; y <= rows; y++) {
      content += "<td>" + matrix["row" + x][y] + "</td>";
    }
    vert++;

    // Close each row.
    content += "</tr>";
  }

  // Ending table tags.
  content += "</table>";

  // Now the content gets loaded into the HTML page.
  $("#multiplication_table").html(content);

  // Stop the form from refreshing.
  return false;
}
