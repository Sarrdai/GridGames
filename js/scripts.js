const boxClass = "box"
const boxName = "boxTile"

function changeColorById() {
    let boxId = document.getElementById("boxSelector").value - 1
    let selectedBox = document.getElementById(boxName + boxId);
    selectedBox.style.backgroundColor = "blue";
}

function createBox(id) {
    var newBox = document.createElement("div");
    newBox.setAttribute("class", boxClass)
    newBox.setAttribute("id", id)
    return newBox;
}

function addBoxes() {
    let columnCount = document.getElementById("columnCount").value;
    let rowCount = document.getElementById("rowCount").value;
    let count = columnCount * rowCount;
    
    let grid = updateMainGrid(columnCount);

    for (let i = 0; i < count; i++) {
        let boxIndex = i;
        let box = createBox(boxName + boxIndex);
        grid.appendChild(box);
    }
    return false;
}

function updateMainGrid(columns) {
    let grid = document.getElementById("mainGrid");
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = createGridcolumnsConfig(columns);
    return grid;
}

function createGridcolumnsConfig(columns) {
    var config = "";
    for (let i = 0; i < columns - 1; i++) {
        config += "1fr "
    }
    config += "1fr"
    return config;
}