const columnString = "Spalten: "
const rowString = "Zeilen: "
const assassinString = "Assassine: "

var contentProvider;
var csvContainer;
var decoder;

//init
function initialize() {
    localStorage.clear();
    decoder = new Decoder();
    decoder.OnBoardChanged = replaceGameBoard;

    var onFinished = function (csvContainer) {
        if (csvContainer.Status == CsvContainer.States.Loaded) {
            decoder.WordList = csvContainer.Content;
        }
    }

    csvContainer = new CsvContainer();
    ContentProvider.LoadFromCsv('./csv/de-DE.csv', csvContainer, onFinished);

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

    if (rowCount != undefined) {
        onRowCountInputChanged(rowCount);
    } else {
        if (localStorage.rowCount != undefined) {

            onRowCountInputChanged(localStorage.rowCount);
        } else {

            onRowCountInputChanged(Decoder.DefaultValues.Rows);
        }
    }

    if (columnCount != undefined) {
        onColumnCountInputChanged(columnCount);
    } else {
        if (localStorage.columnCount != undefined) {
            onColumnCountInputChanged(localStorage.columnCount);
        } else {
            onColumnCountInputChanged(Decoder.DefaultValues.Columns)
        }
    }

    if (assassinCount != undefined) {
        onAssassinCountInputChanged(assassinCount);
    } else {
        if (localStorage.assassinCount != undefined) {
            onAssassinCountInputChanged(localStorage.assassinCount);
        } else {
            onAssassinCountInputChanged(Decoder.DefaultValues.Assassins)
        }
    }

    if (decoderSeedValue != undefined) {
        onGridBoardSeedValueChanged(decoderSeedValue);
    } else {
        if (localStorage.decoderSeedValue != undefined) {
            onGridBoardSeedValueChanged(localStorage.decoderSeedValue);
        }
    }

    if (session != undefined) {
        onSessionValueChanged(session);
    } else {
        if (localStorage.session != undefined) {
            onSessionValueChanged(localStorage.session)
        }
    }

    updateUrl();
}

// on input changed
function onRowCountInputChanged(value) {
    localStorage.rowCount = Number(value);
    let rowCountText = document.getElementById("rowCountText");
    if(rowCountText){
        rowCountText.innerText = rowString + value
    }    
    setInputValueById("rowCount", value);
    updateUrl();
    decoder.Rows = value;
}

function onColumnCountInputChanged(value) {
    localStorage.columnCount = Number(value);
    let columnCountText = document.getElementById("columnCountText");
    if(columnCountText){
        columnCountText.innerText = columnString + value;
    }
    setInputValueById("columnCount", value);
    updateUrl();
    decoder.Columns = value;
}

function onAssassinCountInputChanged(value) {
    localStorage.assassinCount = Number(value);
    let assassinCountText = document.getElementById("assassinCountText");
    if(assassinCountText){
        assassinCountText.innerText = assassinString + value;
    }
    setInputValueById("assassinCount", value);
    decoder.AssassinCount = value;
    updateUrl();
}

function onGridBoardSeedValueChanged(value) {
    localStorage.decoderSeedValue = value;
    setInputValueById("decoderSeedValueInput", value);
    decoder.DecoderSeed = value;
    document.getElementById("startingTeam").style.backgroundColor = decoder.StartingTeamColor;
    wordListGrid = document.getElementById("wordListGrid");
    wordListGrid.innerHTML = "";
    if(decoder.SpyMasterMode){
        decoder.WordListsByTeam.forEach(element => {
            wordListGrid.appendChild(element);
        });
    }
    updateUrl();
}

function onSessionValueChanged(value) {
    localStorage.session = value;
    setInputValueById("sessionValueInput", value);
    decoder.Session = value;
    updateUrl();
}

function onRandomSessionButtonClicked() {
    let newSession = (Math.random() * 10e18).toString();
    document.getElementById("sessionValueInput").value = newSession;
    onSessionValueChanged(newSession);
}

function setInputValueById(id, value) {
    let slider = document.getElementById(id);
    if(slider){
        slider.value = value;
    }else{
        console.debug("Could not find element with id: " + id)
    }
    
}

//url
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        value = value == "undefined" ? undefined : value;
        vars[key] = value;
    });
    return vars;
}

function updateUrl() {
    let url = getUrlWithCurrentSettings();
    window.history.pushState({ path: url.toString() }, '', url.toString());
}

function getUrlWithCurrentSettings() {
    var url = new URL(window.location.href);
    var search_params = url.searchParams;
    search_params.set('rowCount', decoder.Rows);
    search_params.set('columnCount', decoder.Columns);
    search_params.set('assassinCount', decoder.AssassinCount);
    search_params.set('session', decoder.Session);
    search_params.set('decoderSeedValue', decoder.DecoderSeed);
    url.searchParams = search_params;
    return url;
}

//callbacks
function replaceGameBoard() {
    let gridContainer = document.getElementById("decoder-grid-container");
    gridContainer.innerHTML = "";
    gridContainer.appendChild(decoder.Board);
}





