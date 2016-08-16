window.onload = menuDropDown

function setLanguage() {

  var state = $('#selectLang').prop('checked');
  var labelON = document.getElementsByClassName('toggle-on');
  var labelOFF = document.getElementsByClassName('toggle-off');

  if (state) {
    angular.element('#langSelected').scope().changeLanguage('en');

    for(var i=0; i<labelON.length; i++) {
      if (labelON[i].innerHTML == 'Entrada')
        labelON[i].innerHTML = 'In';
    }

    for(var i=0; i<labelOFF.length; i++) {
      if (labelOFF[i].innerHTML == 'Saída')
        labelOFF[i].innerHTML = 'Out';
    }

  } else {
    angular.element('#langSelected').scope().changeLanguage('pt');

    for(var i=0; i<labelON.length; i++) {
      if (labelON[i].innerHTML == 'In')
        labelON[i].innerHTML = 'Entrada';
    }

    for(var i=0; i<labelOFF.length; i++) {
      if (labelOFF[i].innerHTML == 'Out')
        labelOFF[i].innerHTML = 'Saída';
    }
  }

  document.getElementById('selectLang').disabled =
              angular.element('#langSelected').scope().showLang.disabled;
}

function menuDropDown() {
  // to solve conflicts in dropdown menu (collapse) beetwen bootstrap.js and angular.js
  // http://stackoverflow.com/questions/18945899/twitter-bootstrap-drop-down-menu-not-working
  $('.dropdown-toggle').dropdown();

  var langSelec = angular.element('#langSelected').scope();

  if (langSelec != 'undefined') {
    // to syncronize the toggle button
    var state = angular.element('#langSelected').scope().showLang.show_EN;

    $('#selectLang').prop('checked', state).change();
  }

}

function reloadJs(src) {
   src = $('script[src$="' + src + '"]').attr("src");
   $('script[src$="' + src + '"]').remove();
   $('<script/>').attr('src', src).appendTo('body');
}
