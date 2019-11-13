function multiply() {
  var h_first = parseInt(document.getElementById('starthorizontal').value);
  var h_last = parseInt(document.getElementById('endhorizontal').value);
  var v_first = parseInt(document.getElementById('startvertical').value);
  var v_last = parseInt(document.getElementById('endvertical').value);
  var table = document.getElementById('myTable');
  var h_reset = h_first;
  var rows = v_last - v_first;
  var columns = h_last - h_first;
  var row_counter = 0;
  var cell_counter = 0;

  for (row_counter; row_counter <= rows + 1; row_counter++) {
    var row = table.insertRow(row_counter);
    cell_counter = 0;
    //Resets the value so multiplication doesn't go out of control
    h_first = h_reset - 1;
    for (cell_counter; cell_counter <= columns + 1; cell_counter++) {
      var cell = row.insertCell(cell_counter);
      if (row_counter == 0) {
        cell.innerHTML=h_first++;
      }
      else {
        cell.innerHTML=(h_first++ * (v_first - 1));
      }
      if (cell_counter == 0) {
        cell.innerHTML=v_first - 1;
      }
    }
    v_first++;
  }
}
