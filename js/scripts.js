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
    let count = document.getElementById("boxNumbers").value;
    
    let grid = document.getElementById("mainGrid");
    if(grid == null || grid == "undefined"){
        grid = createGrid(5);
    }    
    
    let existingBoxes = document.getElementsByClassName(boxClass).length;
    for (let i = 0; i < count; i++) {
        let boxIndex = i + existingBoxes;
        let box = createBox(boxName + boxIndex);      
        grid.appendChild(box);
    }
    document.body.appendChild(grid);
    return false;
}

function createGrid(columns){
    let grid = document.createElement("div");
    grid.setAttribute("class", "grid-container")
    grid.setAttribute("grid-template-columns", createGridcolumnsConfig(columns))
    grid.setAttribute("id", "mainGrid")
    return grid;
}

function createGridcolumnsConfig(columns){
    var config ="";
    for(let i = 0; i< columns - 1; i++){
        config += "1fr "
    }
    config += "1fr"
    return config;
}