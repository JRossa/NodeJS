/*jslint node: true */
/*jshint strict: false */
/*jslint jquery: true*/
/*global angular: false */
'use strict';

angular.module("alarmModule")
       .controller("setAlarmController", setAlarmController);

setAlarmController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                              '$controller', 'alarmService', 'langService'];


function setAlarmController($rootScope, $scope, $window, $timeout,
                            $controller, alarmService, langService) {


  $scope.alarmSettings = {
    armed: "",
    allDay: "",
    startPeriod: "",
    endPeriod: ""
  };

  getAlarmSettings();

  /*jshint validthis: true */
  angular.extend(this, $controller('langController', {$scope: $scope}));

  loadLanguage ();

  //getSensorTypeById();

  function loadLanguage () {

    var langKey = $window.localStorage.getItem('langKey');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
           $("#setAlarmRPi").show();
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
//           $("#setAlarm").show();
        });

  };


  function getAlarmSettings () {

    alarmService.getAlarmSettings()
      .success( function (data) {

        if (data &&
            data.actionsData &&
            data.actionsData.length > 0) {

              if (data.actionsData.length == 1) {
                var alarmSettings = data.actionsData[0];

                $scope.alarmSettings.armed = alarmSettings.armed;
                $scope.alarmSettings.allDay = alarmSettings.all_day;
                $scope.alarmSettings.startPeriod = alarmSettings.startPeriod;
                $scope.alarmSettings.endPeriod = alarmSettings.endPeriod;
                console.log(alarmSettings);
//                $("#setAlarm").show();
              } else {
                clearAlarmSettings();
              }
            }
      });
  }


  function clearAlarmSettings () {

    $scope.alarmSettings.armed = false;
    $scope.alarmSettings.allDay = false;
    $scope.alarmSettings.startPeriod = "";
    $scope.alarmSettings.endPeriod = "";
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


  $scope.validateAlarmSet = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearAlarmSetMessage () {

    $scope.validateAlarmSet.containsValidationError = false;
    $scope.validateAlarmSet.errorMessage = "";
  }

  function displayAlarmSetMessage () {

    $scope.validateAlarmSet.containsValidationError = true;
    $scope.validateAlarmSet.errorMessage = "";
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
    $scope.validateAlarmDuration.errorMessage = "";
  }

  $scope.validateStartTimeInput = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearStartTimeInputMessage () {

    $scope.validateStartTimeInput.containsValidationError = false;
    $scope.validateStartTimeInput.errorMessage = "";
  }

  function displayStartTimeInputMessage () {

    $scope.validateStartTimeInput.containsValidationError = true;
    $scope.validateStartTimeInput.errorMessage = "";
  }

  $scope.validateEndTimeInput = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearEndTimeInputMessage () {

    $scope.validateEndTimeInput.containsValidationError = false;
    $scope.validateEndTimeInput.errorMessage = "";
  }

  function displayEndTimeInputMessage () {

    $scope.validateEndTimeInput.containsValidationError = true;
    $scope.validateEndTimeInput.errorMessage = "";
  }


  $scope.setAlarmConfig = function (alarmSettings) {

      console.log('passou');
      console.log(alarmSettings);
//      $window.location.href = '/setAlarmRPi ;
    var validationMessages = 0;

    if ($scope.alarmSettings.armed.length === 0) {

      displayAlarmSetMessage ();
      validationMessages++;
    }

    if ($scope.alarmSettings.allDay.length === 0) {

      displayAlarmDurationMessage ();
      validationMessages++;
    }

    if ($scope.alarmSettings.allDay === false) {
      if ($scope.alarmSettings.startPeriod.length === 0) {

        displayStartTimeInputMessage ();
        validationMessages++;
      }

      if ($scope.alarmSettings.endPeriod.length === 0) {

        displayEndTimeInputMessage ();
        validationMessages++;
      }
    }

    console.log("validationMessages : " + validationMessages);


    if (validationMessages > 0) {

      $timeout( function afterTimeOut () {
        clearAlarmSetMessage ();
        clearAlarmDurationMessage ();
        clearStartTimeInputMessage ();
        clearEndTimeInputMessage ();
      }, 2000);

    } else {
      alarmSettings.type = "ALARM_SWITCH";

      alarmService.getActionTypeByType (alarmSettings)
        .success(function (data) {
          //alert ("Sensor Type posted successfully");
          console.log(data);

          if (data) {
            if (data.length == 1) {

              console.log(data.length);
              console.log(data[0].id);
              alarmSettings.typeId = data[0].id;

              alarmService.createAction(alarmSettings)
                .success(function (data) {
                  //alert ("Sensor Type posted successfully");

                  if (data) {
        //            console.log(data);
                    if (data.status && data.status == 'Successful') {
                      showMessage(true, false, $scope.label.createAction_controller_recordAdded);
                    }
                    if (data.error) {
                      showMessage(false, true, data.error + " !!");
                    }

                  }

                  // $timeout( function () { TODO }, 3000);
                  $timeout( function afterTimeOut () {
                    showMessage(false, false, "");
        //            clearAlarmSettings();
                  }, 2000);

                });
            }
            else  {
              showMessage(false, true, $scope.label.createAction_controller_actionTypeNotFound);
            }
          } else {
            showMessage(false, true, $scope.label.createAction_controller_actionTypeTableMissing);
          }

          // $timeout( function () { TODO }, 3000);
          $timeout( function afterTimeOut () {
            showMessage(false, false, "");
//            clearAlarmSettings();
          }, 2000);

        });
    } // else
  };

}
