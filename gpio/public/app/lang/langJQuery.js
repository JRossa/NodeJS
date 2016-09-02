/*jslint node: true */
/*jslint browser: true*/
/*jslint jquery: true*/
/*global angular: false */
/*global menuDropDown: false */
/*global moment: false */
/*jshint strict:false */
'use strict';

window.onload = menuDropDown;

function setLanguage() {

  var i = 0;
  var state = $('#selectLang').prop('checked');
  var labelON = document.getElementsByClassName('toggle-on');
  var labelOFF = document.getElementsByClassName('toggle-off');

  if (state) {
    angular.element('#langSelected').scope().changeLanguage('en');

    for(i = 0; i < labelON.length; i++) {
      if (labelON[i].innerHTML == 'Entrada')
        labelON[i].innerHTML = 'In';
    }

    for(i = 0; i < labelOFF.length; i++) {
      if (labelOFF[i].innerHTML == 'Saída')
        labelOFF[i].innerHTML = 'Out';
    }

    for(i = 0; i < labelON.length; i++) {
      if (labelON[i].innerHTML == 'Ligado')
        labelON[i].innerHTML = 'ON';
    }

    for(i = 0; i < labelOFF.length; i++) {
      if (labelOFF[i].innerHTML == 'Desligado')
        labelOFF[i].innerHTML = 'OFF';
    }

    for(i = 0; i < labelON.length; i++) {
      if (labelON[i].innerHTML == 'Permanente')
        labelON[i].innerHTML = 'Permanent';
    }

    for(i = 0; i < labelOFF.length; i++) {
      if (labelOFF[i].innerHTML == 'Parcial')
        labelOFF[i].innerHTML = 'Partial';
    }

  } else {
    angular.element('#langSelected').scope().changeLanguage('pt');

    for(i = 0; i < labelON.length; i++) {
      if (labelON[i].innerHTML == 'In')
        labelON[i].innerHTML = 'Entrada';
    }

    for(i = 0; i < labelOFF.length; i++) {
      if (labelOFF[i].innerHTML == 'Out')
        labelOFF[i].innerHTML = 'Saída';
    }

    for(i = 0; i < labelON.length; i++) {
      if (labelON[i].innerHTML == 'ON')
        labelON[i].innerHTML = 'Ligado';
    }

    for(i = 0; i < labelOFF.length; i++) {
      if (labelOFF[i].innerHTML == 'OFF')
        labelOFF[i].innerHTML = 'Desligado';
    }

    for(i = 0; i < labelON.length; i++) {
      if (labelON[i].innerHTML == 'Permanent')
        labelON[i].innerHTML = 'Permanente';
    }

    for(i = 0; i < labelOFF.length; i++) {
      if (labelOFF[i].innerHTML == 'Partial')
        labelOFF[i].innerHTML = 'Parcial';
    }

  }

  document.getElementById('selectLang').disabled =
              angular.element('#langSelected').scope().showLang.disabled;


}


function indexSetLanguage () {

  var indexLoaded = document.getElementById('index');

  if (indexLoaded !== null) {

//    $("#alarmSettings").hide();
//    location.reload();

    $('#alarmSettings').load(document.URL +  ' #alarmSettings');
  }
}


function menuDropDown() {
  // to solve conflicts in dropdown menu (collapse) beetwen bootstrap.js and angular.js
  // http://stackoverflow.com/questions/18945899/twitter-bootstrap-drop-down-menu-not-working
  $('.dropdown-toggle').dropdown();

  var langSelec = angular.element('#langSelected').scope();
//  console.log(langSelec.showLang.show_EN);

  if (langSelec != 'undefined') {
    // to syncronize the toggle button
    var state = angular.element('#langSelected').scope().showLang.show_EN;

    $('#selectLang').prop('checked', state).change();
  }

  $('#selectLang').change(function() {
    indexSetLanguage();
  });

}
