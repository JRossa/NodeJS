angular.module("sensorTypeModule")
       .controller("listSensorTypeController", listSensorTypeController);

listSensorTypeController.$inject = ['$window', '$scope', '$timeout',
                                    'sensorTypeService', 'langService'];


function listSensorTypeController($window, $scope, $timeout,
                                  sensorTypeService, langService) {

  $scope.sensorTypes = [];

  var langKey = $window.localStorage.getItem('langKey');

/*
  $scope.$on('SOME_TAG', function(response) {
      console.log("Some tag");
  })
*/

  loadLanguage();

  getAllSensorTypes();

  function loadLanguage () {


    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
//           $scope.label = {"menubar_home" : "Home"};
//           console.log(data);
           $("#listSensorType").show();
        });
  };

  function getAllSensorTypes () {

    sensorTypeService.getAllSensorTypes()
      .success( function (data) {

        if (data &&
            data.sensorTypes &&
            data.sensorTypes.length > 0) {

              $scope.sensorTypes = data.sensorTypes;
              $("#listSensorType").show();
            }
      });

  };

  $scope.sensorType = {
    sensorId : "",
    sensorModel : "",
    sensorObs : ""
  };

  $scope.loadSensorType = function (sensorType) {
    console.log("Load");
    console.log(sensorType);
    $scope.sensorType.sensorId = sensorType.id;
    $scope.sensorType.sensorModel = sensorType.model;
    $scope.sensorType.sensorObs = sensorType.obs;
  }

  $scope.deleteSensorType = function () {
    console.log("Delete");

    if ($scope.sensorType.sensorId > 0) {
      sensorTypeService.deleteSensorType($scope.sensorType.sensorId)
        .success( function (data)  {
          if (data &&
              data.status &&
              data.status === 'Successful') {

                $window.location.href = '/listSensorType';
              }

        });
    }
  }

  $scope.message = {

    containsSucessfulMessage : false,
    sucessfulMessage : ""
  };


  $scope.validationResult = {

    containsValidationError: false,
    validationResult : ""
  };


  function showMessage (successStatus, errorStatus, text) {

    $scope.message.containsSucessfulMessage = successStatus;
    $scope.message.containsErrorMessage = errorStatus;
    $scope.message.textMessage = text;
  };


  $scope.validateSensorNumber = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearSensorNumberMessage () {

    $scope.validateSensorNumber.containsValidationError = false;
    $scope.validateSensorNumber.errorMessage = "";
  };

  function displaySensorNumberMessage () {

    $scope.validateSensorNumber.containsValidationError = true;
    $scope.validateSensorNumber.errorMessage = "Enter a sensor model !!";
  };

  $scope.updateSensorType = function (sensorType) {

    var validationMessages = 0;

    if ($scope.sensorType.sensorModel.length == 0) {

      displaySensorNumberMessage ();
      validationMessages++;
    }

    console.log("validationMessages : " + validationMessages);

    if (validationMessages > 0) {

      $timeout( function afterTimeOut () {
        clearSensorNumberMessage ();
      }, 2000);


    } else {

      sensorTypeService.updateSensorType(sensorType)
        .success(function (data) {
          //alert ("Sensor Type posted successfully");

          if (data) {
            console.log("data");
            if (data.status && data.status == 'Successful') {
              showMessage(true, false, "A recorded updated successfully !!");
            }
            if (data.error) {
              showMessage(false, true, data.error + " !!");
            }

          }

          // $timeout( function () { TODO }, 3000);
          $timeout( function afterTimeOut () {
            showMessage(false, false, "");
            $window.location.href = '/listSensorType';
//            clearSensorType();
          }, 3000);

        });

    } // else


  }

}
