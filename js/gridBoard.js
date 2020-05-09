

class GridBoard {

    static Ids =
        {
            BoardGame: "boardGame",
        }

    static Class =
        {
            BoardGame: "boardGame",
            Tile: "tile",
        }            

    constructor(columnCount, rowCount) {
        this.TileName = "tile";
        
        this._columns;
        this._rows;
        this._board;

        this.computedStyle = getComputedStyle(document.documentElement);
        this.TileColors = {

            Team2: this.computedStyle.getPropertyValue("--team2-color"),
            Team1: this.computedStyle.getPropertyValue("--team1-color"),
            Assassin: this.computedStyle.getPropertyValue("--assassin-color"),
        
        };      
        
        this._columns = columnCount;
        this._rows = rowCount;

        this._board = this.updateBoardGrid();
        this.addBoardTiles()
    }

    get Rows()
        {
            return this._rows;
        }

    get Columns()
        {
            return this._columns;
        }

    get TileCount()
    {
        return this.Rows * this.Columns;
    }

    get Board(){
        return this._board;
    }

    get Tiles() {
        return this.Board.childNodes;
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
            let newTile = this.createTile(i, tileWidthInPercent);
            this.Board.appendChild(newTile);
        }
    }

    updateBoardGrid() {
        let grid = document.createElement("div")
        grid.setAttribute("id", GridBoard.Ids.BoardGame)
        grid.setAttribute("class", GridBoard.Class.BoardGame)
        grid.style.gridTemplateColumns = `repeat( ${this.Columns}, auto)`;
        return grid;
    }
    
    createTile(index, tileSizeInVW) {
        var newTile = document.createElement("div");
        newTile.setAttribute("class", GridBoard.Class.Tile)
        newTile.setAttribute("id", this.TileName + index)
        newTile.style.width = tileSizeInVW * 80 + "vw";
        newTile.style.height = tileSizeInVW * 80 + "vw";
        return newTile;
    }
    
    //decoder
    getRandomIndexArray(startIndex, lastIndex, seedValue) {
        let myrng = new Math.seedrandom(seedValue);
    
        let indexArray = [];
        for (let i = startIndex; i <= lastIndex; i++) {
            indexArray.push(i);
        }
    
        indexArray.sort(function (a, b) { return 0.5 - myrng() });
        return indexArray;
    }
                
}

class Decoder extends GridBoard{
    constructor(columSize, rowSize){
        super(columSize, rowSize);
        this.wordList;
    }

    get WordList(){
        return this.wordList;
    }
  
    set WordList(value)
    {
        this.wordList = value;
    }

    //decoder
    applyGridBoardSeed(seedValue) {
    
        let randomizedIndexes = this.getRandomIndexArray(0, this.TileCount-1, seedValue);
    
        let teamOneTileCounts = Math.round(this.TileCount * 0.36);
        let teamTwoTileCounts = teamOneTileCounts - 1;
    
        let colors = this.getTeamOrder(seedValue);
    
        let grid = document.getElementById(GridBoard.Ids.BoardGame);
        let startIndex = 0;
        let lastIndexTeamOne = this.colorizeGridBoardTiles(randomizedIndexes, startIndex, teamOneTileCounts, colors[0]);
        let lastIndexTeamTwo = this.colorizeGridBoardTiles(randomizedIndexes, lastIndexTeamOne + 1, teamTwoTileCounts, colors[1]);
        let lastIndexAssassin = this.colorizeGridBoardTiles(randomizedIndexes, lastIndexTeamTwo + 1, Number(localStorage.assassinCount), this.TileColors.Assassin);
    
        let startingTeamColor = colors[0];
        return startingTeamColor;
    }
    
    //decoder
    getTeamOrder(seedValue) {
        let myrng = new Math.seedrandom(seedValue);
        let colors = [this.TileColors.Team1, this.TileColors.Team2]
        colors.sort(function (a, b) { return 0.5 - myrng() });
        return colors;
    }
    
    //decoder
    applySessionId(session) {
    
        if(!this.WordList){
            console.log("applySessionId was called but there is no WordList available.")
            return
        }else{
            console.log("Applying words here")
            let randomizedIndexes = this.getRandomIndexArray(0, this.WordList.length -1, session);
            this.applyTextToTiles(randomizedIndexes, this.WordList)        
        }
    
        return;
    }        
    
    //decoder
    colorizeGridBoardTiles(randomizedIndexes, startIndex, indexCount, color) {
        let lastIndex = startIndex + indexCount;
        lastIndex = lastIndex > randomizedIndexes.length ? randomizedIndexes.length : lastIndex;
        for (let i = startIndex; i < lastIndex; i++) {
            let selectedTile = this.Tiles[randomizedIndexes[i]];
            selectedTile.style.backgroundColor = color;
        }
        return lastIndex;
    }
    
    //decoder
    applyTextToTiles(randomizedIndexes, textArray) {
        for (let i = 0; i < this.TileCount; i++) {
            let selectedTile = this.Tiles[i];
            let index = randomizedIndexes[i % randomizedIndexes.length];
            selectedTile.textContent = textArray[index];
        }
    }
}

class CsvContainer{
    
    static States = 
    {
        Empty: "csv_container_is_empty",
        Loaded: "csv_container_is_loaded",
    }
    
    constructor(){
        this.contentArray;    
        this.sourcePath;    
    }
    
    get Content(){
        return this.contentArray;
    }

    set Content(value){
        this.contentArray = value;
    }

    get SourcePath(){
        return this.sourcePath;
    }

    set SourcePath(value){
        this.sourcePath = value;
    }

    get Status(){
        return (!this.Content || !this.SourcePath) ? CsvContainer.States.Empty : CsvContainer.States.Loaded;
    }
}

class ContentProvider{
    constructor(){
            
    }
    
    //csv
    static LoadFromCsv(path, csvContainer) {     
        let objXMLHttpRequest = new XMLHttpRequest();       
        objXMLHttpRequest.onreadystatechange = function () {
            if (objXMLHttpRequest.readyState === 4) {
                if (objXMLHttpRequest.status === 200) {                
                    csvContainer.Content = ContentProvider.csvToArray(objXMLHttpRequest.responseText);
                    csvContainer.SourcePath = path;
                } else {
                    console.debug('Error Code: ' + objXMLHttpRequest.status);
                    console.debug('Error Message: ' + objXMLHttpRequest.statusText);
                }
            }
        };
        objXMLHttpRequest.open('GET', path);
        objXMLHttpRequest.send();
    }
    
    //csv
    static csvToArray(csv){
        let arrayOfLines = csv.split(/\r\n|\n/);
        return arrayOfLines;
    }
}


