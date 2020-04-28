const boxClass = "box"
const boxName = "decoderTile"

function createDecoder(columnCount, rowCount, seedValue) {
    
    let myrng = new Math.seedrandom(seedValue.toUpperCase());

    let count = columnCount * rowCount;

    let height = document.documentElement.clientHeight;
    let width = document.documentElement.clientWidth;

    maxWidthInFr =(height / rowCount) / width;
    maxHeightInFr = (width / columnCount) / height;

    let fractionPerColumn = 0.8 * Math.min(maxWidthInFr, maxHeightInFr)

    let grid = updateDecoderGrid(columnCount, fractionPerColumn);

    let randomizedIndexes = [];
    for (let i = 0; i < count; i++) {
        let box = createBox(boxName + i);
        grid.appendChild(box);
        randomizedIndexes.push(i);        
    }
    randomizedIndexes.sort(function (a, b) { return 0.5 - myrng() });

    let teamOneTileCounts = Math.round(count * 0.36);
    let teamTwoTileCounts = teamOneTileCounts - 1;

    //load csv from js?
    let computedStyle = getComputedStyle(document.documentElement);
    colors = [computedStyle.getPropertyValue('--team1-color'), computedStyle.getPropertyValue('--team2-color')]
    colors.sort(function (a, b) { return 0.5 - myrng() });

    //better way to return startingTeam color withouth knowlege of the outer elements
    document.getElementById("startingTeam").style.backgroundColor = colors[0];
    
    startIndex = 0;
    let lastIndexTeamOne = colorizeDecoderTiles(grid, randomizedIndexes, startIndex, teamOneTileCounts, colors[0]);
    let lastIndexTeamTwo = colorizeDecoderTiles(grid, randomizedIndexes, lastIndexTeamOne + 1, teamTwoTileCounts, colors[1]);
    let lastIndexAssassin = colorizeDecoderTiles(grid, randomizedIndexes, lastIndexTeamTwo + 1, Number(localStorage.assassinCount), computedStyle.getPropertyValue('--assassin-color'));

    function colorizeDecoderTiles(grid, randomizedIndexes, startIndex, indexCount, color) {
        let lastIndex = startIndex + indexCount;        
        lastIndex = lastIndex > randomizedIndexes.length ? randomizedIndexes.length : lastIndex;
        for (let i = startIndex; i < lastIndex; i++) {
            let selectedBox = grid.childNodes[randomizedIndexes[i]];
            selectedBox.style.backgroundColor = color;
        }
        return lastIndex;
    }

    return grid;
}

function updateDecoderGrid(columns, fractionPerColumn) {
    let grid = document.createElement("div")
    grid.setAttribute("class","decoderGrid")
    grid.style.gridTemplateColumns = `repeat( ${columns}, ${fractionPerColumn * 100}%)`;
    return grid;
}

function createBox(id) {
    var newBox = document.createElement("div");
    newBox.setAttribute("class", boxClass)
    newBox.setAttribute("id", id)
    return newBox;
}