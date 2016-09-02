/*jslint node: true */
/*jslint browser: true*/
/*jslint jquery: true*/
/*global angular: false */
/*global menuDropDown: false */
/*jshint strict:false */
'use strict';

window.onload = setSensorTypeStates;

function setSensorTypeStates() {
  menuDropDown();

  listenSelectLang();

  listenFileName();

  setTimeout(function(){
    $("#listSensorType").show();
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
    "search":         label.tblData_search,
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

$('#tblSensorTypeData').DataTable( {
    "searching": true,
      "lengthMenu": [[1, 5, 10, 25, 50, -1], [1, 5, 10, 25, 50, "All"]],
      "language": langData
  } );

  if (option) {
    listenSelectLang();
  }

  $("#listSensorTypeModal").show();
  $("#footer").show();
}

function listenSelectLang () {

  $('#selectLang').change( function() {

//    console.log('passou');
    var dtable = $('#tblSensorTypeData').DataTable();
//    document.getElementById('listAlarmModal').style.display = 'none';
    $("#listSensorTypeModal").hide();
    $("#footer").hide();

    dtable.destroy();

    setTimeout(function(){
      setDataTable(false);
    }, 200);

  });
}

function listenFileName () {

  $(':file').on('change', function(event, numFiles, label) {
    var fileName = $(":file").filestyle('pushNameFiles')[0].name;

    console.log(fileName);
    angular.element("#sensorImage").scope().setSensorFileName(fileName);
    document.getElementById('sensorImage').click();

  });

}
