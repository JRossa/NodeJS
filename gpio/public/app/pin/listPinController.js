angular.module("pinModule")
       .controller("listPinController", listPinController);

listPinController.$inject = ['$window', '$scope', '$timeout',
                                'pinService', 'langService'];


function listPinController($window, $scope, $timeout,
                              pinService, langService) {

  $scope.sensorsData = [];
  $scope.pinsData = [];

  var langKey = $window.localStorage.getItem('langKey');

/*
  $scope.$on('SOME_TAG', function(response) {
      console.log("Some tag");
  })
*/

  loadLanguage();

  function loadLanguage () {
    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
          $scope.label = data;
//           $scope.label = {"menubar_home" : "Home"};
//           console.log(data);
          $scope.modalname = data.editPin_pagename
          $("#listSensor").show();
        });
  };

  getSensors();
  getAllPins();

  function getSensors () {
    pinService.getAllSensors()
      .success( function (data) {
        if (data &&
            data.sensorsData &&
            data.sensorsData.length > 0) {
              console.log(data);
              $scope.sensorsData = data.sensorsData;
              $("#listPin").show();
            }
      });
  }

  function getAllPins () {
    pinService.getAllPins()
      .success( function (data) {

        if (data &&
            data.pinsData &&
            data.pinsData.length > 0) {

              $scope.pinsData = data.pinsData;
              $("#listPin").show();
            }
      });

  };

  $scope.pinData = {

    pinId : "",
    pinBCM : "",
    pinBOARD : "",
    pinSensorId : "",
    pinInput : "",
    pinUsed : "",
    pinAlarmDuration : ""

  };

  $scope.loadPin = function (pinData) {
    console.log("Load");
    console.log(pinData);
    $scope.pinData.pinId = pinData.id;
    $scope.pinData.pinBCM = pinData.bcm;
    $scope.pinData.pinBOARD = pinData.board;
    $scope.pinData.pinSensorId = pinData.sensor_id;
    $scope.pinData.pinInput = pinData.input;
    $scope.pinData.pinUsed = pinData.used;
    $scope.pinData.pinAlarmDuration = pinData.alarm_duration;
  }

  $scope.deletePin = function () {
    console.log("Delete");

    if ($scope.pinData.pinId > 0) {
      pinService.deletePin($scope.pinData.pinId)
        .success( function (data)  {
          if (data &&
              data.status &&
              data.status === 'Successful') {

                $window.location.href = '/listPin';
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

  $scope.updatePin = function (pinData) {

    var validationMessages = 0;

    console.log("validationMessages : " + validationMessages);

    if (validationMessages > 0) {

      $timeout( function afterTimeOut () {
        clearSensorNumberMessage ();
      }, 2000);


    } else {

      pinService.updatePin(pinData)
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
