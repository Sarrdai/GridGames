const boxClass = "box"
const boxName = "decoderTile"

const boardGameClass = "boardGame"
const boardgameId = "boardGame"

const computedStyle = getComputedStyle(document.documentElement);

var wordList;

const tileColors = {

    team2: computedStyle.getPropertyValue("--team2-color"),
    team1: computedStyle.getPropertyValue("--team1-color"),
    assassin: computedStyle.getPropertyValue("--assassin-color"),

}


function createBoard(columnCount, rowCount) {

    let boardGame = updateBoardGrid(columnCount, rowCount);
    addBoardTiles(boardGame, columnCount, rowCount)

    return boardGame;
}

function addBoardTiles(boardGame, columnCount, rowCount) {

    let height = document.documentElement.clientHeight;
    let width = document.documentElement.clientWidth;

    maxWidthInPx = (height / rowCount);
    maxHeightInPx = (width / columnCount);

    let tileSizeInPx = Math.min(maxWidthInPx, maxHeightInPx);
    tileWidthInPercent = tileSizeInPx / width;

    let count = columnCount * rowCount;
    for (let i = 0; i < count; i++) {
        let box = createBox(boxName + i, tileWidthInPercent);
        boardGame.appendChild(box);
    }
}

function applyDecoderSeed(tileCount, seedValue) {

    let randomizedIndexes = getRandomIndexArray(tileCount, seedValue);

    let teamOneTileCounts = Math.round(tileCount * 0.36);
    let teamTwoTileCounts = teamOneTileCounts - 1;

    let colors = getTeamOrder(seedValue);

    let grid = document.getElementById(boardgameId);
    startIndex = 0;
    let lastIndexTeamOne = colorizeDecoderTiles(grid, randomizedIndexes, startIndex, teamOneTileCounts, colors[0]);
    let lastIndexTeamTwo = colorizeDecoderTiles(grid, randomizedIndexes, lastIndexTeamOne + 1, teamTwoTileCounts, colors[1]);
    let lastIndexAssassin = colorizeDecoderTiles(grid, randomizedIndexes, lastIndexTeamTwo + 1, Number(localStorage.assassinCount), tileColors.assassin);

    return colors[0];
}

function getTeamOrder(session) {
    let myrng = new Math.seedrandom(session);
    let colors = [tileColors.team1, tileColors.team2]
    colors.sort(function (a, b) { return 0.5 - myrng() });
    return colors;
}


function applySessionId(tileCount, session) {

    let textArray = []
    let grid = document.getElementById(boardgameId);
    let randomizedIndexes = getRandomIndexArray(tileCount, session);
    
    if(!wordList){
        return
    }else{
        console.log("Applying words here")
        //applyTextToTiles(grid, randomizedIndexes, tileCount, wordList)        
    }

    return;
}

function getRandomIndexArray(count, seedValue) {
    let myrng = new Math.seedrandom(seedValue);

    let indexArray = [];
    for (let i = 0; i < count; i++) {
        indexArray.push(i);
    }

    indexArray.sort(function (a, b) { return 0.5 - myrng() });
    return indexArray;
}

function colorizeDecoderTiles(grid, randomizedIndexes, startIndex, indexCount, color) {
    let lastIndex = startIndex + indexCount;
    lastIndex = lastIndex > randomizedIndexes.length ? randomizedIndexes.length : lastIndex;
    for (let i = startIndex; i < lastIndex; i++) {
        let selectedBox = grid.childNodes[randomizedIndexes[i]];
        selectedBox.style.backgroundColor = color;
    }
    return lastIndex;
}

function applyTextToTiles(grid, randomizedIndexes, tileCount, textArray) {
    for (let i = 0; i < tileCount; i++) {
        let selectedBox = grid.childNodes[i];
        index = randomizedIndexes[i] % textArray.length;
        selectedBox.textContent = textArray[index];
    }
}

function updateBoardGrid(columns, fractionPerColumn) {
    let grid = document.createElement("div")
    grid.setAttribute("id", boardgameId)
    grid.setAttribute("class", boardGameClass)
    grid.style.gridTemplateColumns = `repeat( ${columns}, auto)`;
    return grid;
}

function createBox(id, tileSizeInVW) {
    var newBox = document.createElement("div");
    newBox.setAttribute("class", boxClass)
    newBox.setAttribute("id", id)
    newBox.style.width = tileSizeInVW * 80 + "vw";
    newBox.style.height = tileSizeInVW * 80 + "vw";
    return newBox;
}

function loadWordsFromCsv() {    
    var objXMLHttpRequest = new XMLHttpRequest();
    objXMLHttpRequest.onreadystatechange = function () {
        if (objXMLHttpRequest.readyState === 4) {
            if (objXMLHttpRequest.status === 200) {                
                wordList = csvToArray(objXMLHttpRequest.responseText);
            } else {
                console.debug('Error Code: ' + objXMLHttpRequest.status);
                console.debug('Error Message: ' + objXMLHttpRequest.statusText);
            }
        }
    }
    objXMLHttpRequest.open('GET', '/csv/de-DE.csv');
    objXMLHttpRequest.send();
}

function csvToArray(csv){
    let arrayOfLines = csv.split(/\r\n|\n/);
    return arrayOfLines;
}