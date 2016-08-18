angular.module("pinModule")
       .controller("listPinController", listPinController);

listPinController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                             '$controller', 'pinService', 'langService'];


function listPinController($rootScope, $scope, $window, $timeout,
                           $controller, pinService, langService) {

  $scope.sensorsData = [];
  $scope.pinsData = [];

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
          $scope.modalname = data.editPin_pagename
          $("#listSensor").show();
        });
  };


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
          $scope.modalname = data.editPin_pagename
          $("#listSensor").show();
        });

  }

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
  };

  function getAllPins () {
    pinService.getAllPins()
      .success( function (data) {

        if (data &&
            data.pinsData &&
            data.pinsData.length > 0) {


              $scope.pinsData = processPinsData(data.pinsData);
//              console.log($scope.pinsData);
              $("#listPin").show();
            }
      });

  }


  function convertBoolean(value) {

    if (value == 0) {
      return 'false';
    }
    if (value == 1) {
      return 'true';
    }

    return value;
  };

  function processPinsData(pinsData) {

    console.log(pinsData);
    angular.forEach(pinsData, function (pinData) {
//      console.log(pinData);

      pinData.input = convertBoolean(pinData.input);
      pinData.used = convertBoolean(pinData.used);

      if (pinData.input == 'false') {
        pinData.pinInputImage = "Data-Export-icon.png";
      } else {
        if (pinData.input == 'true')  {
          pinData.pinInputImage = "Data-Import-icon.png";
        } else {
          pinData.pinInputImage = "Data-Undefined-icon.png";
        }
      }

      if (pinData.used == 'false') {
        pinData.pinUsedImage = "on_off_red.png";
      } else {
        if (pinData.used == 'true')  {
          pinData.pinUsedImage = "on_off_green.png";
        } else {
          pinData.pinUsedImage = "on_off_blue.png";
        }
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
    pinAlarmDuration : ""

  };


  $scope.loadPin = function (pinData) {
    console.log("Load");
    console.log(pinData);
    $scope.pinData.pinId = pinData.id;
    $scope.pinData.pinBCM = pinData.bcm;
    $scope.pinData.pinBOARD = pinData.board;
    $scope.pinData.pinSensorId = pinData.sensor_id.toString();
    $scope.pinData.pinInput = pinData.input;
    $scope.pinData.pinUsed = pinData.used;
    $scope.pinData.pinAlarmDuration = pinData.alarm_duration;

    $scope.controlData.pinInputState = $scope.pinData.pinInput;
    $scope.controlData.pinUsedState = $scope.pinData.pinUsed;
    $scope.controlData.unlockAlarmDuration ='false';
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


  $scope.validateAlarmDuration = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearAlarmDurationMessage () {

    $scope.validateAlarmDuration.containsValidationError = false;
    $scope.validateAlarmDuration.errorMessage = "";
  };

  function displayAlarmDurationMessage () {

    $scope.validateAlarmDuration.containsValidationError = true;
    $scope.validateAlarmDuration.errorMessage = $scope.label.listPin_controller_enterAlarmDuration;
  };


  $scope.updatePin = function (pinData) {

    var validationMessages = 0;

    pinData.pinInput = $scope.controlData.pinInputState;
    pinData.pinUsed = $scope.controlData.pinUsedState;

    if ($scope.pinData.pinInput == false) {

      if ($scope.pinData.pinAlarmDuration.length == 0 ||
               $scope.pinData.pinAlarmDuration < 0) {

        displayAlarmDurationMessage ();
        validationMessages++;
      }

    } else {
      pinData.pinAlarmDuration = "";
    }

    console.log(pinData);
    console.log("validationMessages : " + validationMessages);

    if (validationMessages > 0) {

      $timeout( function afterTimeOut () {
        clearAlarmDurationMessage ();
      }, 2000);


    } else {

      pinService.updatePin(pinData)
        .success(function (data) {
          //alert ("Sensor Type posted successfully");

          if (data) {
            console.log("data");
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


  }


  $scope.setLocation = function (id) {

//    console.log(id);

    for (var i = 0; i < $scope.sensorsData.length; i++) {
      var sensor = $scope.sensorsData[i];
//      console.log(counter.id);
      if (id == sensor.id) {
        return sensor.location;
      }
    }
  }


  $scope.matchSelection = function (item, b , pinsData, d) {

    var sensorOk = true;
    var timeOk   = true;

  }


  $scope.setPinInputValue = function(value) {

    $scope.controlData.pinInputState = value;
  }

  $scope.setPinUsedValue = function(value) {

    $scope.controlData.pinUsedState = value;
  }


  $scope.setResetAlarmDuration = function () {

    $scope.controlData.unlockAlarmDuration = 'true';
  }


  $scope.resetAlarmDuration = function (value) {

//    console.log($scope.controlData.unlockAlarmDuration);
    if ($scope.controlData.unlockAlarmDuration == 'true') {
      $scope.pinData.pinAlarmDuration = "";
      updateAlarmDuration();
    }
  }


  function updateAlarmDuration () {

    var validationMessages = 0;

    if ($scope.pinData.pinInput == 'false') {
      if ($scope.pinData.pinAlarmDuration.length == 0) {

        displayAlarmDurationMessage ();
        validationMessages++;
      }

    }

    if (validationMessages > 0) {
      $timeout( function afterTimeOut () {
        clearAlarmDurationMessage ();
      }, 10);
    }
  };
}
