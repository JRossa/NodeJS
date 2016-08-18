window.onload = setListenOpenSetAlarmForm

function setAlarmStates() {
  setListenOpenSetAlarmForm();
}

function setAlarmPeriodState() {

  var periodState = $('#alarmPeriod').prop('checked');

//  angular.element('#alarmDuration').scope().setPinInputValue(durationState);
  angular.element("#setAlarmSaveButton").scope().alarmPeriod.period = periodState;

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

  } else {
    document.getElementById("startTime").style.display = 'block';
    document.getElementById("endTime").style.display = 'block';
/*
    document.getElementById("startTime").setAttribute('required','required');
    document.getElementById("endTime").setAttribute('required','required');
*/
    document.getElementById("setAlarmSaveButton").setAttribute('disabled','disabled');
  }

}

function setAlarmSetState() {
  var setState = $('#alarmSet').prop('checked');

//  angular.element('#alarmSet').scope().setPinUsedValue(setState);
angular.element("#setAlarmSaveButton").scope().alarmPeriod.set = setState;

  if (setState == 'true' || setState == 'false') {
    $('#alarmSet').prop('checked', setState).change();
  }

}

function setListenOpenSetAlarmForm() {

        setAlarmPeriodState();
        setAlarmSetState();

}
