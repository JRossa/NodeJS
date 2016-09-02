/*jslint node: true */
/*jslint browser: true*/
/*jslint jquery: true*/
/*global angular: false */
/*global menuDropDown: false */
/*global moment: false */
/*jshint strict:false */
'use strict';

window.onload = listAlarmStates;

function listAlarmStates() {
  setListenActionDataTable();
  menuDropDown();
}

/*
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


*/
var langPT =  {
      "decimal":        "",
      "emptyTable":     "Tabela sem dados disponíveis",
      "info":           "Lista do registo _START_ a _END_ de _TOTAL_ registos",
      "infoEmpty":      "Lista do registo 0 a 0 de 0 registos",
      "infoFiltered":   "(selecionados de um total de _MAX_ registos)",
      "infoPostFix":    "",
      "thousands":      ",",
      "lengthMenu":     "Listar _MENU_ registos",
      "loadingRecords": "Em carregamento..",
      "processing":     "Em processamento...",
      "search":         "Procurar : ",
      "zeroRecords":    "Não foram encontrados resultados",
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
    };


var langEN = {
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
      "search":         "Search : ",
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
    };

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

  $('#tblActionData').DataTable( {
        "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
        "language": langData
    } );

  if (option) {
    listenSelectLang();
  }

  $("#listAlarmModal").show();
  $("#footer").show();
}



function listenSelectLang () {

  $('#selectLang').change( function() {

//    console.log('passou');
    var dtable = $('#tblActionData').DataTable();
//    document.getElementById('listAlarmModal').style.display = 'none';
    $("#listAlarmModal").hide();
    $("#footer").hide();

    dtable.destroy();

    setTimeout(function(){
      setDataTable(false);
    }, 200);

  });
}

function setListenActionDataTable () {

  setTimeout(function(){
    $("#listAlarm").show();
  }, 50);


  setTimeout(function(){
    setDataTable(true);
  }, 400);
}
