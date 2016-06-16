angular.module("gpioModule")
       .controller("sensorController", sensorController);

sensorController.$inject = ['$window', '$scope', '$timeout',
                            'sensorService', 'langService'];

function sensorController($window, $scope, $timeout,
                          sensorService, langService) {

  loadLanguage ();

  function loadLanguage () {

    var langKey = $window.localStorage.getItem('langKey');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
           $("#createSensorType").show();
        });
  }

  $scope.sensorType = {

    sensorModel : "",
    sensorObs : ""
  };

  function clearSensorType () {

    $scope.sensorType.sensorModel = "";
    $scope.sensorType.sensorObs = "";
  };


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

  $scope.createSensorType = function (sensorType) {

    var validationMessages = 0;
/*
    var validationMessages = requiredFieldValidationService.getRequiredFieldValidationErrorMessage (
      [
        { name : $scope.sensorType.sensorModel || "", errorMessage : "Please enter sensor model !!"},
        { name : $scope.sensorType.sensorObs || "", errorMessage : "Please enter sensor obs !!"}
      ]);
*/

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

      sensorService.createSensorType(sensorType)
        .success(function (data) {
          //alert ("Sensor Type posted successfully");

          if (data) {
            console.log("data");
            if (data.status == 'Successful') {
              showMessage(true, false, "A recorded added successfully !!");
            }
            if (data.error) {
              showMessage(false, true, data.error + " !!");
            }

          }

          // $timeout( function () { TODO }, 3000);
          $timeout( function afterTimeOut () {
            showMessage(false, false, "");
            clearSensorType();
          }, 5000);

        });

    } // else

  }

  $scope.sensorData = {

    sensorId : "",
    sensorNumber : "",
    sensorType : "",
    sensorLocation : ""

  };


  $scope.createSensor = function (sensorData) {

    sensorService.createSensor(sensorData)
      .success(function (data) {

        // $timeout( function () { TODO }, 3000);
        alert ("Sensor Data posted successfully");
      });
  }

} // sensorController
