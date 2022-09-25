'use strict'

//mega hint
//exterminator
//change marked count
//change neiger show
const BOMB = '💣'
const FLAG = '🚩'

var timeInterval
var gGame = {
    isOn: true,
    noClicks: true,
    shownCount: +0,
    markedCount: +0,
    seconds: +0,
    hearts: +0,
    hints: +0,
    boom7: false,
    canExterminate: false,
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
    renderBoard(gBoard)
    gGame.markedCount = gLvls[gIdx].numberOfBombs
    document.querySelector('.score').innerHTML = `🚩 ${gGame.markedCount}`
    plenishPower()

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
    gGame.seconds = +0
    gGame.shownCount = 0
    gGame.noClicks = true
    clearInterval(timeInterval)
    document.querySelector('.timer').innerHTML = '0:00'
    initGame()
}

function win() {
    clearInterval(timeInterval)
    gGame.isOn = false
    document.querySelector('button').innerText = '😎'
}

function setDifficulty(idx) {
    gIdx = idx
    restart()
}
//Power-ups!!**********************************************************************
function handleBomb() {
    gGame.hearts--
    //makes player lose even if he didn't select the hearts powerUp
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
    var htmlStr = `<div class="powerUp" onclick="powerUp('noPower')">⛔</div>`

    htmlStr += `  <div class="powerUp" onclick="powerUp('hearts')">💖</div>`

    htmlStr += ` <div class="powerUp" onclick="powerUp('hint')">💡</div>`

    htmlStr += ` <div class="powerUp" onclick="powerUp('safe')">🦺</div>`

    htmlStr += ` <div class="powerUp" onclick="powerUp('7Boom')">7️⃣</div>`

    htmlStr += ` <div class="powerUp" onclick="powerUp('exterminator')">🐕</div>`

    document.querySelector('.powerUps').innerHTML = htmlStr
}

function powerUp(power) {
    gGame.powerUp = power
    restart()
}

function plenishPower() {
    gGame.hearts = 0
    gGame.hints = 0
    gGame.safeMoves = 0
    gGame.boom7 = false
    gGame.canExterminate = false
    var elPowerContainer = document.querySelector('.powerUpContainer')
    elPowerContainer.style.visibility = "visible"
    if (gGame.powerUp === "hearts") {
        elPowerContainer.innerText = "💖💖💖"
        gGame.hearts = 3
    }
    if (gGame.powerUp === "hint") {
        elPowerContainer.innerHTML = `<div onclick="toggleHint()">💡💡💡</div>`
        gGame.hints = 3
    }
    if (gGame.powerUp === "safe") {
        elPowerContainer.innerHTML = `<div onclick="safeMove(event)">🦺🦺🦺</div>`
        gGame.safeMoves = 3
    }
    if (gGame.powerUp === "7Boom") {
        gGame.boom7 = true
        elPowerContainer.innerHTML = `<div>7️⃣💥</div>`
    }
    if (gGame.powerUp === "exterminator") {
        elPowerContainer.innerHTML = `<div onclick="exterminator()">🐕</div>`
        gGame.canExterminate = true
    }
}

function toggleHint() {
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
    //prevents player from clicking while hint is on
    gGame.isOn = false
    //hides hints
    setTimeout(() => {
        for (var x = 0; x < negCells.length; x++) {
            var location = {
                i: negCells[x].i,
                j: negCells[x].j
            }
            renderCell(location, '')
            gGame.isOn = true
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

function exterminator() {
    if (!gGame.canExterminate) return
    var min = (3 < gLvls[gIdx].numberOfBombs) ? 3 : gLvls[gIdx].numberOfBombs

    for (let i = 0; i < min; i++) {
        var randomBomb = bombsArray.splice(getRandomIntInclusive(0, bombsArray.length - 1), 1)[0]
        console.log("hello");
        // console.log("hello", gBoard[randomBomb.i][randomBomb.j]);
        gBoard[randomBomb.i][randomBomb.j].isBomb = false
        gGame.markedCount--;
        gGame.shownCount--
    }
    document.querySelector('.score').innerHTML = `🚩 ${gGame.markedCount}`

    //update game
    setMinesNegsCount(gBoard)

    const SIZE = gLvls[gIdx].totalCells ** 0.5
    for (var i = 0; i < SIZE; i++) {
        for (var j = 0; j < SIZE; j++) {
            if (gBoard[i][j].isShown) renderCell({ i, j }, gBoard[i][j].minesAroundCount)
        }
    }
    gGame.canExterminate = false
}

//end od power-ups

