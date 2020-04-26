const boxClass = "box"
const boxName = "decoderTile"


const noAsssassin = "noAsssassin";
const singleAsssassin = "singleAsssassin";
const multipleAssassin = "multipleAssassin";

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
    let myrng;
    if(seedValue != ""){
        myrng = new Math.seedrandom(seedValue);
    }else{
        myrng = new Math.seedrandom();
    }
    
    saveSettings(rowCount, columnCount, seedValue);

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

function saveSettings(rowCount, columnCount, seedValue) {
    localStorage.rowCount = Number(rowCount);
    localStorage.columnCount = Number(columnCount);
    localStorage.seedValue = seedValue;
    localStorage.assassinSetting = getAssassinSetting();
}


function initialize() {
    if (localStorage.rowCount) {
        document.getElementById("rowCount").value = localStorage.rowCount;
    }
    if (localStorage.columnCount) {
        document.getElementById("columnCount").value = localStorage.columnCount;
    }
    if (localStorage.seedValue) {
        document.getElementById("seedValueInput").value = localStorage.seedValue;
    }
    applyAssassinSetting();
    updateDecoder();
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
}
