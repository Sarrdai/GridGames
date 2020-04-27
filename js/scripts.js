const columnString = "Colums: "
const rowString = "Rows: "
const assassinString= "Assassins: "

function updateDecoder() {
    let columnCount = document.getElementById("columnCount").value;
    let rowCount = document.getElementById("rowCount").value;
    let seedValue = document.getElementById("seedValueInput").value;

    let grid = createDecoder(columnCount, rowCount, seedValue)
    let gridContainer = document.getElementById("decoder-grid-container");
    gridContainer.innerHTML = "";
    gridContainer.appendChild(grid);

    updateUrl();
    return false;
}

function initialize() {

    let computedStyle = getComputedStyle(document.documentElement);
    var metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'theme-color');
    metaTag.content = `${computedStyle.getPropertyValue('--primary-color')}`;
    document.getElementsByTagName('head')[0].appendChild(metaTag)

    var rowCount = getUrlVars()["rowCount"];
    var columnCount = getUrlVars()["columnCount"];
    var assassinCount = getUrlVars()["assassinCount"];
    var session = getUrlVars()["session"];
    if(rowCount !== undefined && columnCount !== undefined && assassinCount != undefined && session != undefined){
        localStorage.rowCount = rowCount;
        localStorage.columnCount = columnCount;
        localStorage.assassinCount = assassinCount;
        localStorage.seedValue = session;
    }


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
    } else {
        seedValueElement.value = Math.random();
    }
    onSeedValueChanged(seedValueElement.value);

    let assassinCountElement = document.getElementById("assassinCount");
    if (localStorage.assassinCount) {
        assassinCountElement.value = localStorage.assassinCount;
    }
    onAssassinCountInputChanged(assassinCountElement.value);
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


function onRowCountInputChanged(value) {
    localStorage.rowCount = Number(value);
    let rowCountText = document.getElementById("rowCountText");
    rowCountText.innerText = rowString + value
    updateDecoder();
}

function onColumnCountInputChanged(value) {
    localStorage.columnCount = Number(value);
    let columnCountText = document.getElementById("columnCountText");
    columnCountText.innerText = columnString + value
    updateDecoder();
}

function onAssassinCountInputChanged(value) {
    localStorage.assassinCount = Number(value);
    let assassinCountText = document.getElementById("assassinCountText");
    assassinCountText.innerText = assassinString + value
    updateDecoder();
}


function onSeedValueChanged(value) {
    localStorage.seedValue = value;
    updateDecoder();
}

function onRandomizeButtonClicked() {
    let newSeed = Math.random();
    document.getElementById("seedValueInput").value = newSeed;
    onSeedValueChanged(newSeed);
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function updateUrl(){    
    var url = new URL(window.location.href);
    var search_params = url.searchParams;
    search_params.set('rowCount', localStorage.rowCount);
    search_params.set('columnCount', localStorage.columnCount);
    search_params.set('assassinCount', localStorage.assassinCount);
    search_params.set('session', localStorage.seedValue);
    url.searchParams = search_params;
    window.history.pushState({path:url.toString()},'',url.toString());
}




