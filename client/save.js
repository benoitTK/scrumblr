var cards = {};
var totalcolumns = 0;
var columns = [];
var currentTheme = "bigcards";
var boardInitialized = false;
var keyTrap = null;
var boardSize = {}

var baseurl = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
//var socket = io();
// We move socket.io from it's default URL (/socket.io) to (/socketio) because during
// the upgrade to new socket.io, old clients on production server were hitting old
// URL and crashing the server.
var socket = io({
    path: '/socketio'
});
//an action has happened, send it to the
//server
function sendAction(a, d) {
    //console.log('--> ' + a);

    var message = {
        action: a,
        data: d
    };

    socket.send(message);
}

socket.on('connect', function() {
    //console.log('successful socket.io connect');

    //let the final part of the path be the room name
    var baseurl = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
    var room = baseurl.substring(baseurl.lastIndexOf('/'));

    //imediately join the room which will trigger the initializations
    sendAction('joinRoom', room);
});

socket.on('disconnect', function() {
    blockUI("Server disconnected. Refresh page to try and reconnect...");
    //$('.blockOverlay').click($.unblockUI);
});

socket.on('message', function(data) {
    getMessage(data);
});

function unblockUI() {
    $('.board-outline').trigger('initboard');
    $.unblockUI({fadeOut: 50});
}

function blockUI(message) {
    message = message || 'Waiting...';

    $.blockUI({
        message: message,

        css: {
            border: 'none',
            padding: '15px',
            backgroundColor: '#000',
            '-webkit-border-radius': '10px',
            '-moz-border-radius': '10px',
            opacity: 0.5,
            color: '#fff',
            fontSize: '20px'
        },

        fadeOut: 0,
        fadeIn: 10
    });
}

//respond to an action event
function getMessage(m) {
    var message = m; //JSON.parse(m);
    var action = message.action;
    var data = message.data;

    //console.log('<-- ' + action);
    //console.log(message);

    switch (action) {
        case 'roomAccept':
            //okay we're accepted, then request initialization
            //(this is a bit of unnessary back and forth but that's okay for now)
            sendAction('initializeMe', null);
            break;

        case 'roomDeny':
            //this doesn't happen yet
            break;

        case 'moveCard':
            break;

        case 'initCards':
            initCards(data);
            break;

        case 'createCard':
            break;

        case 'deleteCard':
            break;

        case 'editCard':
            break;

        case 'initColumns':
            initColumns(data);
            break;

        case 'updateColumns':
            break;

        case 'changeTheme':
            break;

        case 'join-announce':
            break;

        case 'leave-announce':
            break;

        case 'initialUsers':
            break;

        case 'nameChangeAnnounce':
            break;

        case 'addSticker':
            break;

        case 'setBoardSize':
            setBoardSize(message.data);
            break;

        case 'editText':
            var item = data.item;
            var text = "";
            if (data.text) { text = data.text; }
            updateText(item, text);
            break;

        default:
            //unknown message
            alert('unknown action: ' + JSON.stringify(message));
            break;
    }


}
function updateText (item, text) {
    if (item == 'board-title' && text != '') {
        $('#board-title').text(text);
    }
}


$(document).bind('keyup', function(event) {
    keyTrap = event.which;
});



//----------------------------------
// cards
//----------------------------------

function drawNewCard(id, text, x, y, rot, colour, type, sticker, animationspeed) {
    //cards[id] = {id: id, text: text, x: x, y: y, rot: rot, colour: colour};
    item  = '<li class="column-editable">'+text+'</li>';
    var line = $(item);
    col = findColumn(x)
    console.log("col=" + col)
    line.appendTo(col);

}

function initCards(cardArray) {
    //first delete any cards that exist
    console.log('initCards --> ' + JSON.stringify(cardArray));

    cards = cardArray;

    for (var i in cardArray) {
        card = cardArray[i];

        drawNewCard(
            card.id,
            card.text,
            card.x,
            card.y,
            card.rot,
            card.colour,
            card.type,
            card.sticker,
            0,
        );
    }

    boardInitialized = true;
    unblockUI();
}

function findColumn(x) {
    if (columns.length == 0) return "#col0";
    var colID = Math.trunc( x / (boardSize.width / columns.length));
    if (colID >= columns.length) return "#col"+(columns.length - 1);
    return "#col"+colID;
}

function drawNewColumn(id, text){
    list = '<ul id="' + id + '" class="column-editable"><h2>'+text+'</h2></ul>';
    var col = $(list);
    col.appendTo('#board');
}
//----------------------------------
// cols
//----------------------------------
function initColumns(columnArray) {
    console.log('initColumns --> ' + JSON.stringify(columnArray));

    totalcolumns = 0;
    columns = columnArray;

    for (var i in columns) {
        drawNewColumn(
            "col"+i,
            columns[i]
        );
    }
}


function onColumnChange(id, text) {
}

function setBoardSize(size) {
    console.log('setBoardSize --> ' + JSON.stringify(size));
    boardSize = size
}


//////////////////////////////////////////////////////////
////////// NAMES STUFF ///////////////////////////////////
//////////////////////////////////////////////////////////



function setCookie(c_name, value, exdays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays === null) ? "" : "; expires=" +
        exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
}

function getCookie(c_name) {
    var i, x, y, ARRcookies = document.cookie.split(";");
    for (i = 0; i < ARRcookies.length; i++) {
        x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
        x = x.replace(/^\s+|\s+$/g, "");
        if (x == c_name) {
            return unescape(y);
        }
    }
}

function setName(name) {
    sendAction('setUserName', name);

    setCookie('scrumscrum-username', name, 365);
}

function displayInitialUsers(users) {
}

function displayUserJoined(sid, user_name) {
}

function displayUserLeft(sid) {
}


function updateName(sid, name) {
    var id = '#user-' + sid.toString();

    $('#names-ul').children(id).text(name);
}

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////


$(function() {


	//disable image dragging
	//window.ondragstart = function() { return false; };


    if (boardInitialized === false)
        blockUI('<img src="/images/ajax-loader.gif" width=43 height=11/>');

    //setTimeout($.unblockUI, 2000);

    $(".ceditable").editable({
        multiline: false,
        saveDelay: 600, //wait 600ms before calling "save" callback
        autoselect: false, //select content automatically when editing starts
        save: function(content) {
            //here you can save content to your MVC framework's model or send directly to server...
            //console.log(content);

            var action = "editText";

            var data = {
                item: 'card',
                text: content.target.innerText
            };
            
            if (content.target.innerText.length > 0)
                sendAction(action, data);
        },
        validate: function(content) {
            //here you can validate content using RegExp or any other JS code to return false for invalid input
            return content !== "";
        }
    });


   var user_name = getCookie('scrumscrum-username');


    
});
