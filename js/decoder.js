class Decoder {

    static Ids =
        {
            BoardGame: "boardGame",
        }

    static Class =
        {
            BoardGame: "boardGame",
            Box: "box",
        }            

    constructor() {
        this.WordList;
        this.BoxName = "decoderTile"

        this.computedStyle = getComputedStyle(document.documentElement);
        this.TileColors = {

            Team2: this.computedStyle.getPropertyValue("--team2-color"),
            Team1: this.computedStyle.getPropertyValue("--team1-color"),
            Assassin: this.computedStyle.getPropertyValue("--assassin-color"),
        
        }
    }

    createBoard(columnCount, rowCount) {

        let boardGame = this.updateBoardGrid(columnCount, rowCount);
        this.addBoardTiles(boardGame, columnCount, rowCount)
    
        return boardGame;
    }
    
    addBoardTiles(boardGame, columnCount, rowCount) {
    
        let height = document.documentElement.clientHeight;
        let width = document.documentElement.clientWidth;
    
        let maxWidthInPx = (height / rowCount);
        let maxHeightInPx = (width / columnCount);
    
        let tileSizeInPx = Math.min(maxWidthInPx, maxHeightInPx);
        let tileWidthInPercent = tileSizeInPx / width;
    
        let count = columnCount * rowCount;
        for (let i = 0; i < count; i++) {
            let box = this.createBox(this.BoxName + i, tileWidthInPercent);
            boardGame.appendChild(box);
        }
    }
    
    applyDecoderSeed(tileCount, seedValue) {
    
        let randomizedIndexes = this.getRandomIndexArray(tileCount, seedValue);
    
        let teamOneTileCounts = Math.round(tileCount * 0.36);
        let teamTwoTileCounts = teamOneTileCounts - 1;
    
        let colors = this.getTeamOrder(seedValue);
    
        let grid = document.getElementById(Decoder.Ids.BoardGame);
        let startIndex = 0;
        let lastIndexTeamOne = this.colorizeDecoderTiles(grid, randomizedIndexes, startIndex, teamOneTileCounts, colors[0]);
        let lastIndexTeamTwo = this.colorizeDecoderTiles(grid, randomizedIndexes, lastIndexTeamOne + 1, teamTwoTileCounts, colors[1]);
        let lastIndexAssassin = this.colorizeDecoderTiles(grid, randomizedIndexes, lastIndexTeamTwo + 1, Number(localStorage.assassinCount), this.TileColors.Assassin);
    
        return colors[0];
    }
    
    getTeamOrder(session) {
        let myrng = new Math.seedrandom(session);
        let colors = [this.TileColors.Team1, this.TileColors.Team2]
        colors.sort(function (a, b) { return 0.5 - myrng() });
        return colors;
    }
    
    
    applySessionId(tileCount, session) {
    
        let textArray = []
        let grid = document.getElementById(Decoder.Ids.BoardGame);
        let randomizedIndexes = this.getRandomIndexArray(tileCount, session);
        
        if(!this.WordList){
            return
        }else{
            console.log("Applying words here")
            //applyTextToTiles(grid, randomizedIndexes, tileCount, wordList)        
        }
    
        return;
    }
    
    getRandomIndexArray(count, seedValue) {
        let myrng = new Math.seedrandom(seedValue);
    
        let indexArray = [];
        for (let i = 0; i < count; i++) {
            indexArray.push(i);
        }
    
        indexArray.sort(function (a, b) { return 0.5 - myrng() });
        return indexArray;
    }
    
    colorizeDecoderTiles(grid, randomizedIndexes, startIndex, indexCount, color) {
        let lastIndex = startIndex + indexCount;
        lastIndex = lastIndex > randomizedIndexes.length ? randomizedIndexes.length : lastIndex;
        for (let i = startIndex; i < lastIndex; i++) {
            let selectedBox = grid.childNodes[randomizedIndexes[i]];
            selectedBox.style.backgroundColor = color;
        }
        return lastIndex;
    }
    
    applyTextToTiles(grid, randomizedIndexes, tileCount, textArray) {
        for (let i = 0; i < tileCount; i++) {
            let selectedBox = grid.childNodes[i];
            index = randomizedIndexes[i] % textArray.length;
            selectedBox.textContent = textArray[index];
        }
    }
    
    updateBoardGrid(columns, fractionPerColumn) {
        let grid = document.createElement("div")
        grid.setAttribute("id", Decoder.Ids.BoardGame)
        grid.setAttribute("class", Decoder.Class.BoardGame)
        grid.style.gridTemplateColumns = `repeat( ${columns}, auto)`;
        return grid;
    }
    
    createBox(id, tileSizeInVW) {
        var newBox = document.createElement("div");
        newBox.setAttribute("class", Decoder.Class.Box)
        newBox.setAttribute("id", id)
        newBox.style.width = tileSizeInVW * 80 + "vw";
        newBox.style.height = tileSizeInVW * 80 + "vw";
        return newBox;
    }
    
    loadWordsFromCsv() {    
        var objXMLHttpRequest = new XMLHttpRequest();
        objXMLHttpRequest.onreadystatechange = function () {
            if (objXMLHttpRequest.readyState === 4) {
                if (objXMLHttpRequest.status === 200) {                
                    this.WordList = Decoder.csvToArray(objXMLHttpRequest.responseText);
                } else {
                    console.debug('Error Code: ' + objXMLHttpRequest.status);
                    console.debug('Error Message: ' + objXMLHttpRequest.statusText);
                }
            }
        }
        objXMLHttpRequest.open('GET', '/csv/de-DE.csv');
        objXMLHttpRequest.send();
    }
    
    static csvToArray(csv){
        let arrayOfLines = csv.split(/\r\n|\n/);
        return arrayOfLines;
    }


}




