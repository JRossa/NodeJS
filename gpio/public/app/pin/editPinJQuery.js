window.onload = setListenOpenModal

function setInputStates() {
  setListenOpenModal();
}

function setPinInputState() {

  var inputState = $('#pinInput').prop('checked');

  angular.element('#pinInput').scope().setPinInputValue(inputState);

  if (inputState) {
    document.getElementById('alarmDuration').style.display = 'none';
    var scope = angular.element('#alarmDuration').scope().pinData.pinAlarmDuration;

    angular.element('#alarmDuration').scope().resetAlarmDuration();

  } else {
    document.getElementById("alarmDuration").style.display = 'block';
  }

  // not used - for example
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

        setPinInputState();
        setPinUsedState();

      });
}
