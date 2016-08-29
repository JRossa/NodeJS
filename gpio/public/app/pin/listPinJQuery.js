window.onload = setInputStates

function setInputStates() {
  setListenOpenModal();
  menuDropDown();

  listenSelectLang();

  setTimeout(function(){
    $("#listPin").show();
  }, 50);


  setTimeout(function(){
    setDataTable();
  }, 500);

}

// https://datatables.net/examples/advanced_init/length_menu.html
// https://datatables.net/reference/option/language
function setDataTable(option) {

  var langSelec = angular.element('#langSelected').scope().showLang.show_EN;

  var label = angular.element('#langSelected').scope().label;

  var langData =  {
    "decimal":        label.tblData_decimal,
    "emptyTable":     label.tblData_emptyTable,
    "info":           label.tblData_info,
    "infoEmpty":      label.tblData_infoEmpty,
    "infoFiltered":   label.tblData_infoFiltered,
    "infoPostFix":    label.tblData_infoPostFix,
    "thousands":      label.tblData_thousands,
    "lengthMenu":     label.tblData_lengthMenu,
    "loadingRecords": label.tblData_loadingRecords,
    "processing":     label.tblData_processing,
    "search":         label.tblData_searchPin,
    "zeroRecords":    label.tblData_zeroRecords,
    "paginate": {
        "first":      label.tblData_first,
        "last":       label.tblData_last,
        "next":       label.tblData_next,
        "previous":   label.tblData_previous
    },
    "aria": {
        "sortAscending":  label.tblData_sortAscending,
        "sortDescending": label.tblData_sortDescending
    }
  };

//  console.log(langSelec);

$('#tblPinData').DataTable( {
      "searching": true,
      "columnDefs": [
          { "searchable": false, "targets": 0 },
          { "searchable": false, "targets": 1 },
          { "searchable": false, "targets": 2 },
          { "searchable": false, "targets": 3 },
          { "searchable": false, "targets": 4 },
          { "searchable": true, "targets": 5 },
          { "searchable": false, "targets": 6 },
          { "searchable": false, "targets": 7 },
          { "searchable": false, "targets": 8 }
        ],
      "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
      "language": langData
  } );

  if (option) {
    listenSelectLang();
  }

  $("#listPinModal").show();
  $("#footer").show();
}

function listenSelectLang () {

  $('#selectLang').change( function() {

//    console.log('passou');
    var dtable = $('#tblPinData').DataTable();
//    document.getElementById('listAlarmModal').style.display = 'none';
    $("#listPinModal").hide();
    $("#footer").hide();

    dtable.destroy();

    setTimeout(function(){
      setDataTable(false);
    }, 200);

  });
}

// editPin
function setSensorLocation (inputState, resetLocation) {

  if (!inputState) {
    document.getElementById('sensorLocation').style.display = 'none';
//    alert('none');
    document.getElementById('pinSensorLocation').removeAttribute('required');
    document.getElementById('updatePinButton').removeAttribute('disabled');

    // old way
    //angular.element('#alarmDuration').scope().setResetAlarmDuration();
    if (resetLocation) {
      angular.element("#sensorLocation").scope().pinData.pinSensorLocation = "";
//      document.getElementById("pinAlarmDurationInput").click();
    }

  } else {

    document.getElementById("sensorLocation").style.display = 'block';

    document.getElementById("pinSensorLocation").setAttribute('required','required');

    var pinInput = angular.element('#sensorLocation').scope().controlData.pinInputState;

    if (pinInput) {
      document.getElementById("pinSensorLocation").setAttribute('required','required');

      var sensorLocation = angular.element('#alarmDuration').scope().pinData.pinSensorLocation;

      if (sensorLocation == "") {
        document.getElementById("updatePinButton").setAttribute('disabled','disabled');
      }
    }
  }
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


function setAlarmWarn (inputState) {

  if (inputState) {
    document.getElementById('pinWarnRowPT').style.display = 'none';
    document.getElementById('pinWarnRowEN').style.display = 'none';

  } else {
    document.getElementById('pinWarnRowPT').style.display = 'block';
    document.getElementById('pinWarnRowEN').style.display = 'block';

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
  setSensorLocation (inputState, false);

  setAlarmWarn (inputState);
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

function validateTime(time) {
    var result = false, m;
    var re = /^\s*([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])\s*$/;
    if ((time !== null) && (m = time.match(re))) {
        result = true;
    }
    return result;
 }

function setTimePicker(timeValue, timePicker) {

  console.log(validateTime(timeValue));
  if (! validateTime (timeValue)) {
    return;
  }

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
