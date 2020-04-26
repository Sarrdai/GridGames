const boxClass = "box"
const boxName = "decoderTile"


const noAsssassin = "noAsssassin";
const singleAsssassin = "singleAsssassin";
const multipleAssassin = "multipleAssassin";

const columnString = "Colums: "
const rowString = "Row: "

function colorizeDecoderTiles(boxIds, startIndex, indexCount, color) {
    let lastIndex = startIndex;
    for (let i = startIndex; i < startIndex + indexCount; i++) {
        let selectedBox = document.getElementById(boxIds[i]);
        selectedBox.style.backgroundColor = color;
        lastIndex = i;
    }
    return lastIndex;
}

function createBox(id) {
    var newBox = document.createElement("div");
    newBox.setAttribute("class", boxClass)
    newBox.setAttribute("id", id)
    return newBox;
}

function updateDecoder() {
    let columnCount = document.getElementById("columnCount").value;
    let rowCount = document.getElementById("rowCount").value;
    let seedValue = document.getElementById("seedValueInput").value;
    
    let myrng = new Math.seedrandom(seedValue);
    
    let count = columnCount * rowCount;
    let grid = updateDecoderGrid(columnCount);

    let boxIds = [];
    for (let i = 0; i < count; i++) {
        let boxIndex = i;
        let box = createBox(boxName + boxIndex);
        grid.appendChild(box);
        boxIds.push(box.id);
        boxIds.sort(function (a, b) { return 0.5 - myrng() });
    }

    let teamOneTileCounts = count * 0.36;
    let teamTwoTileCounts = teamOneTileCounts - 1;

    let assassinCount;
    switch (getAssassinSetting()) {
        case noAsssassin:
            assassinCount = 0;
            break;
        case singleAsssassin:
            assassinCount = 1
            break;
        case multipleAssassin:
            assassinCount = count * 0.04;
            break;
        default:
            assassinCount = 1
            break;
    }


    colors = ["blue", "red"]
    colors.sort(function (a, b) { return 0.5 - myrng() });
    document.getElementById("startingTeam").style.backgroundColor = colors[0];

    startIndex = 0;
    let lastIndexTeamOne = colorizeDecoderTiles(boxIds, startIndex, teamOneTileCounts, colors[0]);
    let lastIndexTeamTwo = colorizeDecoderTiles(boxIds, lastIndexTeamOne + 1, teamTwoTileCounts, colors[1]);
    let lastIndexAssassin = colorizeDecoderTiles(boxIds, lastIndexTeamTwo + 1, assassinCount, "black");

    return false;
}

function updateDecoderGrid(columns) {
    let grid = document.getElementById("decoderGrid");
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = createGridcolumnsPropertyValue(columns);
    return grid;
}

function createGridcolumnsPropertyValue(columns) {
    var config = "";
    for (let i = 0; i < columns - 1; i++) {
        config += "1fr "
    }
    config += "1fr"
    return config;
}

function initialize() {

    let rowCountElement = document.getElementById("rowCount");
    if (localStorage.rowCount) {
         rowCountElement.value = localStorage.rowCount;        
    }
    onRowCountInputChanged(rowCountElement.value)

    let columnCountElement = document.getElementById("columnCount");
    if (localStorage.columnCount) {
        columnCountElement.value = localStorage.columnCount;
        
    }
    onColumnCountInputChanged(columnCountElement.value);

    let seedValueElement = document.getElementById("seedValueInput");
    if (localStorage.seedValue) {
       seedValueElement.value = localStorage.seedValue;
    }else{
        seedValueElement.value = Math.random();
    }
    onSeedValueChanged(seedValueElement.value);
        
    applyAssassinSetting();
}

function getAssassinSetting() {
    let assassinSetupRadioGroup = document.getElementsByName("assassinSetup")
    var selectedSetting;

    for (let i = 0; i < assassinSetupRadioGroup.length; i++) {
        if (assassinSetupRadioGroup[i].checked) {
            selectedSetting = assassinSetupRadioGroup[i].value;
        }
    }

    return selectedSetting;
}

function applyAssassinSetting() {
    let assassinSetupRadioGroup = document.getElementsByName("assassinSetup")
    for (let i = 0; i < assassinSetupRadioGroup.length; i++) {
        if (assassinSetupRadioGroup[i].value == localStorage.assassinSetting) {
            assassinSetupRadioGroup[i].checked = true;
        }
    }
    updateDecoder();
}

function onRowCountInputChanged(value){
    localStorage.rowCount = Number(value);
    let rowCountText = document.getElementById("rowCountText");
    rowCountText.innerText = rowString + value
    updateDecoder();
}

function onColumnCountInputChanged(value){
    localStorage.columnCount = Number(value);
    let columnCountText = document.getElementById("columnCountText");
    columnCountText.innerText = columnString + value
    updateDecoder();
}

function onSeedValueChanged(value){
    localStorage.seedValue = value;
    updateDecoder();
}

function onAssassinRadioButtonChanged(value){
    localStorage.assassinSetting = getAssassinSetting();
    updateDecoder();
}

function onRandomizeButtonClicked(){
    let newSeed = Math.random();
    document.getElementById("seedValueInput").value = newSeed;
    onSeedValueChanged(newSeed);
}


