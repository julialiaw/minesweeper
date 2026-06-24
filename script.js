var grid = document.getElementById("grid");
var testing = true;
var firstMove = true;

generateGrid();

function generateGrid() {
    // generate a 10x10 grid!!
    for (var i = 0; i < 10; i++) {
        row = grid.insertRow(i);
        for (var j = 0; j < 10; j++) {
            cell = row.insertCell(j);
            cell.onclick = function() {
                makeMove(this);
            }
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
            revealMines()
        }
    }
}

function makeMove(cell) {
    if (firstMove == true) {
        cell.setAttribute("data-mine", "false");
        cell.classList.remove("mine");
        let i = false;
        while (i == false) {
            var row = Math.floor(Math.random() * 10);
            var col = Math.floor(Math.random() * 10);
            var cell = grid.rows[row].cells[col];
            if (cell.getAttribute("data-mine") == "false") {
                cell.setAttribute("data-mine", "true")
                i = true;
            }
        }
        firstMove = false;
    }
    if (testing) {
        revealMines()
    }
}

function revealMines() {
    // highlight cells with mines in red
    for (var i=0; i < 10; i++) {
        for (var j=0; j < 10; j++) {
            var cell = grid.rows[i].cells[j];
            if (cell.getAttribute("data-mine") =="true" && cell.className != "mine") {
                cell.className="mine"
                var img = document.createElement('img');
                img.src = "cute bomb.png";
                img.style.width="30px";
                img.style.width="30px";
                cell.appendChild(img);
            }
        }
    }
    
}