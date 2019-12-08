$(document).ready(function() {
  jQuery.validator.addMethod('greaterThan', function (value, element, param) {
        return this.optional(element) || parseInt(value) < parseInt($(param).val());
    }, 'Invalid value');
  jQuery.validator.addMethod('lessThan', function (value, element, param) {
        return this.optional(element) || parseInt(value) > parseInt($(param).val());
    }, 'Invalid value');
  alert('Validation has loaded! Thank you for waiting.')
  $('#inputform').validate({
    rules: {
      starthorizontal: {
        required: true,
        number: true,
        range: [-50,50],
        greaterThan: '#endhorizontal'
      },
      endhorizontal: {
        required: true,
        number: true,
        range: [-50,50],
        lessThan: '#starthorizontal'
      },
      startvertical: {
        required: true,
        number: true,
        range: [-50,50],
        greaterThan: '#endvertical'
      },
      endvertical: {
        required: true,
        number: true,
        range: [-50,50],
        lessThan: '#startvertical'
      },
    },
    messages: {
      starthorizontal: {
        required: "Please enter a starting number less than horizontal end #",
        number: "Input must be a number",
        range: "Please enter a number between -50 and 50",
        greaterThan: "Must be smaller than horizontal end #"
      },
      endhorizontal: {
        required: "Please enter a number",
        number: "Input must be a number",
        range: "Please enter a number between -50 and 50",
        lessThan: "Must be larger than horizontal start #"
      },
      startvertical: {
        required: "Please enter a number less than vertical end #",
        number: "Input must be a number",
        range: "Please enter a number between -50 and 50",
        greaterThan: "Must be smaller than vertical end #"
      },
      endvertical: {
        required: "Please enter a number",
        number: "Input must be a number",
        range: "Please enter a number between -50 and 50",
        lessThan: "Must be larger than vertical start #"
      },
    },
  });
});

function multiply() {
  //All these vars are just used for keeping track of certain numbers needed
  var h_first = parseInt(document.getElementById('starthorizontal').value);
  var h_last = parseInt(document.getElementById('endhorizontal').value);
  var v_first = parseInt(document.getElementById('startvertical').value);
  var v_last = parseInt(document.getElementById('endvertical').value);
  var replace_table = document.createElement('table');
  var replace_att = document.getElementsByTagName('table');
  var table = document.getElementById('myTable');

  //Row and Column counters
  var h_reset = h_first;
  var rows = v_last - v_first;
  var columns = h_last - h_first;
  var row_counter = 0;
  var cell_counter = 0;

  //The error checker to check if start values were bigger than last values
  //and checks if there was a return value of NaN meaning paseInt took in a char
  if ((h_first >= h_last) || (v_first >= v_last) || Number.isNaN(h_first) || Number.isNaN(h_last) || Number.isNaN(v_first) || Number.isNaN(v_last))
  {
    alert("Invalid Input! Please try Again.");
    return;
  }

  //Row controller/incrementer
  for (row_counter; row_counter <= rows + 1; row_counter++) {
    var row = replace_table.insertRow(row_counter);
    cell_counter = 0;
    //Resets the value so multiplication doesn't go out of control
    h_first = h_reset - 1;
    //Fills each cell in the row that the row incrementer is on
    for (cell_counter; cell_counter <= columns + 1; cell_counter++) {
      var cell = row.insertCell(cell_counter);
      //This is fills in the top and left with the numbers that are being multiplied
      if (row_counter == 0) {
        cell.innerHTML=h_first++; //Horizontal numbers
      }
      else {
        cell.innerHTML=(h_first++ * (v_first - 1)); //Multiplied answers
      }
      if (cell_counter == 0) {
        cell.innerHTML=v_first - 1; //Vertical numbers
      }
    }
    v_first++;
  }
  //These two lines are just for if the user clicks the submit button multiple
  //times so a table isnt repeatedly made, or they just want to update Table
  //with new values
  table.parentNode.replaceChild(replace_table, table);
  replace_att[0].setAttribute("id", "myTable");
}
