window.onload = setListenActionDataTable

// https://datatables.net/examples/advanced_init/length_menu.html
// https://datatables.net/reference/option/language
function setDataTable() {

  var langSelec = angular.element('#langSelected').scope().showLang.show_EN;

  console.log(langSelec);

  if (angular.element('#langSelected').scope().showLang.show_EN) {
    $('#tblActionData').DataTable( {
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

  if (angular.element('#langSelected').scope().showLang.show_PT) {
    $('#tblActionData').DataTable( {
          "lengthMenu": [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
          "language": {
            "decimal":        "",
            "emptyTable":     "Tabela sem dados disponíveis",
            "info":           "Lista do registo _START_ até ao _END_ de _TOTAL_ registos",
            "infoEmpty":      "Mostra do registo 0 até ao 0 de 0 registos",
            "infoFiltered":   "(seleção de _MAX_ total de registos)",
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


  $("#listAlarmModal").show();
  $("#footer").show();
}

function setListenActionDataTable () {

  $("#listAlarm").show();

  setTimeout(function(){
    setDataTable();
  }, 100);
}
