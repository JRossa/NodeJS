/*jslint node: true */
/*jshint strict: false */
/*jslint jquery: true*/
/*global angular: false */
'use strict';

angular.module("alarmModule")
       .controller("listAlarmController", listEventController);

listEventController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                               '$controller', 'alarmService', 'langService'];


function listEventController($rootScope, $scope, $window, $timeout,
                             $controller, alarmService, langService) {

  $scope.actionsData = [];

  $scope.alarmPeriodsData = [];


  /*jshint validthis: true */
  angular.extend(this, $controller('langController', {$scope: $scope}));

/*
  $scope.$on('SOME_TAG', function(response) {
      console.log("Some tag");
  })
*/

  getAllAlarmPeriods();

  loadLanguage();

  getAllActions();



  function loadLanguage () {

    var langKey = $window.localStorage.getItem('langKey');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
//           $scope.label = {"menubar_home" : "Home"};
//           console.log(data);
//           $("#listEvent").show();
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
//           $scope.label = {"menubar_home" : "Home"};
//           console.log(data);
//           $("#listAlarm").show();
        });

  };

  function getAllAlarmPeriods () {
    alarmService.getAllAlarmPeriods()
      .success( function (data) {

        if (data &&
            data.alarmPeriodsData &&
            data.alarmPeriodsData.length > 0) {

              $scope.alarmPeriodsData = data.alarmPeriodsData;
              $("#listAlarm").show();
            }
      });

  }

  function getAllActions () {
    alarmService.getAllActions()
      .success( function (data) {

        if (data &&
            data.actionsData &&
            data.actionsData.length > 0) {

              $scope.actionsData = processActionssData(data.actionsData);
              $("#listAlarm").show();
            }
      });

  }

  function processActionssData(actionsData) {

    angular.forEach(actionsData, function (actionData) {
//      console.log(actionData);

      if (actionData.armed === false) {
        actionData.alarmArmedImage = "green_light.png";
      } else {
        if (actionData.armed === true)  {
          actionData.alarmArmedImage = "alarm_icon-184x184.png";
        } else {
          actionData.alarmArmedImage = "Data-Undefined-icon.png";
        }
      }

      if (actionData.all_day === false) {
        actionData.alarmAllDayImage = "half_hour-512.png";
      } else {
        if (actionData.all_day === true)  {
          actionData.alarmAllDayImage = "24hours_available-512.png";
        } else {
          actionData.alarmAllDayImage = "on_off_blue.png";
        }
      }

      if (actionData.period_id === null) {
        actionData.startPeriod = "";
        actionData.endPeriod = "";
      } else {
//        console.log(actionData.period_id);
//        console.log($scope.alarmPeriodsData[actionData.period_id-1]);

        var alarmPeriod = $scope.alarmPeriodsData[actionData.period_id-1];
        actionData.startPeriod = alarmPeriod.start;
        actionData.endPeriod = alarmPeriod.end;
      }
    });

    return actionsData;
  }

  $scope.actionData = {

    actionId : 0,
  };

  $scope.loadAction = function (actionData) {
    console.log("Load");
    console.log(actionData);
    $scope.actionData.actionId = actionData.id;
  };

  $scope.deleteAction = function () {
    console.log("Delete");

    if ($scope.actionData.actionId > 0) {
      alarmService.deleteAction($scope.actionData.actionId)
        .success( function (data)  {
          if (data &&
              data.status &&
              data.status === 'Successful') {

                $window.location.href = '/listAction';
              }

        });
    }
  };

}
