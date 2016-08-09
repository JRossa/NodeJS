angular.module("sensorModule")
       .controller("listSensorController", listSensorController);

listSensorController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                                'sensorService', 'langService'];


function listSensorController($rootScope, $scope, $window, $timeout,
                              sensorService, langService) {

  $scope.sensorTypes = [];
  $scope.sensorsData = [];

  var langKey = $window.localStorage.getItem('langKey');

/*
  $scope.$on('SOME_TAG', function(response) {
      console.log("Some tag");
  })
*/

  loadLanguage();
  getSensorTypes();
  getAllSensors();

  function loadLanguage () {
    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
          $scope.label = data;
//           $scope.label = {"menubar_home" : "Home"};
//           console.log(data);
          $scope.modalname = data.editSensor_pagename
          $("#listSensor").show();
        });
  };

  $scope.changeLanguage = function (langKey)  {
    $rootScope.currentLang = langKey;

  //  console.log($window.navigator.language);
    $window.localStorage.setItem('langKey', langKey);
    $window.localStorage.setItem('langSet', 'teste');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
          $scope.label = data;
//           $scope.label = {"menubar_home" : "Home"};
//           console.log(data);
          $scope.modalname = data.editSensor_pagename
          $("#listSensor").show();
        });

  }

  function getAllSensors () {
    sensorService.getAllSensors()
      .success( function (data) {

        if (data &&
            data.sensorsData &&
            data.sensorsData.length > 0) {

              $scope.sensorsData = data.sensorsData;
              $("#listSensor").show();
            }
      });

  };

  function getSensorTypes () {
    sensorService.getAllSensorTypes()
      .success( function (data) {
        if (data &&
            data.sensorTypes &&
            data.sensorTypes.length > 0) {
              console.log(data);
              $scope.sensorTypes = data.sensorTypes;
            }
      });
  };

  $scope.sensorData = {

    sensorId : 0,
    sensorNumber : "",
    sensorTypeId : "",
    sensorLocation : ""

  };

  $scope.loadSensor = function (sensorData) {
    console.log("Load");
    console.log(sensorData);
    $scope.sensorData.sensorId = sensorData.id;
    $scope.sensorData.sensorNumber = sensorData.num;
    $scope.sensorData.sensorTypeId = sensorData.type_id.toString();
    $scope.sensorData.sensorLocation = sensorData.location;
  }

  $scope.deleteSensor = function () {
    console.log("Delete");

    if ($scope.sensorData.sensorId > 0) {
      sensorService.deleteSensor($scope.sensorData.sensorId)
        .success( function (data)  {
          if (data &&
              data.status &&
              data.status === 'Successful') {

                $window.location.href = '/listSensor';
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

  $scope.updateSensor = function (sensorData) {

    var validationMessages = 0;

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

      sensorService.updateSensor(sensorData)
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
            $window.location.href = '/listSensor';
//            clearSensorType();
          }, 3000);

        });

    } // else


  }

}
