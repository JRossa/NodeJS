/*jslint node: true */
/*jslint browser: true*/
/*jslint jquery: true*/
/*global angular: false */
/*global menuDropDown: false */
/*global moment: false */
/*jshint strict:false */
'use strict';

window.onload = setAlarmStates;

function setAlarmStates() {
  setListenOpenSetAlarmForm();
  menuDropDown();
}

function setAlarmPeriodState(resetPeriod) {

//  console.log(resetPeriod);

  var periodState = $('#alarmPeriod').prop('checked');

//  angular.element('#alarmDuration').scope().setPinInputValue(durationState);
  angular.element("#setAlarmSaveButton").scope().alarmSettings.allDay = periodState;

  if (periodState) {
    document.getElementById('startTime').style.display = 'none';
    document.getElementById('endTime').style.display = 'none';

/*
    document.getElementById("startTimeInputType").removeAttribute('readonly');
    document.getElementById("startTimeInputType").removeAttribute('required');
    document.getElementById("startTimeInputType").classList.remove("ng-invalid")
    document.getElementById("startTimeInputType").classList.remove("ng-invalid-required")
    document.getElementById("startTimeInputType").classList.add("ng-valid")
*/
    document.getElementById("setAlarmSaveButton").removeAttribute('disabled');

//    var scope = angular.element('#alarmDuration').scope().pinData.pinAlarmDuration;

//    angular.element('#alarmDuration').scope().resetAlarmDuration();
    if (resetPeriod) {
      angular.element("#setAlarmSaveButton").scope().alarmSettings.startPeriod = "";
      document.getElementById("periodStartTimeInput").click();

      angular.element("#setAlarmSaveButton").scope().alarmSettings.endPeriod = "";
      document.getElementById("periodEndTimeInput").click();
    }

  } else {
    document.getElementById("startTime").style.display = 'block';
    document.getElementById("endTime").style.display = 'block';
/*
    document.getElementById("startTime").setAttribute('required','required');
    document.getElementById("endTime").setAttribute('required','required');
*/

    if (angular.element("#setAlarmSaveButton").scope().alarmSettings.startPeriod === "" ||
        angular.element("#setAlarmSaveButton").scope().alarmSettings.endPeriod === "") {
      document.getElementById("setAlarmSaveButton").setAttribute('disabled','disabled');
    }
  }

}

function setAlarmSetState() {
  var setState = $('#alarmSet').prop('checked');

//  angular.element('#alarmSet').scope().setPinUsedValue(setState);
angular.element("#setAlarmSaveButton").scope().alarmSettings.armed = setState;
//alert(angular.element("#setAlarmSaveButton").scope().alarmSettings.startPeriod);
  if (setState == 'true' || setState == 'false') {
    $('#alarmSet').prop('checked', setState).change();
  }

}

function setTimePicker(timeValue, timePicker) {

  var splitTimeValue = timeValue.split(':');

  // http://momentjs.com/docs/
  // var dateNow = new Date();
  // var momentSet =  moment(dateNow).hours(splitTimeValue[0]) .....
  var momentSet = moment().hours(splitTimeValue[0])
                          .minutes(splitTimeValue[1])
                          .seconds(0)
                          .milliseconds(0);

  timePicker.setValue(momentSet);
}

function readEndPeriod () {
//  console.log(angular.element("#setAlarmSaveButton").scope().alarmSettings);

  var startPeriod = angular.element("#setAlarmSaveButton").scope().alarmSettings.endPeriod;
  if (startPeriod !== "") {
    var startTimePicker = $('#periodStartTime').data("DateTimePicker");

//    console.log(startPeriod);
    setTimePicker(startPeriod, startTimePicker);
  }

  var endPeriod = angular.element("#setAlarmSaveButton").scope().alarmSettings.endPeriod;
  if (endPeriod !== "") {
    var endTimePicker = $('#periodEndTime').data("DateTimePicker");

//    console.log(endPeriod);
    setTimePicker(endPeriod, endTimePicker);
  }

  var alarmSet = angular.element("#setAlarmSaveButton").scope().alarmSettings.armed;
  $('#alarmSet').prop('checked', alarmSet).change();

  var alarmPeriod = angular.element("#setAlarmSaveButton").scope().alarmSettings.allDay;
  $('#alarmPeriod').prop('checked', alarmPeriod).change();

  setAlarmPeriodState(false);
  setAlarmSetState();

  $("#setAlarmModal").show();
  $("#footer").show();
}


function setListenOpenSetAlarmForm() {

  setTimeout(function(){
    $("#setAlarm").show();
  }, 50);

  // half second is enougth
  setTimeout(function(){
    readEndPeriod();
  }, 500);

//  setAlarmPeriodState(false);
//  setAlarmSetState();


}
