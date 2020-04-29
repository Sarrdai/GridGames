const columnString = "Colums: "
const rowString = "Rows: "
const assassinString= "Assassins: "

function updateDecoder() {
    let columnCount = localStorage.columnCount;
    let rowCount = localStorage.rowCount;
    let decoderSeedValue = localStorage.decoderSeedValue;
    let session = localStorage.session;

    let grid = createBoard(columnCount, rowCount);
    replaceGameBoard(grid);

    if(localStorage.session != ""){
        applySessionId(columnCount * rowCount, session);
    }
    
    if(localStorage.decoderSeedValue != ""){
        let startingTeamColor = applyDecoderSeed(columnCount * rowCount, decoderSeedValue);
        document.getElementById("startingTeam").style.backgroundColor = startingTeamColor; 
    }
    
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
    var decoderSeedValue = getUrlVars()["decoderSeedValue"];
    var session = getUrlVars()["session"];
    if(rowCount !== undefined && columnCount !== undefined && assassinCount != undefined){
        localStorage.rowCount = rowCount;
        localStorage.columnCount = columnCount;
        localStorage.assassinCount = assassinCount;        
    }

    if(session != undefined){
        localStorage.session = session;
    }

    if(decoderSeedValue != undefined){
        localStorage.decoderSeedValue = decoderSeedValue;
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

    
    let sessionValueElement = document.getElementById("sessionValueInput");
    if (localStorage.session) {
        sessionValueElement.value = localStorage.session;
    } else {
        sessionValueElement.value = Math.random();
    }
    onSessionValueChanged(sessionValueElement.value);


    let decoderSeedValueElement = document.getElementById("decoderSeedValueInput");
    if (localStorage.decoderSeedValue) {
        decoderSeedValueElement.value = localStorage.decoderSeedValue;
    }
    onDecoderSeedValueChanged(decoderSeedValueElement.value);

    let assassinCountElement = document.getElementById("assassinCount");
    if (localStorage.assassinCount) {
        assassinCountElement.value = localStorage.assassinCount;
    }
    onAssassinCountInputChanged(assassinCountElement.value);
}

function replaceGameBoard(grid){
    let gridContainer = document.getElementById("decoder-grid-container");
    gridContainer.innerHTML = "";
    gridContainer.appendChild(grid);
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

function onDecoderSeedValueChanged(value){
    localStorage.decoderSeedValue = value.toUpperCase();
    updateDecoder();
}

function onSessionValueChanged(value){
    localStorage.session = value;
    updateDecoder();
}

function onRandomSessionButtonClicked() {
    let newSession = Math.random();
    document.getElementById("sessionValueInput").value = newSession;    
    onSessionValueChanged(newSession);
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlWithCurrentSettings(){
    var url = new URL(window.location.href);
    var search_params = url.searchParams;
    search_params.set('rowCount', localStorage.rowCount);
    search_params.set('columnCount', localStorage.columnCount);
    search_params.set('assassinCount', localStorage.assassinCount);
    search_params.set('session', localStorage.session);
    search_params.set('decoderSeedValue', localStorage.decoderSeedValue);
    url.searchParams = search_params;
    return url;
}

function updateUrl(){    
    let url = getUrlWithCurrentSettings();
    window.history.pushState({path:url.toString()},'',url.toString());
}




