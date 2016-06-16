
function testGPIO () {


    console.log('GPIO Ok');

    var xhttp = new XMLHttpRequest();

    xhttp.open('GET', '/setGPIO?fname=Henry&lname=Ford', true);
    xhttp.send();

}


function deleteSensor (id) {

    console.log('Sensor Id  ' + id);

    var xhttp = new XMLHttpRequest();

    xhttp.open('POST', '/setGPIO', true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send('fname=' + id + '&lname=Ford');

}

function URL_add_parameter(url, param, value){
    var hash       = {};
    var parser     = document.createElement('a');

    parser.href    = url;

    var parameters = parser.search.split(/\?|&/);

    for(var i=0; i < parameters.length; i++) {
        if(!parameters[i])
            continue;

        var ary      = parameters[i].split('=');
        hash[ary[0]] = ary[1];
    }

    hash[param] = value;

    var list = [];
    Object.keys(hash).forEach(function (key) {
        list.push(key + '=' + hash[key]);
    });

    parser.search = '?' + list.join('&');
    return parser.href;
}



function setLanguage() {

    var selectedLanguage = readCookie('language');

        // POST
        // window.location = window.location.pathname;
        // GET
        // history.go(0);
        // window.location.href = window.location.href; //This is a possibility
        // window.location.reload(); //Another possiblity

        /****
         Javascript window.location object can be used

         Get the current page address (URL).
         To redirect the browser to other page.
         To reload the same page.
         **/

    location.href = URL_add_parameter(location.href, 'lang', selectedLanguage);

//    location.reload();

}


$(document).ready( function() {

    var selectedLanguage = readCookie('language');

    console.log('Cookie ' + selectedLanguage);
    console.log($('#btnLanguage').data("text-swap"));

    if (selectedLanguage == $('#btnLanguage').data("text-swap")) {
        $('#divLanguage').toggleClass('toggle-button toggle-button-selected');
        $('#btnLanguage').text($('#btnLanguage').data("text-swap"));
    } else {
        $('#divLanguage').toggleClass('toggle-button');
        $('#btnLanguage').text($('#btnLanguage').data("text-original"));
    }


    $('#divLanguage').click( function() {

        var lang = $('#btnLanguage');

        if (lang.data("text-original") == null) {
            lang.data("text-original", lang.text());
        }

        lang.data(lang.text() == lang.data("text-swap")
            ? lang.text(lang.data("text-original"))
            : lang.text(lang.data("text-swap")));

        setCookie('language', lang.text(), 365);

        $(this).toggleClass('toggle-button-selected');

        location.href = URL_add_parameter(location.href, 'lang', lang.text());

        console.log(location.href);
        console.log(location.pathname);
        console.log(lang.data("text-original"));
        console.log(lang.data("text-swap"));

    });
/*
    $('#btnLanguage').click( function() {

        var lang = $(this);

        if (lang.data("text-original") == null) {
            lang.data("text-original", lang.text());
        }

        lang.data(lang.text() == lang.data("text-swap")
            ? lang.text(lang.data("text-original"))
            : lang.text(lang.data("text-swap")));

        setCookie('language', lang.text(), 365);

        location.href = URL_add_parameter(location.href, 'lang', lang.text());

        console.log(lang.data("text-original"));
        console.log(lang.data("text-swap"));
    });
*/

});


function setCookie(cookieName, cookieValue, nDays) {
    var today = new Date();
    var expire = new Date();

    if (nDays == null || nDays == 0)
        nDays = 1;

    expire.setTime(today.getTime() + 3600000 * 24 * nDays);
    document.cookie = cookieName+"="+escape(cookieValue) + ";expires=" + expire.toGMTString();
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');

    for ( var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ')
            c = c.substring(1, c.length);

        if (c.indexOf(nameEQ) == 0)
            return c.substring(nameEQ.length, c.length);
    }

    return null;
}
