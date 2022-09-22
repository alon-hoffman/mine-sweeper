'use strict'
window.addEventListener("contextmenu", e => e.preventDefault());

var colorScheme = [
    { body: "rgb(178, 232, 232)", color: "black", cell: "rgb(240, 248, 255)", emoji: "☀️" },
    { body: "rgb(34, 3, 103)", color: "rgb(234, 224, 246)", cell: "rgb(147, 91, 247)", emoji: "🌑" }
]

var isDarkMode = false





function buildBoard() {
    const SIZE = gLvls[gIdx].totalCells ** 0.5
    const board = []

    for (var i = 0; i < SIZE; i++) {
        board.push([])
        for (var j = 0; j < SIZE; j++) {
            board[i][j] =
                { isBomb: false, minesAroundCount: null, isMarked: false, isShown: false }
        }
    }
    return board
}

function addBombs(board, firstPickedRow, firstPickedCol) {
    var potentialBombLocations = []
    const SIZE = gLvls[gIdx].totalCells ** 0.5
    for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
            if (i === firstPickedRow && j === firstPickedCol) continue
            potentialBombLocations.push({ i, j })
        }
    }
    for (var x = 0; x < gLvls[gIdx].numberOfBombs; x++) {
        var randomPos =
            potentialBombLocations.splice(getRandomIntInclusive(0, potentialBombLocations.length - 1), 1)[0]
        board[randomPos.i][randomPos.j].isBomb = true
        bombsArray.push(randomPos)
    }

    return board
}


function renderBoard(board) {

    var elBoard = document.querySelector('.board')
    var strHTML = ''

    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]

            var cellClass = getClassName({ i, j })

            if (currCell.isBomb) cellClass += ' bomb'
            ///XXX
            strHTML +=
                `\t<td class="cell ${cellClass}" onmousedown="clicked(event,${i}, ${j})">`
            // `\t<td class="cell ${cellClass}" onmousedown="clicked(event,'${cellClass}',${i}, ${j})">`
            // `\t<td class="cell ${cellClass}" onclick="clicked(event,'${cellClass}',${i}, ${j})">`

            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }
    elBoard.innerHTML = strHTML
}


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}




function checkNeg(rowIdx, colIdx) {
    var negCounter = 0
    var currCell = ""
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (i === rowIdx && j === colIdx) continue
            currCell = gBoard[i][j]
            if (currCell.isBomb) negCounter++
        }
    }
    return negCounter
}

function renderCell(location, value) {
    // Select the elCell and set the value
    const elCell = document.querySelector(`.cell-${location.i}-${location.j}`)
    elCell.innerHTML = value
}

function _getAllCells() {
    var cells = []
    for (let i = 0; i < gLvls[gIdx].numberOfBombs; i++) {
        cells.push(1)
    }
    for (let j = 0; j < (gLvls[gIdx].totalCells - gLvls[gIdx].numberOfBombs - 2); j++) {
        cells.push(0)
    }
    return cells
}

function countUp() {
    var elTimer = document.querySelector('.timer')
    var minutes = Math.floor(gGame.seconds / 60)
    var seconds = gGame.seconds % 60
    if (seconds < 10) {
        elTimer.innerHTML = minutes + ":0" + seconds
    } else {
        elTimer.innerHTML = minutes + ":" + seconds
    }
    gGame.seconds++
}

function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board.length; j++) {
            board[i][j].minesAroundCount = checkNeg(i, j)
        }
    }
}




function getClassName(location) {
    var cellClass = 'cell-' + location.i + '-' + location.j
    return cellClass
}


function toggleLightMode(element) {
    isDarkMode = !isDarkMode
    var index = isDarkMode * 1
    console.log(colorScheme[isDarkMode * 1].emoji);
    element.innerText = colorScheme[index].emoji
    document.querySelector('body').style.backgroundColor = colorScheme[index].body
    document.querySelector('body').style.color = colorScheme[index].color
    var elCells = document.querySelectorAll('.cell')
    for (let i = 0; i < elCells.length; i++) {
        elCells[i].style.backgroundColor = colorScheme[index].cell
    }
}