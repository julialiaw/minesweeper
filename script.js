var grid = document.getElementById("grid");
var testing = true;

generateGrid();

function generateGrid() {
    // generate a 10x10 grid!!
    for (var i = 0; i < 10; i++) {
        row = grid.insertRow(i);
        for (var j = 0; j < 10; j++) {
            cell = row.insertCell(j);
            cell.addEventListener("click", function(){
                console.log("clicked");
            })
            var mine = document.createAttribute("data-mine");
            mine.value = "false";
            cell.setAttributeNode(mine);
        }
    }
    placeMines();
}

function placeMines() {
    // place 10 mines randomly in the grid
    for (var i = 0; i < 10; i++) {
        var row = Math.floor(Math.random() * 10);
        var col = Math.floor(Math.random() * 10);
        var cell = grid.rows[row].cells[col];
        cell.setAttribute("data-mine", "true");
        if (testing) {
            cell.innerHTML = "X";
        }
    }
}