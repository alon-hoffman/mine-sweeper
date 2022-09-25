'use strict'

var shownCells = []


function firstClick(event, i, j) {
    timeInterval = setInterval(countUp, 1000)
    addBombs(gBoard, i, j)
    setMinesNegsCount(gBoard)
    gGame.isOn = true
    gGame.noClicks = false
    clicked(event, i, j)
}



function clicked(event, i, j) {
    if (gGame.noClicks) {
        firstClick(event, i, j)
        return
    }
    if (!gGame.isOn) return
    if (hintOn) {
        hint(i, j)
        return
    }
    if (event.which === 1) {
        const currentCell = gBoard[i][j]
        if (currentCell.isBomb) {
            renderCell({ i, j }, BOMB)
            handleBomb()
            return
        }
        if (!currentCell.minesAroundCount) {
            recursionReveal({ i, j })
        }
        else showValue({ i, j })
    }
    else markCell(i, j)
}


function recursionReveal(location) {
    if (gBoard[location.i][location.j].isBomb) return
    showValue(location)
    for (var i = location.i - 1; i <= location.i + 1; i++) {
        if (i < 0 || i > gBoard.length - 1) continue
        for (var j = location.j - 1; j <= location.j + 1; j++) {
            if (j < 0 || j > gBoard[0].length - 1) continue
            if (gBoard[i][j].isShown) continue
            if (!gBoard[i][j].minesAroundCount) recursionReveal({ i, j })
            else showValue({ i, j })
        }
    }
}

function markCell(i, j) {
    if (gBoard[i][j].isMarked) {
        gGame.markedCount++;
        gBoard[i][j].isMarked = false
        document.querySelector('.score').innerHTML = `🚩 ${gGame.markedCount}`
        renderCell({ i, j }, '')
        return
    }
    gBoard[i][j].isMarked = true
    renderCell({ i, j }, FLAG)
    gGame.markedCount--;
    document.querySelector('.score').innerHTML = `🚩 ${gGame.markedCount}`
    checkWining()
}

function showValue(location) {
    gBoard[location.i][location.j].isShown = true
    renderCell(location, gBoard[location.i][location.j].minesAroundCount)
    if (true) shownCells.push(location)
    gGame.shownCount++
    checkWining()
}

function checkWining() {
    if ((gGame.shownCount === gLvls[gIdx].totalCells - gLvls[gIdx].numberOfBombs)
        && gGame.markedCount === 0) {
        win()
    }
}

