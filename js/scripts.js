const columnString = "Spalten: "
const rowString = "Zeilen: "
const assassinString= "Assassine: "

var contentProvider;
var csvContainer;
var decoder;

function updateGridBoard() {

    return false;
}

function initialize() {
    
    decoder = new Decoder(5, 5);
    decoder.OnBoardChanged = replaceGameBoard;

    var onFinished = function(csvContainer){
        if(csvContainer.Status == CsvContainer.States.Loaded){
            decoder.WordList = csvContainer.Content;
        }
    }

    csvContainer = new CsvContainer();
    ContentProvider.LoadFromCsv('/csv/de-DE.csv', csvContainer, onFinished);

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

    if(rowCount != undefined){
        onRowCountInputChanged(rowCount);
    }else{
        if(localStorage.rowCount != undefined){
            
            onRowCountInputChanged(localStorage.rowCount);
        }else{            
            
            onRowCountInputChanged(Decoder.DefaultValues.Rows);
        }
    }

    if(columnCount != undefined){
        onColumnCountInputChanged(columnCount);
    }else{
        if(localStorage.columnCount != undefined){
            onColumnCountInputChanged(localStorage.columnCount);
        }else{
            onColumnCountInputChanged(Decoder.DefaultValues.Columns)
        }
    }

    if(assassinCount != undefined){
        onAssassinCountInputChanged(assassinCount);
    }else{
        if(localStorage.assassinCount != undefined){            
            onAssassinCountInputChanged(localStorage.assassinCount);
        }else{
            onAssassinCountInputChanged(Decoder.DefaultValues.Assassins)
        }
    }

    if(decoderSeedValue != undefined){
        onGridBoardSeedValueChanged(decoderSeedValue);
    }else{
        if(localStorage.decoderSeedValue != undefined){
            onGridBoardSeedValueChanged(localStorage.decoderSeedValue);
        }
    }

    if(session != undefined){
        onSessionValueChanged(session);
    }else{
        if(localStorage.session != undefined){
            onSessionValueChanged(localStorage.session)
        }
    }

    updateUrl();
}

function onRowCountInputChanged(value) {
    localStorage.rowCount = Number(value);
    let rowCountText = document.getElementById("rowCountText");
    rowCountText.innerText = rowString + value
    setInputValueById("rowCount", value);
    updateUrl();
    decoder.Rows = value;
}

function onColumnCountInputChanged(value) {
    localStorage.columnCount = Number(value);
    let columnCountText = document.getElementById("columnCountText");
    columnCountText.innerText = columnString + value    
    setInputValueById("columnCount", value);
    updateUrl();
    decoder.Columns = value;
}

function onAssassinCountInputChanged(value) {
    localStorage.assassinCount = Number(value);
    let assassinCountText = document.getElementById("assassinCountText");
    assassinCountText.innerText = assassinString + value
    setInputValueById("assassinCount", value);
    decoder.assassinCount = value;
    updateUrl();
}

function onGridBoardSeedValueChanged(value){
    localStorage.decoderSeedValue = value.toUpperCase();    
    setInputValueById("decoderSeedValueInput", value);
    decoder.DecoderSeed = value;
    document.getElementById("startingTeam").style.backgroundColor = decoder.StartingTeamColor;   
    updateUrl();
}

function onSessionValueChanged(value){
    localStorage.session = value;
    setInputValueById("sessionValueInput", value);
    decoder.Session = value;
    updateUrl();
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

function setInputValueById(id, value){
    let slider = document.getElementById(id);
    slider.value = value;
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

function replaceGameBoard(){
    let gridContainer = document.getElementById("decoder-grid-container");
    gridContainer.innerHTML = "";
    gridContainer.appendChild(decoder.Board);
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




