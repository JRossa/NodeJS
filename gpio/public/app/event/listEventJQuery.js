/*jslint node: true */
/*jslint browser: true*/
/*jslint jquery: true*/
/*global angular: false */
/*global menuDropDown: false */
/*global moment: false */
/*jshint strict:false */
'use strict';

window.onload = listEventStates;

function listEventStates() {
  setListenActionDataTable();
  menuDropDown();

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

  $('#tblEventData').DataTable( {
        "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        "language": langData
    } );

  if (option) {
    listenSelectLang();
  }

  $("#listEventModal").show();
  $("#footer").show();
}

function listenSelectLang () {

  $('#selectLang').change( function() {

//    console.log('passou');
    // if it's at the end duplicates rows in each language beacuase
    // of the label of delete butoon
    setDateTimePickerLang();

    var dtable = $('#tblEventData').DataTable();
//    document.getElementById('listAlarmModal').style.display = 'none';
    $("#listEventModal").hide();
    $("#footer").hide();

    dtable.draw();
    dtable.destroy();

    setTimeout(function(){
      setDataTable(false);
    }, 200);

  });
}

function setDateTimePickerLang () {
//  $('#endTimeInput').data("DateTimePicker").element.on('dp.change', function(){
//    alert('d')
//  });
  var state = $('#selectLang').prop('checked');

  var listEvent = document.getElementById('listEvent');

  if (listEvent !== null) {
   // datetimepicker
    if (state) {
      $('#startTime').data("DateTimePicker").options.language = 'en';
      $('#endTime').data("DateTimePicker").options.language = 'en';
    } else {
      $('#startTime').data("DateTimePicker").options.language = 'pt';
      $('#endTime').data("DateTimePicker").options.language = 'pt';
    }

    var date = new Date();
    var strDate = date.getDate() + "-" + (date.getMonth() + 1) +
                "-" + date.getFullYear();

    $('#startTime').data("DateTimePicker").setValue();
    $('#endTime').data("DateTimePicker").setValue();
  }
}

function selectSensor(searchSensor, itemSensor) {

  if (typeof searchSensor == "undefined") {
    return true;
  }

  if (searchSensor === "") {
    return true;
  }
//    console.log(typeof searchSensor);
//    console.log(itemSensor);
//    console.log(searchSensor == itemSensor);
  return itemSensor == searchSensor;

}


function convertDateTimePicker(dateTime) {

  if (dateTime === "undefined" ||
             dateTime.toString() === "") {
    return dateTime;
  }

  var splitSearch = dateTime.split(" ");
  var splitDate = splitSearch[0].split("-");
  //var now = new Date("2008-08-28 23:30:00");

  var searchDate = new Date(splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0] +
            " " + splitSearch[1] + ":00");

//    console.log(searchDate.getTime());
  if (isNaN(searchDate.getTime())) {  // d.valueOf() could also work
      // date is not valid
      return "";
    }

  // convert to localTime
//    var minutes = searchDate.getTimezoneOffset();
//    searchDate = new Date(searchDate.getTime() - 1000 * 60 * minutes);
  //  searchDate.toISOString().substr(0, 10);
  // "2014-11-19"
  // searchDate.toISOString()
  // "2014-11-19T17:30:34.015Z"
  return searchDate.toISOString();
}

function selectTime(searchTime, itemTime, greater) {

//    console.log("----------------" + itemTime);
  itemTime = convertDateTimePicker(itemTime);

//  console.log(itemTime);

  if (typeof searchTime === "undefined") {
    return true;
  }

  if (searchTime === "") {
    return true;
  }

//    console.log(itemTime > searchTime);
  if (greater) {
    return itemTime >= searchTime;
  } else {
    return itemTime <= searchTime;
  }
}


/* Custom filtering function which will search data in column four between two values */
$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
        var searchSensorNum = angular.element('#listEventModal').scope().searchText.sensor_num;
        var searchStartTime = angular.element('#listEventModal').scope().searchText.startTime;
        var searchEndTime   = angular.element('#listEventModal').scope().searchText.endTime;

        var sensorOk = true;
        var timeOk   = true;
//    console.log('passou search');
//       console.log(data[1]);
//        console.log(dataIndex);
//        console.log(searchSensorNum);
        searchStartTime = convertDateTimePicker(searchStartTime);
        searchEndTime = convertDateTimePicker(searchEndTime);

//        console.log(searchStartTime);
//        console.log(data[2]);
        sensorOk = selectSensor(searchSensorNum, data[1]);

        timeOk = selectTime(searchStartTime, data[2], true);

        if (timeOk) {
          timeOk = selectTime(searchEndTime, data[2], false);
        }

        if (sensorOk && timeOk) {
          return true;
        } else {
         return false;
      }
    }
);


function listenInput2Click () {

$(function () {
  $(document).on('input','input[type=text]',function () {
    var input = this;
//    console.log( 'passou' + input.id);
    this.click();
/*
var table = $('#tblEventData').DataTable();
    if (input.id == 'sensorNumInput') {
      var selectData = table
        .column( 1 )
        .search( this.value )
        .draw();
    } else {
      table
        .column( 1 )
        .draw();
    }


    // https://datatables.net/reference/api/filter()

    var filterData = table
      .columns( [1,2] )
      .data( )
      .filter( function ( value, index ) {
            console.log(value);
            return true;
      } );
//      console.log(filterData);
*/

  });
});
}

// https://datatables.net/examples/plug-ins/range_filtering.html

function setListenActionDataTable () {

  listenInput2Click ();

  setTimeout(function(){
    $("#listEvent").show();
  }, 50);

  setTimeout(function(){
    setDataTable(true);
  }, 500);
}
