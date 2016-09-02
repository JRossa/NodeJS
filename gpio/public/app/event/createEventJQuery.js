/*jslint node: true */
/*jslint browser: true*/
/*jslint jquery: true*/
/*global angular: false */
/*global menuDropDown: false */
/*global moment: false */
/*jshint strict:false */
'use strict';

window.onload = createEventStates;

function createEventStates() {
  listenSelectLang();
  menuDropDown();
}


function setDateTimePickerLang () {
//  $('#endTimeInput').data("DateTimePicker").element.on('dp.change', function(){
//    alert('d')
//  });
  var state = $('#selectLang').prop('checked');

  var createEvent = document.getElementById('createEvent');

  if (createEvent !== null) {
   // datetimepicker
    if (state) {
      $('#eventTime').data("DateTimePicker").options.language = 'en';
    } else {
      $('#eventTime').data("DateTimePicker").options.language = 'pt';
    }

    var date = new Date();
    var strDate = date.getDate() + "-" + (date.getMonth() + 1) +
                "-" + date.getFullYear();

    $('#eventTime').data("DateTimePicker").setValue();
  }
}

function listenSelectLang () {

  $('#selectLang').change( function() {

//    console.log('passou');
    setDateTimePickerLang();
  });
}
