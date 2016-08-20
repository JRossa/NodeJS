window.onload = setInputStates

function setInputStates() {
  setListenOpenModal();
  menuDropDown();
}

function setAlarmDuration (inputState, resetAlarmDuration) {

  if (inputState) {
    document.getElementById('alarmDuration').style.display = 'none';
//    alert('none');
    document.getElementById('pinAlarmDuration').removeAttribute('required');
    document.getElementById('updatePinButton').removeAttribute('disabled');

    // old way
    //angular.element('#alarmDuration').scope().setResetAlarmDuration();
    if (resetAlarmDuration) {
      angular.element("#alarmDuration").scope().pinData.pinAlarmDuration = "";
      document.getElementById("pinAlarmDurationInput").click();
    }

  } else {

    // old way
    //angular.element('#alarmDuration').scope().resetAlarmDuration();

    document.getElementById("alarmDuration").style.display = 'block';

    document.getElementById("pinAlarmDuration").setAttribute('required','required');

    var pinInput = angular.element('#alarmDuration').scope().controlData.pinInputState;

    if (pinInput) {
      document.getElementById("pinAlarmDuration").setAttribute('required','required');

      var alarmDuration = angular.element('#alarmDuration').scope().pinData.pinAlarmDuration;

      if (alarmDuration == "") {
        document.getElementById("updatePinButton").setAttribute('disabled','disabled');
      }
    }
  }

}


function setPinInputState (resetAlarmDuration) {

  var inputState = "";

  if (angular.element('#editPinModal').scope().showLang.show_PT) {
    inputState = $('#pinInputPT').prop('checked');
  }

  if (angular.element('#editPinModal').scope().showLang.show_EN) {
    inputState = $('#pinInputEN').prop('checked');
  }

  angular.element('#editPinModal').scope().setPinInputValue(inputState);

  setAlarmDuration (inputState, resetAlarmDuration);
}

// old
function setPinInputStatePT() {

  var inputState = $('#pinInputPT').prop('checked');

  //  angular.element('#pinSensorId').scope().pinData.controlData.pinInputState = inputState;
  // or
  angular.element('#pinInputPT').scope().setPinInputValue(inputState);

  setAlarmDuration (inputState);

  // not used - for sample
  $('#pinInputState').html('{ \'state\' : \'' + $('#pinInput').prop('checked') + '\'}')
}

// old
function setPinInputStateEN() {

  var inputState = $('#pinInputEN').prop('checked');

  angular.element('#pinInputEN').scope().setPinInputValue(inputState);

  setAlarmDuration (inputState);

  // not used - for sample
  $('#pinInputState').html('{ \'state\' : \'' + $('#pinInput').prop('checked') + '\'}')
}


function setPinUsedState() {
  var usedState = "";

  if (angular.element('#editPinModal').scope().showLang.show_PT) {
    usedState = $('#pinUsedPT').prop('checked');
  }

  if (angular.element('#editPinModal').scope().showLang.show_EN) {
    usedState = $('#pinUsedEN').prop('checked');
  }

  angular.element('#editPinModal').scope().setPinUsedValue(usedState);

  if (usedState == 'true' || usedState == 'false') {
    $('#pinUsedPT').prop('checked', usedState).change();
    $('#pinUsedEN').prop('checked', usedState).change();
  }

  // not used - for example
  $('#pinUsedState').html('{ \'state\' : \'' + $('#pinUsed').prop('checked') + '\'}')
}


function setTimePicker(timeValue, timePicker) {

  var splitTimeValue = timeValue.split(':');

  // http://momentjs.com/docs/
  // var dateNow = new Date();
  // var momentSet =  moment(dateNow).hours(splitTimeValue[0]) .....
  var momentSet = moment().hours(splitTimeValue[0])
                          .minutes(splitTimeValue[1])
                          .seconds(splitTimeValue[2])
                          .milliseconds(0)

  timePicker.setValue(momentSet);
}


function setListenOpenModal() {

  $('#editPinModal').on('shown.bs.modal', function() {
    var inputValue = angular.element('#editPinModal').scope().pinData.pinInput;
    // or
    // var inputValue = $('#pinInputValue').text();
    // var inputState = (inputValue.search("true") >= 0)? true : false;
    var inputState = inputValue;
    $('#pinInputPT').prop('checked', inputState).change();
    $('#pinInputEN').prop('checked', inputState).change();

    var usedValue = angular.element('#editPinModal').scope().pinData.pinUsed;
    // var usedValue = $('#pinUsedValue').text();
    // var usedState = (usedValue.search("true") >= 0)? true : false;
    var usedState = usedValue;
    $('#pinUsedPT').prop('checked', usedState).change();
    $('#pinUsedEN').prop('checked', usedState).change();

    var alarmDuration = angular.element('#editPinModal').scope().pinData.pinAlarmDuration;
    var timePicker = $('#pinAlarmDuration').data("DateTimePicker");
    setTimePicker(alarmDuration, timePicker);

    setPinInputState(false);
    setPinUsedState();

  });
}
