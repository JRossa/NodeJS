window.onload = setInputStates

function setInputStates() {
  setListenOpenModal();
  menuDropDown();
}

function setAlarmDuration (inputState) {

  if (inputState) {
    document.getElementById('alarmDuration').style.display = 'none';
    var scope = angular.element('#alarmDuration').scope().pinData.pinAlarmDuration;

    angular.element('#alarmDuration').scope().resetAlarmDuration();

  } else {
    document.getElementById("alarmDuration").style.display = 'block';
  }

}

function setPinInputStatePT() {

  var inputState = $('#pinInputPT').prop('checked');

  angular.element('#pinInputPT').scope().setPinInputValue(inputState);

  setAlarmDuration (inputState);

  // not used - for sample
  $('#pinInputState').html('{ \'state\' : \'' + $('#pinInput').prop('checked') + '\'}')
}


function setPinInputStateEN() {

  var inputState = $('#pinInputEN').prop('checked');

  angular.element('#pinInputEN').scope().setPinInputValue(inputState);

  setAlarmDuration (inputState);

  // not used - for sample
  $('#pinInputState').html('{ \'state\' : \'' + $('#pinInput').prop('checked') + '\'}')
}


function setPinUsedState() {
  var usedState = $('#pinUsed').prop('checked');

  angular.element('#pinUsed').scope().setPinUsedValue(usedState);

  if (usedState == 'true' || usedState == 'false') {
    $('#pinUsed').prop('checked', usedState).change();
  }

  // not used - for example
  $('#pinUsedState').html('{ \'state\' : \'' + $('#pinUsed').prop('checked') + '\'}')
}

function setListenOpenModal() {

      $('#editPinModal').on('shown.bs.modal', function() {
        var inputValue = $('#pinInputValue').text();
        var inputState = (inputValue.search("true") >= 0)? true : false;
        $('#pinInput').prop('checked', inputState).change();

        var usedValue = $('#pinUsedValue').text();
        var usedState = (usedValue.search("true") >= 0)? true : false;
        $('#pinUsed').prop('checked', usedState).change();

        setPinInputStatePT();
        setPinInputStateEN();
        setPinUsedState();

      });
}
