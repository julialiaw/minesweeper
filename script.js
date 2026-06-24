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
    for (var i = 0; i < 10.5; i++) {
        var row = Math.floor(Math.random() * 10);
        var col = Math.floor(Math.random() * 10);
        var cell = grid.rows[row].cells[col];
        cell.setAttribute("data-mine", "true");
        if (testing) {
            revealMines()
        }
    }
}

function moveFirst(cell) {
    if (firstMove == true && cell.getAttribute("data-mine") == "true") {
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
}

function countMines(cell) {
    
}

function makeMove(cell) {
    moveFirst(cell)
    if (cell.className == "clicked") return;
    if (cell.getAttribute("data-mine") == "true") {
        revealMines()
        alert("Game Over");
    } else {
        cell.className = "clicked";
        var cellRow = cell.parentNode.rowIndex;
        var cellCol = cell.cellIndex;
        var mineCount = 0;

        // counting surrounding mines
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) continue;
                if (grid.rows[cellRow + i]) {
                    if (grid.rows[cellRow + i].cells[cellCol + j]) {
                        var checkCell = grid.rows[cellRow + i].cells[cellCol + j];
                        if (checkCell.getAttribute("data-mine") == "true") {
                            mineCount += 1;
                        }
                    }
                }
            }
        }

        cell.innerHTML = mineCount;

        // if zero mines, reveal unclicked neighbours
        if (mineCount == 0) {
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (i == 0 && j == 0) continue;
                    if (grid.rows[cellRow + i]) {
                        if (grid.rows[cellRow + i].cells[cellCol + j]) {
                            var checkCell = grid.rows[cellRow + i].cells[cellCol + j];
                            if (checkCell.className !== "clicked") {
                                makeMove(checkCell);
                            }
                        }
                    }
                }
            }
        }
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