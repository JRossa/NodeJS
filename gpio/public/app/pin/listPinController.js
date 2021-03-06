/*jslint node: true */
/*jshint strict: false */
/*jslint jquery: true*/
/*global angular: false */
'use strict';

angular.module("pinModule")
       .controller("listPinController", listPinController);

listPinController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                             '$controller', 'pinService', 'langService'];


function listPinController($rootScope, $scope, $window, $timeout,
                           $controller, pinService, langService) {

  $scope.sensorsData = [];
  $scope.pinsData = [];

  /*jshint validthis: true */
  angular.extend(this, $controller('langController', {$scope: $scope}));


/*
  $scope.$on('SOME_TAG', function(response) {
      console.log("Some tag");
  })
*/

  loadLanguage();

  function loadLanguage () {

    var langKey = $window.localStorage.getItem('langKey');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
          $scope.label = data;
//           $scope.label = {"menubar_home" : "Home"};
//           console.log(data);
          $scope.modalname = data.editPin_pagename;
//          $("#listSensor").show();
        });
  }


  $scope.changeLanguage = function (langKey)  {
    $rootScope.currentLang = langKey;

//    console.log($window.navigator.language);
    $window.localStorage.setItem('langKey', langKey);
    $window.localStorage.setItem('langSet', 'teste');

    $scope.setToggleLang(langKey);

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
          $scope.label = data;
//           $scope.label = {"menubar_home" : "Home"};
//           console.log(data);
          $scope.modalname = data.editPin_pagename;
//          $("#listSensor").show();
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
//              console.log(data);
              $scope.sensorsData = data.sensorsData;
              $("#listPin").show();
            }
      });
  }

  function getAllPins () {
    pinService.getAllPins()
      .success( function (data) {
//        console.log(data);
        if (data &&
            data.pinsData &&
            data.pinsData.length > 0) {

              $scope.pinsData = processPinsData(data.pinsData);
              if (data.pin_switch) {
                $scope.pinsData.pin_switch = data.pin_switch;
              }
//              console.log($scope.pinsData);
              $("#listPin").show();
            }
      });

  }


  function processPinsData(pinsData) {

//    console.log(pinsData);
    angular.forEach(pinsData, function (pinData) {
//      console.log(pinData);

      if (pinData.input === false) {
        pinData.pinInputImage = "Data-Export-icon.png";
      } else {
        if (pinData.input === true)  {
          pinData.pinInputImage = "Data-Import-icon.png";
        } else {
          pinData.pinInputImage = "Data-Undefined-icon.png";
        }
      }

      if (pinData.used === false) {
        pinData.pinUsedImage = "on_off_red.png";
      } else {
        if (pinData.used === true)  {
          pinData.pinUsedImage = "on_off_green.png";
        } else {
          pinData.pinUsedImage = "on_off_blue.png";
        }
      }

      if (pinData.input === false) {
        if (pinData.warn === false) {
          pinData.pinWarnImage = "Alarm-Error-icon-48.png";
        } else {
          if (pinData.warn === true)  {
            pinData.pinWarnImage = "alarm-bell-icon-4.png";
          } else {
            pinData.pinWarnImage = "large.img.png";
          }
        }
      } else {
        pinData.pinWarnImage = "large.img.png";
      }

    });

    return pinsData;
  }

  $scope.controlData = {
    pinInputState : "",
    pinUsedState : "",
    unlockAlarmDuration : ""
  };

  $scope.pinData = {

    pinId : "",
    pinBCM : "",
    pinBOARD : "",
    pinSensorId : "",
    pinSensorLocation : "",
    pinInput : "",
    pinInputImage : "",
    pinUsed : "",
    pinUsedImage : "",
    pinWarn : "",
    pinWarnImage : "",
    pinAlarmDuration : null

  };


  $scope.loadPin = function (pinData) {
    console.log("Load");
    console.log(pinData);
    $scope.pinData.pinId = pinData.id;
    $scope.pinData.pinBCM = pinData.bcm;
    $scope.pinData.pinBOARD = pinData.board;

    if (pinData.sensor_id !== null) {
      $scope.pinData.pinSensorId = pinData.sensor_id.toString();
    }

    $scope.pinData.pinInput = pinData.input;
    $scope.pinData.pinUsed = pinData.used;
    $scope.pinData.pinWarn = pinData.warn;
    $scope.pinData.pinAlarmDuration = pinData.alarm_duration;

    $scope.controlData.pinInputState = $scope.pinData.pinInput;
    $scope.controlData.pinUsedState = $scope.pinData.pinUsed;
    $scope.controlData.unlockAlarmDuration ='false';
  };

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
  }


  $scope.validateSensorLocation = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearSensorLocationMessage () {

    $scope.validateSensorLocation.containsValidationError = false;
    $scope.validateSensorLocation.errorMessage = "";
  }

  function displaySensorLocationMessage () {

    $scope.validateSensorLocation.containsValidationError = true;
    $scope.validateSensorLocation.errorMessage = $scope.label.listPin_controller_enterSensorLocation;
  }


  $scope.validateAlarmDuration = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearAlarmDurationMessage () {

    $scope.validateAlarmDuration.containsValidationError = false;
    $scope.validateAlarmDuration.errorMessage = "";
  }

  function displayAlarmDurationMessage () {

    $scope.validateAlarmDuration.containsValidationError = true;
    $scope.validateAlarmDuration.errorMessage = $scope.label.listPin_controller_enterAlarmDuration;
  }


  $scope.updatePin = function (pinData) {

    var validationMessages = 0;

    pinData.pinInput = $scope.controlData.pinInputState;
    pinData.pinUsed = $scope.controlData.pinUsedState;

    if ($scope.pinData.pinInput === false) {

      if ($scope.pinData.pinAlarmDuration === null ||
            $scope.pinData.pinAlarmDuration.length === 0 ||
              $scope.pinData.pinAlarmDuration < 0) {

        displayAlarmDurationMessage ();
        validationMessages++;

      } else {
        if ($scope.pinData.pinAlarmDuration == 'null') {
          pinData.pinAlarmDuration = null;
        }
      }

      pinData.pinSensorId = null;
    } else {
      if ($scope.pinData.pinSensorLocation.length === 0 ) {

        displaySensorLocationMessage ();
        validationMessages++;
      }

      pinData.pinAlarmDuration = null;
    }

    console.log(pinData);
    console.log("validationMessages : " + validationMessages);

    if (validationMessages > 0) {

      $timeout( function afterTimeOut () {
        clearAlarmDurationMessage ();
        clearSensorLocationMessage ();
      }, 2000);

    } else {


      pinService.updatePin(pinData)
        .success(function (data) {
          //alert ("Sensor Type posted successfully");

          if (data) {
            console.log(data);
            if (data.status && data.status == 'Successful') {
              showMessage(true, false, $scope.label.listPin_controller_recordUpdated);
            }
            if (data.error) {
              showMessage(false, true, data.error + " !!");
            }

          }

          // $timeout( function () { TODO }, 3000);
          $timeout( function afterTimeOut () {
            showMessage(false, false, "");
            $window.location.href = '/listPin';
//            clearSensorType();
          }, 3000);

        });

    } // else
  };


  $scope.switchPin = function (pin) {

    pinService.setSwitchPin(pin);

  };


  $scope.setLocation = function (id) {

//    console.log(id);

    for (var i = 0; i < $scope.sensorsData.length; i++) {
      var sensor = $scope.sensorsData[i];
//      console.log(counter.id);
      if (id == sensor.id) {
        return sensor.location;
      }
    }
  };


  $scope.matchSelection = function (item, b , pinsData, d) {

    var sensorOk = true;
    var timeOk   = true;

  };


  $scope.setPinInputValue = function(value) {

    $scope.controlData.pinInputState = value;
  };


  $scope.setPinUsedValue = function(value) {

    $scope.controlData.pinUsedState = value;
  };


  $scope.setResetAlarmDuration = function () {

    $scope.controlData.unlockAlarmDuration = 'true';
  };


  $scope.resetAlarmDuration = function (value) {

//    console.log($scope.controlData.unlockAlarmDuration);
    if ($scope.controlData.unlockAlarmDuration == 'true') {
      $scope.pinData.pinAlarmDuration = null;
      updateAlarmDuration();
    }
  };

// similar to click in the input field
  function updateAlarmDuration () {

    var validationMessages = 0;

    if ($scope.pinData.pinInput == 'false') {
      if ($scope.pinData.pinAlarmDuration.length === 0) {

        displayAlarmDurationMessage ();
        validationMessages++;
      }

    }

    if (validationMessages > 0) {
      $timeout( function afterTimeOut () {
        clearAlarmDurationMessage ();
      }, 10);
    }
  }

}
