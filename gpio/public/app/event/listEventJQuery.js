window.onload = setListenActionDataTable




// https://datatables.net/examples/advanced_init/length_menu.html
// https://datatables.net/reference/option/language
function setDataTable() {

  var langSelec = angular.element('#langSelected').scope().showLang.show_EN;

//  console.log(langSelec);

  if (angular.element('#langSelected').scope().showLang.show_EN) {
    $('#tblEventData').DataTable( {
          "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
          "language": {
            "decimal":        "",
            "emptyTable":     "No data available in table",
            "info":           "Showing _START_ to _END_ of _TOTAL_ entries",
            "infoEmpty":      "Showing 0 to 0 of 0 entries",
            "infoFiltered":   "(filtered from _MAX_ total entries)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "Show _MENU_ entries",
            "loadingRecords": "Loading...",
            "processing":     "Processing...",
            "search":         "Search:",
            "zeroRecords":    "No matching records found",
            "paginate": {
                "first":      "First",
                "last":       "Last",
                "next":       "Next",
                "previous":   "Previous"
            },
            "aria": {
                "sortAscending":  ": activate to sort column ascending",
                "sortDescending": ": activate to sort column descending"
            }
          }
      } );
    }

//           "searching": false,

  if (angular.element('#langSelected').scope().showLang.show_PT) {
    $('#tblEventData').DataTable( {
          "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
          "language": {
            "decimal":        "",
            "emptyTable":     "Tabela sem dados disponíveis",
            "info":           "Lista do registo _START_  a _END_ de _TOTAL_ registos",
            "infoEmpty":      "Mostra do registo 0 até ao 0 de 0 registos",
            "infoFiltered":   "(seleção de um total de _MAX_ registos)",
            "infoPostFix":    "",
            "thousands":      ",",
            "lengthMenu":     "Listar _MENU_ registos",
            "loadingRecords": "Carregando..",
            "processing":     "Processando...",
            "search":         "Procurar:",
            "zeroRecords":    "Nenhum registo encontrado",
            "paginate": {
                "first":      "Primeiro",
                "last":       "Último",
                "next":       "Próximo",
                "previous":   "Anterior"
            },
            "aria": {
                "sortAscending":  ": ativar para a ordenção ascendente da coluna",
                "sortDescending": ": ativar para a ordenção descendente da coluna"
            }
          }
      } );
    }


  $("#listEventModal").show();
  $("#footer").show();
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
             dateTime.toString() == "") {
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

  if (searchTime == "") {
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

  $("#listEvent").show();

  listenInput2Click ();

  setTimeout(function(){
    setDataTable();
  }, 300);
}
