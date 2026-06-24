var grid = document.getElementById("grid");
var testing = false;
var firstMove = true;
var gameOver = false;

generateGrid();

function generateGrid() {
    // generate a 10x10 grid!!
    for (var i = 0; i < 10; i++) {
        var row = grid.insertRow(i);
        for (var j = 0; j < 10; j++) {
            var cell = row.insertCell(j);
            cell.setAttribute("state", "unclicked");
            cell.addEventListener("mousedown", (event) => {
                if (gameOver) return;
                if (event.button == 0) {
                    if (event.currentTarget.getAttribute("state") == "unclicked") {
                        makeMove(event.currentTarget);
                    }
                }
            })
            cell.addEventListener("contextmenu", (event) => {
                if (gameOver) return;
                event.preventDefault();
                if (event.currentTarget.getAttribute("state") != "clicked") {
                    flagCell(event.currentTarget); 
                }
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
    for (var i = 0; i < 15; i++) {
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
    if (cell.getAttribute("data-mine") == "true") {
        cell.setAttribute("data-mine", "false");
        cell.classList.remove("mine");
        let i = false;
        while (i == false) {
            var row = Math.floor(Math.random() * 10);
            var col = Math.floor(Math.random() * 10);
            var checkCell = grid.rows[row].cells[col];
            if (checkCell.getAttribute("data-mine") == "false") {
                checkCell.setAttribute("data-mine", "true")
                i = true;
            }
        }
    }
}

function countMines(cell) {
    // count number of mines surrounding a cell
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

    return mineCount;
}

function makeMove(cell) {
    if (firstMove == true) {
        moveFirst(cell);
        firstMove = false;
    }
    if (cell.getAttribute("state") == "clicked") return;
    if (cell.getAttribute("data-mine") == "true") {
        revealMines()
        alert("Game Over");
    } else {
        cell.className = "clicked";
        cell.setAttribute("state", "clicked");
        var cellRow = cell.parentNode.rowIndex;
        var cellCol = cell.cellIndex;
        var mineCount = countMines(cell);

        cell.innerHTML = mineCount;

        // if zero mines, reveal unclicked neighbours
        if (mineCount == 0) {
            for (var i = -1; i <= 1; i++) {
                for (var j = -1; j <= 1; j++) {
                    if (i == 0 && j == 0) continue;
                    if (grid.rows[cellRow + i]) {
                        if (grid.rows[cellRow + i].cells[cellCol + j]) {
                            var checkCell = grid.rows[cellRow + i].cells[cellCol + j];
                            if (checkCell.getAttribute("state") == "unclicked") {
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
            if (cell.getAttribute("data-mine") =="true" && cell.className != "mine" && cell.getAttribute("state") == "unclicked") {
                cell.className="mine";
                var bomb = document.createElement('img');
                bomb.id = 'bomb';
                bomb.src = "cute bomb.png";
                bomb.style.height="30px";
                bomb.style.width="30px";
                cell.appendChild(bomb);
            }
            else if (cell.getAttribute("state") == "false flag") {
                cell.className = "mine";
            }
            
        }
    }
    
}

// for flag: cell.removeChild(flag)
function flagCell(cell) {
    var flag = document.createElement('img');
    flag.id = 'flag';
    flag.src = "simple flag.png";
    flag.style.width="30px";
    flag.style.width="30px";
    if (cell.getAttribute("state") == "unclicked") {
        if (cell.getAttribute("data-mine") == "false") {
            cell.setAttribute("state", "false flag")
        } else { cell.setAttribute("state", "flag") }
        cell.appendChild(flag);
    } else {
        cell.setAttribute("state", "unclicked")
        cell.innerHTML = "";
    }
}