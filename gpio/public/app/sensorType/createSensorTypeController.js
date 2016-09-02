/*jslint node: true */
/*jshint strict: false */
/*jslint jquery: true*/
/*global angular: false */
'use strict';

angular.module("sensorTypeModule")
       .controller("createSensorTypeController", createSensorTypeController);

createSensorTypeController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                                      '$controller', 'sensorTypeService', 'langService'];

function createSensorTypeController($rootScope, $scope, $window, $timeout,
                                    $controller, sensorTypeService, langService) {

  $scope.sensorType = {

    sensorId : "",
    sensorModel : "",
    sensorFileName : "",
    sensorObs : ""
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
           $("#createSensorType").show();
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
           $("#createSensorType").show();
        });

  };

  function clearSensorType () {

    $scope.sensorType.sensorModel = "";
    $scope.sensorType.sensorObs = "";
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


  $scope.validateSensorModel = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearSensorModelMessage () {

    $scope.validateSensorModel.containsValidationError = false;
    $scope.validateSensorModel.errorMessage = "";
  }

  function displaySensorModelMessage () {

    $scope.validateSensorModel.containsValidationError = true;
    $scope.validateSensorModel.errorMessage = $scope.label.createSensorType_controller_enterSensorModel;
  }

  $scope.createSensorType = function (sensorType) {

    var validationMessages = 0;
/*
    var validationMessages = requiredFieldValidationService.getRequiredFieldValidationErrorMessage (
      [
        { name : $scope.sensorType.sensorModel || "", errorMessage : "Please enter sensor model !!"},
        { name : $scope.sensorType.sensorObs || "", errorMessage : "Please enter sensor obs !!"}
      ]);
*/

    if ($scope.sensorType.sensorModel.length === 0) {

      displaySensorModelMessage ();
      validationMessages++;
    }

    console.log("validationMessages : " + validationMessages);

    if (validationMessages > 0) {

      $timeout( function afterTimeOut () {
        clearSensorModelMessage ();
      }, 2000);


    } else {

      sensorTypeService.createSensorType(sensorType)
        .success(function (data) {
          //alert ("Sensor Type posted successfully");

          if (data) {
            console.log("data");
            if (data.status && data.status == 'Successful') {
              showMessage(true, false, $scope.label.createSensorType_controller_recordAdded);
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

  };

$scope.setSensorFileName = function (fileName) {

    $scope.sensorType.sensorFileName = fileName;
  };


} // createSensorTypeController
