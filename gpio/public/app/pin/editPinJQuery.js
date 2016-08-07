window.onload = setListenOpenModal

function setInputStates() {
  setListenOpenModal();
}

function setPinInputState() {

  var state = $('#pinInput').prop('checked');

  if (state) {
    document.getElementById("alarmDuration").style.display = 'none';
  } else {
    document.getElementById("alarmDuration").style.display = 'block';
  }

  $('#pinInputState').html('{ \'state\' : \'' + $('#pinInput').prop('checked') + '\'}')
}

function setPinUsedState() {
  var usedState = $('#pinUsedValue').prop('checked');

  if (usedState == 'true' || usedState == 'false') {
    $('#pinUsed').prop('checked', usedState).change();
  }

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
