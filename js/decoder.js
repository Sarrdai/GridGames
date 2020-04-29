const boxClass = "box"
const boxName = "decoderTile"

const boardGameClass = "boardGame"
const boardgameId = "boardGame"

const tileColors ={
    team1: "--team1-color",
    team2: "--team2-color",
    assassin: "--assassin-color",

}


function createBoard(columnCount, rowCount) {

    let height = document.documentElement.clientHeight;
    let width = document.documentElement.clientWidth;

    maxWidthInFr = (height / rowCount) / width;
    maxHeightInFr = (width / columnCount) / height;

    let fractionPerColumn = 0.8 * Math.min(maxWidthInFr, maxHeightInFr)

    let boardGame = updateBoardGrid(columnCount, fractionPerColumn);

    let count = columnCount * rowCount;
    for (let i = 0; i < count; i++) {
        let box = createBox(boxName + i);
        boardGame.appendChild(box);
    }

    return boardGame;
}

function applyDecoderSeed(tileCount, seedValue) {

    let randomizedIndexes = getRandomIndexArray(tileCount, seedValue);

    let teamOneTileCounts = Math.round(tileCount * 0.36);
    let teamTwoTileCounts = teamOneTileCounts - 1;

    let computedStyle = getComputedStyle(document.documentElement);

   /*  let myrng = new Math.seedrandom(seedValue.toUpperCase());
    
    colors = [computedStyle.getPropertyValue(team1PropertyName), computedStyle.getPropertyValue(team2PropertyName)]
    colors.sort(function (a, b) { return 0.5 - myrng() });

    //better way to return startingTeam color withouth knowlege of the outer elements
    document.getElementById("startingTeam").style.backgroundColor = colors[0]; */

    let grid = document.getElementById(boardgameId);
    startIndex = 0;
    let lastIndexTeamOne = colorizeDecoderTiles(grid, randomizedIndexes, startIndex, teamOneTileCounts, computedStyle.getPropertyValue(tileColors.team1));
    let lastIndexTeamTwo = colorizeDecoderTiles(grid, randomizedIndexes, lastIndexTeamOne + 1, teamTwoTileCounts, computedStyle.getPropertyValue(tileColors.team2));
    let lastIndexAssassin = colorizeDecoderTiles(grid, randomizedIndexes, lastIndexTeamTwo + 1, Number(localStorage.assassinCount), computedStyle.getPropertyValue(tileColors.assassin));

    return grid;
}


function applySessionId(tileCount, session) {
    
    let textArray = []
    let grid = document.getElementById(boardgameId);
    let randomizedIndexes = getRandomIndexArray(tileCount, session);
    
    console.log("Applying board game here")
    //applyTextToTiles(grid, randomizedIndexes, tileCount, textArray)

    return grid;
}

function getRandomIndexArray(count, seedValue){
    let myrng = new Math.seedrandom(seedValue.toUpperCase());
    
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

function applyTextToTiles(grid, randomizedIndexes, tileCount, textArray){
    for(let i= 0; i < tileCount; i++){
        let selectedBox = grid.childNodes[i];
        selectedBox.textContent = randomizedIndexes[i];
    }
}

function updateBoardGrid(columns, fractionPerColumn) {
    let grid = document.createElement("div")
    grid.setAttribute("id", boardgameId)
    grid.setAttribute("class", boardGameClass)
    grid.style.gridTemplateColumns = `repeat( ${columns}, ${fractionPerColumn * 100}%)`;
    return grid;
}

function createBox(id) {
    var newBox = document.createElement("div");
    newBox.setAttribute("class", boxClass)
    newBox.setAttribute("id", id)
    return newBox;
}