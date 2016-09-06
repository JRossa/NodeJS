/*jslint node: true */
/*jshint strict: false */
/*jslint jquery: true*/
/*global angular: false */
'use strict';

angular.module("pinModule")
       .controller("createPinController", createPinController);

createPinController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                               '$controller', 'pinService', 'langService'];

function createPinController($rootScope, $scope, $window, $timeout,
                             $controller, pinService, langService) {

  $scope.sensorsData = [];
  $scope.pinsData = [];

  $scope.pinData = {

    pinId : "",
    pinBCM : "",
    pinBOARD : "",
    pinSensorId : "",
    pinInput : "",
    pinUsed : "",
    pinWarn : "",
    pinAlarmDuration : ""

  };

  /*jshint validthis: true */
  angular.extend(this, $controller('langController', {$scope: $scope}));


  loadLanguage ();

  function loadLanguage () {

    var langKey = $window.localStorage.getItem('langKey');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
           $("#createPin").show();
        });
  }

  $scope.changeLanguage = function (langKey)  {
    $rootScope.currentLang = langKey;

  //  console.log($window.navigator.language);
    $window.localStorage.setItem('langKey', langKey);
    $window.localStorage.setItem('langSet', 'teste');

    $scope.setToggleLang(langKey);

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
           $("#createPin").show();
           $("#footer").show();
        });

  };

  getSensors();

  function getSensors () {
    pinService.getAllSensors()
      .success( function (data) {
        if (data &&
            data.sensorsData &&
            data.sensorsData.length > 0) {
              console.log(data);
              $scope.sensorsData = data.sensorsData;
              $("#createPin").show();
              $("#footer").show();
            }
      });
  }

  function clearPinData () {

    $scope.pinData.pinId = "";
    $scope.pinData.pinBCM = "";
    $scope.pinData.pinBOARD = "";
    $scope.pinData.pinSensorId = "";
    $scope.pinData.pinInput = "";
    $scope.pinData.pinUsed = "";
    $scope.pinData.pinWarn = "";
    $scope.pinData.pinAlarmDuration = "";
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
  }


  $scope.validatePinBOARD = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearPinBOARDMessage () {

    $scope.validatePinBOARD.containsValidationError = false;
    $scope.validatePinBOARD.errorMessage = "";
  }

  function displayPinBOARDMessage () {

    $scope.validatePinBOARD.containsValidationError = true;
    $scope.validatePinBOARD.errorMessage = $scope.label.createPin_controller_enterPinBCM;
  }

  $scope.validatePinBCM = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearPinBCMMessage () {

    $scope.validatePinBCM.containsValidationError = false;
    $scope.validatePinBCM.errorMessage = "";
  }

  function displayPinBCMMessage () {

    $scope.validatePinBCM.containsValidationError = true;
    $scope.validatePinBCM.errorMessage = $scope.label.createPin_controller_enterPinBOARD;
  }

  $scope.createPin = function (pinData) {

    var validationMessages = 0;
/*
    var validationMessages = requiredFieldValidationService.getRequiredFieldValidationErrorMessage (
      [
        { name : $scope.sensorType.sensorModel || "", errorMessage : "Please enter sensor model !!"},
        { name : $scope.sensorType.sensorObs || "", errorMessage : "Please enter sensor obs !!"}
      ]);
*/

    if ($scope.pinData.pinBOARD.length === 0) {

      displayPinBOARDMessage ();
      validationMessages++;
    }

    if ($scope.pinData.pinBCM.length === 0) {

      displayPinBCMMessage ();
      validationMessages++;
    }

//    console.log("validationMessages : " + validationMessages);

    if (validationMessages > 0) {

      $timeout( function afterTimeOut () {
        clearPinBOARDMessage ();
        clearPinBCMMessage ();
      }, 2000);

    } else {

      pinData.pinSensorId = null;
      pinData.pinInput = false;
      pinData.pinUsed = false;
      pinData.pinWarn = false;
      pinData.pinAlarmDuration = null;

//      console.log(pinData);
      pinService.createPin(pinData)
        .success(function (data) {
          //alert ("Sensor Type posted successfully");

          if (data) {
            if (data.status && data.status == 'Successful') {
              showMessage(true, false, $scope.label.createPin_controller_recordAdded);
            }
            if (data.error) {
              showMessage(false, true, data.error + " !!");
            }

          }

          // $timeout( function () { TODO }, 3000);
          $timeout( function afterTimeOut () {
            showMessage(false, false, "");
            clearPinData();
          }, 5000);

        });
    } // else

  };

} // createSensorController
