angular.module("sensorModule")
       .controller("createSensorController", createSensorController);

createSensorController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                                      'sensorService', 'langService'];

function createSensorController($rootScope, $scope, $window, $timeout,
                                sensorService, langService) {

  $scope.sensorTypes = [];

  $scope.sensorData = {

    sensorId : "",
    sensorNumber : "",
    sensorTypeId : "",
    sensorLocation : ""

  };

  loadLanguage ();

  function loadLanguage () {

    var langKey = $window.localStorage.getItem('langKey');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
           $("#createSensor").show();
        });
  }

  $scope.changeLanguage = function (langKey)  {
    $rootScope.currentLang = langKey;

  //  console.log($window.navigator.language);
    $window.localStorage.setItem('langKey', langKey);
    $window.localStorage.setItem('langSet', 'teste');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
           $("#createSensor").show();
        });

  }

  getSensorTypes();

  function getSensorTypes () {
    sensorService.getAllSensorTypes()
      .success( function (data) {
        if (data &&
            data.sensorTypes &&
            data.sensorTypes.length > 0) {
              console.log(data);
              $scope.sensorTypes = data.sensorTypes;
              $("#createSensor").show();
            }
      });
  }

  function clearSensorData () {

    $scope.sensorData.sensorNumber = "";
    $scope.sensorData.sensorTypeId = "";
    $scope.sensorData.sensorLocation = "";
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
    $scope.validateSensorNumber.errorMessage = "Enter a sensor number !!";
  };

  $scope.validateSensorTypeId = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearSensorTypeIdMessage () {

    $scope.validateSensorTypeId.containsValidationError = false;
    $scope.validateSensorTypeId.errorMessage = "";
  };

  function displaySensorTypeIdMessage () {

    $scope.validateSensorTypeId.containsValidationError = true;
    $scope.validateSensorTypeId.errorMessage = "Enter a sensor model !!";
  };

  $scope.createSensor = function (sensorData) {

    var validationMessages = 0;
/*
    var validationMessages = requiredFieldValidationService.getRequiredFieldValidationErrorMessage (
      [
        { name : $scope.sensorType.sensorModel || "", errorMessage : "Please enter sensor model !!"},
        { name : $scope.sensorType.sensorObs || "", errorMessage : "Please enter sensor obs !!"}
      ]);
*/

    if ($scope.sensorData.sensorNumber.length == 0) {

      displaySensorNumberMessage ();
      validationMessages++;
    }

    console.log("validationMessages : " + validationMessages);

    if (validationMessages > 0) {

      $timeout( function afterTimeOut () {
        clearSensorNumberMessage ();
      }, 2000);


    } else {

      sensorService.createSensor(sensorData)
        .success(function (data) {
          //alert ("Sensor Type posted successfully");

          if (data) {
            console.log("data");
            if (data.status && data.status == 'Successful') {
              showMessage(true, false, "A recorded added successfully !!");
            }
            if (data.error) {
              showMessage(false, true, data.error + " !!");
            }

          }

          // $timeout( function () { TODO }, 3000);
          $timeout( function afterTimeOut () {
            showMessage(false, false, "");
            clearSensorData();
          }, 5000);

        });
    } // else

  }

} // createSensorController
