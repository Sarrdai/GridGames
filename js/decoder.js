class GridBoard {

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
        this.BoxName = "tile";
        
        this._columns;
        this._rows;
        this._board;

        this.computedStyle = getComputedStyle(document.documentElement);
        this.TileColors = {

            Team2: this.computedStyle.getPropertyValue("--team2-color"),
            Team1: this.computedStyle.getPropertyValue("--team1-color"),
            Assassin: this.computedStyle.getPropertyValue("--assassin-color"),
        
        };        
    }

    get Rows()
        {
            return this._rows;
        }

    get Columns()
        {
            return this._columns;
        }

    get Board(){
        return this._board;
    }

    createBoard(columnCount, rowCount) {

        this._columns = columnCount;
        this._rows = rowCount;

        this._board = this.updateBoardGrid();
        this.addBoardTiles()
    }
    
    addBoardTiles() {
    
        let height = document.documentElement.clientHeight;
        let width = document.documentElement.clientWidth;
    
        let maxWidthInPx = (height / this.Rows);
        let maxHeightInPx = (width / this.Columns);
    
        let tileSizeInPx = Math.min(maxWidthInPx, maxHeightInPx);
        let tileWidthInPercent = tileSizeInPx / width;
    
        let count = this.Columns * this.Rows;
        for (let i = 0; i < count; i++) {
            let box = this.createBox(this.BoxName + i, tileWidthInPercent);
            this.Board.appendChild(box);
        }
    }
    
    applyGridBoardSeed(tileCount, seedValue) {
    
        let randomizedIndexes = this.getRandomIndexArray(tileCount, seedValue);
    
        let teamOneTileCounts = Math.round(tileCount * 0.36);
        let teamTwoTileCounts = teamOneTileCounts - 1;
    
        let colors = this.getTeamOrder(seedValue);
    
        let grid = document.getElementById(GridBoard.Ids.BoardGame);
        let startIndex = 0;
        let lastIndexTeamOne = this.colorizeGridBoardTiles(grid, randomizedIndexes, startIndex, teamOneTileCounts, colors[0]);
        let lastIndexTeamTwo = this.colorizeGridBoardTiles(grid, randomizedIndexes, lastIndexTeamOne + 1, teamTwoTileCounts, colors[1]);
        let lastIndexAssassin = this.colorizeGridBoardTiles(grid, randomizedIndexes, lastIndexTeamTwo + 1, Number(localStorage.assassinCount), this.TileColors.Assassin);
    
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
        let grid = document.getElementById(GridBoard.Ids.BoardGame);
        let randomizedIndexes = this.getRandomIndexArray(tileCount, session);
        
        if(!this.WordList){
            return
        }else{
            console.log("Applying words here")
            applyTextToTiles(grid, randomizedIndexes, tileCount, wordList)        
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
    
    colorizeGridBoardTiles(grid, randomizedIndexes, startIndex, indexCount, color) {
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
    
    updateBoardGrid() {
        let grid = document.createElement("div")
        grid.setAttribute("id", GridBoard.Ids.BoardGame)
        grid.setAttribute("class", GridBoard.Class.BoardGame)
        grid.style.gridTemplateColumns = `repeat( ${this.Columns}, auto)`;
        return grid;
    }
    
    createBox(id, tileSizeInVW) {
        var newBox = document.createElement("div");
        newBox.setAttribute("class", GridBoard.Class.Box)
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
                    this.WordList = GridBoard.csvToArray(objXMLHttpRequest.responseText);
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




