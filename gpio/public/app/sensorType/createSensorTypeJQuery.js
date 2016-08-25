
$(document).ready( function() {
    $(':file').on('change', function(event, numFiles, label) {
      var fileName = $(":file").filestyle('pushNameFiles')[0].name;

      console.log(fileName);
      angular.element("#sensorImage").scope().setSensorFileName(fileName);
      document.getElementById('sensorImage').click();

    });
});
