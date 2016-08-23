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

    for(var i=0; i<labelON.length; i++) {
      if (labelON[i].innerHTML == 'Ligado')
        labelON[i].innerHTML = 'ON';
    }

    for(var i=0; i<labelOFF.length; i++) {
      if (labelOFF[i].innerHTML == 'Desligado')
        labelOFF[i].innerHTML = 'OFF';
    }

    for(var i=0; i<labelON.length; i++) {
      if (labelON[i].innerHTML == 'Permanente')
        labelON[i].innerHTML = 'Permanent';
    }

    for(var i=0; i<labelOFF.length; i++) {
      if (labelOFF[i].innerHTML == 'Parcial')
        labelOFF[i].innerHTML = 'Partial';
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

    for(var i=0; i<labelON.length; i++) {
      if (labelON[i].innerHTML == 'ON')
        labelON[i].innerHTML = 'Ligado';
    }

    for(var i=0; i<labelOFF.length; i++) {
      if (labelOFF[i].innerHTML == 'OFF')
        labelOFF[i].innerHTML = 'Desligado';
    }

    for(var i=0; i<labelON.length; i++) {
      if (labelON[i].innerHTML == 'Permanent')
        labelON[i].innerHTML = 'Permanente';
    }

    for(var i=0; i<labelOFF.length; i++) {
      if (labelOFF[i].innerHTML == 'Partial')
        labelOFF[i].innerHTML = 'Parcial';
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
//  console.log(langSelec.showLang.show_EN);

  if (langSelec != 'undefined') {
    // to syncronize the toggle button
    var state = angular.element('#langSelected').scope().showLang.show_EN;

    $('#selectLang').prop('checked', state).change();
  }

}
