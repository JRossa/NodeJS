window.onload = setListenOpenModal

function setInputStates() {
  setListenOpenModal();
}

function setAlarmDurationState() {

  var durationState = $('#alarmDuration').prop('checked');

//  angular.element('#alarmDuration').scope().setPinInputValue(durationState);

  if (durationState) {
    document.getElementById('startTime').style.display = 'none';
    document.getElementById('endTime').style.display = 'none';
//    var scope = angular.element('#alarmDuration').scope().pinData.pinAlarmDuration;

//    angular.element('#alarmDuration').scope().resetAlarmDuration();

  } else {
    document.getElementById("startTime").style.display = 'block';
    document.getElementById("endTime").style.display = 'block';
  }

}

function setAlarmSetState() {
  var setState = $('#alarmSet').prop('checked');

//  angular.element('#alarmSet').scope().setPinUsedValue(setState);

  if (setState == 'true' || setState == 'false') {
    $('#alarmSet').prop('checked', setState).change();
  }

}

function setListenOpenModal() {

//        setAlarmDurationState();
//        setAlarmSetState();

}
