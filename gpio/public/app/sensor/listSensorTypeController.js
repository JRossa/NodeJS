angular.module("gpioModule")
       .controller("listSensorTypeController", listSensorTypeController);

listSensorTypeController.$inject = ['$window', '$scope', '$timeout', 'sensorService', 'langService'];


function listSensorTypeController($window, $scope, $timeout, sensorService, langService) {

  $scope.sensorTypes = [];

  loadLanguage();

  getAllSensorTypes();


  function loadLanguage () {

    var langKey = $window.localStorage.getItem('langKey');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
           $("#listSensorType").show();
        });
  }

  function getAllSensorTypes () {



    sensorService.getAllSensorTypes()
      .success( function (data) {

        if (data &&
            data.sensorTypes &&
            data.sensorTypes.length > 0) {

              $scope.sensorTypes = data.sensorTypes;
            }
      });

  }


}
