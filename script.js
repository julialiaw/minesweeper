var grid = document.getElementById("grid");
var count = document.getElementById("count");
var announce = document.getElementById("announce");

var testing = false;
var firstMove = true;
var gameOver = false;
var mineCount = 15;
var flagCount = 0;

generateGrid();

function generateGrid() {
    // generate a 10x10 grid!!
    grid.innerHTML="";
    announce.innerHTML="";
    count.innerHTML = mineCount;
    flagCount = 0;
    gameOver = false;
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
                if (event.currentTarget.getAttribute("state") != "clicked" && flagCount < mineCount || event.currentTarget.getAttribute("state") == "flagged" || event.currentTarget.getAttribute("state") == "false flag") {
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
    for (var i = 0; i < mineCount; i++) {
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
        announce.innerHTML="game over... o(╥﹏╥)o"
        gameOver = true;
    } else {
        cell.className = "clicked";
        cell.setAttribute("state", "clicked");
        var cellRow = cell.parentNode.rowIndex;
        var cellCol = cell.cellIndex;
        var mineCount = countMines(cell);
        if (mineCount != 0) cell.innerHTML = mineCount;

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
                bomb.src = "graphics/cute bomb.png";
                bomb.style.height="26px";
                bomb.style.width="28px";
                cell.appendChild(bomb);
            }
            else if (cell.getAttribute("state") == "false flag") {
                cell.innerHTML = "";
                var falseFlag = document.createElement('img');
                falseFlag.id = 'falseFlag';
                falseFlag.src = "graphics/false flag.PNG";
                falseFlag.style.width="23px";
                falseFlag.style.width="23px";
                cell.appendChild(falseFlag)
            }
            
        }
    }
    
}

function checkCompletion() {
    var victory = true;
    for (var i=0; i < 10; i++) {
        for (var j=0; j < 10; j++) {
            var cell = grid.rows[i].cells[j];
            if (cell.getAttribute("data-mine") =="true" && cell.getAttribute("state") == "unclicked") {
                victory = false;
            }
        }
    }
    if (victory) {
        //alert("You win!!!!");
        announce.innerHTML="woaaaah victory!! ٩(ˊᗜˋ*)و ♡"
        gameOver = true;
    }
}

// for flag: cell.removeChild(flag)
function flagCell(cell) {
    var flag = document.createElement('img');
    flag.id = 'flag';
    flag.src = "graphics/simple flag.PNG";
    flag.style.width="23px";
    flag.style.width="23px";
    if (cell.getAttribute("state") == "unclicked") {
        if (cell.getAttribute("data-mine") == "false") {
            cell.setAttribute("state", "false flag")
        } else { cell.setAttribute("state", "flagged") }
        cell.appendChild(flag);
        flagCount += 1;
    } else {
        cell.setAttribute("state", "unclicked")
        cell.innerHTML = "";
        flagCount -= 1;
    }
    count.innerHTML = mineCount - flagCount;
    checkCompletion()
}

