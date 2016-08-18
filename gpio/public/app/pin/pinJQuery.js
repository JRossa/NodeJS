window.onload = setInputStates

function setInputStates() {
  setListenOpenModal();
  menuDropDown();
}

function setAlarmDuration (inputState) {

  if (inputState) {
    document.getElementById('alarmDuration').style.display = 'none';
//    alert('none');
    document.getElementById('pinAlarmDuration').removeAttribute('required');
    document.getElementById('updatePinButton').removeAttribute('disabled');

    angular.element('#alarmDuration').scope().setResetAlarmDuration();

  } else {

    angular.element('#alarmDuration').scope().resetAlarmDuration();

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


function setPinInputState () {

  var inputState = "";

  if (angular.element('#editPinModal').scope().showLang.show_PT) {
    inputState = $('#pinInputPT').prop('checked');
  }

  if (angular.element('#editPinModal').scope().showLang.show_EN) {
    inputState = $('#pinInputEN').prop('checked');
  }

  angular.element('#editPinModal').scope().setPinInputValue(inputState);

  setAlarmDuration (inputState);
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

function setListenOpenModal() {

  $('#editPinModal').on('shown.bs.modal', function() {
    var inputValue = angular.element('#editPinModal').scope().pinData.pinInput;
    // or
    //var inputValue = $('#pinInputValue').text();
    var inputState = (inputValue.search("true") >= 0)? true : false;
    $('#pinInputPT').prop('checked', inputState).change();
    $('#pinInputEN').prop('checked', inputState).change();

    var usedValue = angular.element('#editPinModal').scope().pinData.pinUsed;
    //var usedValue = $('#pinUsedValue').text();
    var usedState = (usedValue.search("true") >= 0)? true : false;
    $('#pinUsedPT').prop('checked', usedState).change();
    $('#pinUsedEN').prop('checked', usedState).change();

    setPinInputState();
    setPinUsedState();

  });
}
