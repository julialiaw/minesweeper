var grid = document.getElementById("grid");

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
        }
    }
}