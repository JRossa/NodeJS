angular.module("gpioModule")
       .controller("editSensorTypeController", editSensorTypeController);

editSensorTypeController.$inject = ['$window', '$scope', '$timeout', 'sensorService', 'langService'];


function editSensorTypeController($window, $scope, $timeout, sensorService, langService) {

  $scope.sensorType = {

    sensorModel : "",
    sensorObs : ""
  };

  loadLanguage ();

  getSensorTypeById();

  function loadLanguage () {

    var langKey = $window.localStorage.getItem('langKey');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
           $("#editSensorType").show();
        });
  }

  function bindView (sensorType) {

    $scope.sensorType.sensorModel = sensorType.model;
    $scope.sensorType.sensorObs = sensorType.obs;
  }

  function getSensorTypeById () {

    sensorService.getSensorTypeById(sensorService.getIdFromEndPoint())
      .success( function (data) {

         if (data &&
            data.sensorType &&
            data.sensorType.length > 0) {

              bindView(data.sensorType[0]);
            }
      });

  }

}
