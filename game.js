'use strict'
//add powerups ui
//add hints
// change wining condition


const BOMB = '💣'
const FLAG = '🚩'

var timeInterval
var gGame = {
    isOn: true,
    shownCount: +0,
    markedCount: +0,
    secsPassed: +0,
    hearts: +0,
    hints: +0,
    powerUp: "none",
}
var gLvls = [
    { totalCells: 16, numberOfBombs: 2 },
    { totalCells: 64, numberOfBombs: 14 },
    { totalCells: 124, numberOfBombs: 42 }
]
var gIdx = 0
var gBoard
var bombsArray = []
var hintOn = false

function initGame() {
    document.querySelector('.powerUpContainer').innerText = ''
    document.querySelector('button').innerText = '😁'
    gBoard = buildBoard()
    renderDummyBoard()
    gGame.seconds = 0
    gGame.markedCount = gLvls[gIdx].numberOfBombs
    document.querySelector('.score').innerHTML = `🚩 ${gGame.markedCount}`
    _resetPower()

}


function gameOver() {
    //stop clock
    clearInterval(timeInterval)
    //show all bombs
    _revealBombs()
    //prevent further clicks
    gGame.isOn = false
    //make sad face
    document.querySelector('button').innerText = '😵'
}

function _revealBombs() {

    for (var i = 0; i < bombsArray.length; i++) {
        renderCell(bombsArray[i], BOMB)
    }
}

function restart() {
    bombsArray = []
    gGame.shownCount = 0
    clearInterval(timeInterval)
    document.querySelector('.timer').innerHTML = '0:00'
    initGame()
}

function win() {
    clearInterval(timeInterval)
    gGame.isOn = false
    //make cool face
    document.querySelector('button').innerText = '😎'
}

function setDifficulty(idx) {
    gIdx = idx
    restart()
}

function handleBomb() {
    gGame.hearts--
    if (gGame.hearts <= 0) {
        document.querySelector('.powerUpContainer').style.visibility = "hidden"
        gameOver()
        return
    }
    var htmlStr = ''
    for (var i = 0; i < gGame.hearts; i++) {
        htmlStr += '💖'
    }
    document.querySelector('.powerUpContainer').innerText = htmlStr
}

function showPowerUps() {
    var htmlStr = `  <div class="heartPower" onclick="powerUp('hearts')">💖</div>
     <div class="noPower" onclick="powerUp('noPower')">⛔</div>`
    htmlStr += ` <div class="hint" onclick="powerUp('hint')">💡</div>`
    htmlStr += ` <div class="safeMove" onclick="powerUp('safe')">🦺</div>`
    document.querySelector('.powerUps').innerHTML = htmlStr
}

function powerUp(power) {
    gGame.powerUp = power
    restart()
}

function _resetPower() {
    gGame.hearts = 0
    gGame.hints = 0
    gGame.safeMoves = 0
    var elPowerContainer = document.querySelector('.powerUpContainer')
    if (gGame.powerUp === "hearts") {
        elPowerContainer.style.visibility = "visible"
        elPowerContainer.innerText = "💖💖💖"
        gGame.hearts = 3
    }
    if (gGame.powerUp === "hint") {
        elPowerContainer.style.visibility = "visible"
        elPowerContainer.innerHTML = `<div onclick="toggleHint()">💡💡💡</div>`
        gGame.hints = 3
    }
    if (gGame.powerUp === "safe") {
        elPowerContainer.style.visibility = "visible"
        elPowerContainer.innerHTML = `<div onclick="safeMove(event)">🦺🦺🦺</div>`
        gGame.safeMoves = 3
    }

}

function toggleHint() {
    console.log("toggleHint");
    hintOn = !hintOn
}

function hint(rowIdx, colIdx) {
    var negCells = []
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue

            if (!gBoard[i][j].isShown) negCells.push({ i, j })
            var value = (gBoard[i][j].isBomb) ? BOMB : gBoard[i][j].minesAroundCount
            renderCell({ i, j }, value)
        }
    }
    setTimeout(() => {
        for (var x = 0; x < negCells.length; x++) {
            var location = {
                i: negCells[x].i,
                j: negCells[x].j
            }
            renderCell(location, '')
        }
    }, 3000
    )
    hintOn = false
    gGame.hints--
    var htmlStr = ''
    for (var i = 0; i < gGame.hints; i++) {
        htmlStr += "💡"
    }
    document.querySelector('.powerUpContainer').innerHTML =
        ` <div onclick="toggleHint()"> ${htmlStr} </div>`
}

function safeMove(event) {
    //create a list of safe moves
    var safeMoves = []
    const SIZE = gLvls[gIdx].totalCells ** 0.5
    for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
            if (!gBoard[i][j].isBomb && !gBoard[i][j].isShown) safeMoves.push({ i, j })
        }
    }

    //in case there are no safe moves
    if (safeMoves.length === 0) {
        document.querySelector('button').innerText = '😒'
        setTimeout(() => { document.querySelector('button').innerText = '😁' }, 1000)
        return
    }
    var randomPos =
        safeMoves.
            splice(getRandomIntInclusive(0, safeMoves.length - 1), 1)[0];
    clicked(event, randomPos.i, randomPos.j)
    gGame.safeMoves--


    //update count and ui
    var htmlStr = ''
    for (var i = 0; i < gGame.safeMoves; i++) {
        htmlStr += "🦺"
    }
    document.querySelector('.powerUpContainer').innerHTML =
        `<div onclick="safeMove(event)"> ${htmlStr} </div>`

}