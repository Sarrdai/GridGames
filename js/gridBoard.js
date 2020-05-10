class GridBoard {

    static Ids =
        {
            BoardGame: "boardGame",
        }

    static Class =
        {
            BoardGame: "boardGame",
            Tile: "tile",
            TileText: "tileText",
        }            

    constructor(columnCount, rowCount) {
        this.TileName = "tile";
        this.TileTextName = "tileText"
        
        this._columns;
        this._rows;
        this._board;       
        this._onBoardChanged; 
        
        this._columns = columnCount;
        this._rows = rowCount;

        this.updateBoardGrid();        
    }

    get Rows()
        {
            return this._rows;
        }

    set Rows(value)
    {
        this._rows = value;
        this.updateBoardGrid();
    }


    get Columns()
        {
            return this._columns;
        }

        set Columns(value)
        {
            this._columns = value;
            this.updateBoardGrid();
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

    set OnBoardChanged(value){
        this._onBoardChanged = value;
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
        this._board = document.createElement("div")
        this._board.setAttribute("id", GridBoard.Ids.BoardGame)
        this._board.setAttribute("class", GridBoard.Class.BoardGame)
        this._board.style.gridTemplateColumns = `repeat( ${this.Columns}, auto)`;
        this.addBoardTiles()      
        if(this._onBoardChanged != undefined){
            this._onBoardChanged();
        }
    }
    
    createTile(index, tileSizeInVW) {
        var newTile = document.createElement("div");
        newTile.setAttribute("class", GridBoard.Class.Tile)
        newTile.setAttribute("id", this.TileName + index)
        newTile.style.width = tileSizeInVW * 80 + "vw";
        newTile.style.height = tileSizeInVW * 80 + "vw";

        var newTileText = document.createElement("div");
        newTileText.setAttribute("class", GridBoard.Class.TileText)
        newTileText.setAttribute("id", this.TileTextName + index)

        newTile.appendChild(newTileText);

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
    
    static DefaultValues =
        {
            Rows: 5,
            Columns: 5,
            Assassins: 1,
        }      

        static TileColors = {

            Team2: getComputedStyle(document.documentElement).getPropertyValue("--team2-color").trim(),
            Team1: getComputedStyle(document.documentElement).getPropertyValue("--team1-color").trim(),
            Assassin: getComputedStyle(document.documentElement).getPropertyValue("--assassin-color").trim(),
        
        };
        
    constructor(){
        super(Decoder.DefaultValues.Columns, Decoder.DefaultValues.Rows);
        this.wordList;
        this._assassinCount;
        this._session;
        this._decoderSeed;
        this._startingTeamColor;        
    }

    get DecoderSeed(){
        return this._decoderSeed;
    }

    set DecoderSeed(value){
        if(value == undefined){return;}
        this._decoderSeed = value.toUpperCase();
        this.applyGridBoardSeed(this._decoderSeed);
    }

    get Session(){
        return this._session;
    }

    set Session(value){
        this._session = value.toUpperCase();
        this.applySessionId(this._session);
    }

    get AssassinCount(){
        return this._assassinCount;        
    }

    set AssassinCount(value){
        this._assassinCount = value;
        this.applyGridBoardSeed(this.DecoderSeed);
    }

    get StartingTeamColor(){
        return this._startingTeamColor;
    }

    get WordList(){
        return this.wordList;
    }
  
    set WordList(value)
    {
        this.wordList = value;
        this.applySessionId(this.Session)
    }

    get SpyMasterMode()
    {
        return (this.DecoderSeed != "" && this.DecoderSeed != undefined)
    }

    updateBoardGrid(){
        super.updateBoardGrid();

        if(this.Session != undefined && this.Session != ""){
            this.applySessionId(this.Session);
        }

       
        this.applyGridBoardSeed(this.DecoderSeed);
        
    }

    //decoder
    applyGridBoardSeed(seedValue) {
        
        this.clearBoardColors();

        if(this.SpyMasterMode){
            this.disableTileClick();
            
            let randomizedIndexes = this.getRandomIndexArray(0, this.TileCount-1, seedValue);
    
            let teamOneTileCounts = Math.round(this.TileCount * 0.36);
            let teamTwoTileCounts = teamOneTileCounts - 1;
        
            let colors = this.getTeamOrder(seedValue);
        
            let startIndex = 0;
            let lastIndexTeamOne = this.colorizeGridBoardTiles(randomizedIndexes, startIndex, teamOneTileCounts, colors[0]);
            let lastIndexTeamTwo = this.colorizeGridBoardTiles(randomizedIndexes, lastIndexTeamOne, teamTwoTileCounts, colors[1]);
            let lastIndexAssassin = this.colorizeGridBoardTiles(randomizedIndexes, lastIndexTeamTwo, Number(localStorage.assassinCount), Decoder.TileColors.Assassin);
        
            this._startingTeamColor = colors[0];
        
    }else{
        this.enableTileClick();
    }    
}

clearBoardColors(){
    let allIndexes = [];
    for(let i = 0; i < this.TileCount; i++){
        allIndexes.push(i);
    }
    this._startingTeamColor = this.colorizeGridBoardTiles(allIndexes, 0, this.TileCount, null);    
}

onTileClick(event){
        let selectedElement;
        if(event.target.className = GridBoard.Class.TileText){        
            selectedElement = event.target.parentNode;
        }else{
            selectedElement = event.target;
        }    
        let nextColor = Decoder.getNextColor(selectedElement.style.backgroundColor);
        selectedElement.style.backgroundColor = nextColor;
}

enableTileClick()
{
    this.Board.childNodes.forEach(tile => {
        tile.onclick = this.onTileClick;
        tile.style.cursor = "pointer";
    });
}

disableTileClick(){
    this.Board.childNodes.forEach(tile => {
        tile.onclick = null;
        tile.style.cursor = null;
    });
}


static getNextColor(currentColor){
    switch(currentColor) {
        case Decoder.TileColors.Team1:
          return Decoder.TileColors.Team2;
        case Decoder.TileColors.Team2:
            return Decoder.TileColors.Assassin;
        case Decoder.TileColors.Assassin:
            return null;
        default:
            return Decoder.TileColors.Team1;
      }
}
    
    //decoder
    getTeamOrder(seedValue) {
        let myrng = new Math.seedrandom(seedValue);
        let colors = [Decoder.TileColors.Team1, Decoder.TileColors.Team2]
        colors.sort(function (a, b) { return 0.5 - myrng() });
        return colors;
    }
    
    //decoder
    applySessionId(session) {
        
        if(!this.SpyMasterMode){
        this.clearBoardColors();
        }

        if(!this.WordList){
            console.log("applySessionId was called but there is no WordList available.")
            return
        }else{
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
            let selectedTileText = this.Tiles[i].childNodes[0];
            let index = randomizedIndexes[i % randomizedIndexes.length];
            selectedTileText.textContent = textArray[index];
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
    static LoadFromCsv(path, csvContainer, onFinished) {     
        let objXMLHttpRequest = new XMLHttpRequest();       
        objXMLHttpRequest.onreadystatechange = function () {
            if (objXMLHttpRequest.readyState === 4) {
                if (objXMLHttpRequest.status === 200) {                
                    csvContainer.Content = ContentProvider.csvToArray(objXMLHttpRequest.responseText);
                    csvContainer.SourcePath = path;
                    onFinished(csvContainer);
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


