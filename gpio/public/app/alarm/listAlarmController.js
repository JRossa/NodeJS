angular.module("alarmModule")
       .controller("listAlarmController", listEventController);

listEventController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                               '$controller', 'alarmService', 'langService'];


function listEventController($rootScope, $scope, $window, $timeout,
                             $controller, alarmService, langService) {

  $scope.eventsData = [];

  angular.extend(this, $controller('langController', {$scope: $scope}));

/*
  $scope.$on('SOME_TAG', function(response) {
      console.log("Some tag");
  })
*/

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
           $("#listEvent").show();
        });
  };

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
           $("#listEvent").show();
        });

  }

  var sensorsData = [];

  function getAllActions () {
    alarmService.getAllActions()
      .success( function (data) {

        if (data &&
            data.actionsData &&
            data.actionsData.length > 0) {

              actionsData = data.actionsData;
            }
      });

  };


  $scope.alarmData = {

    alarmId : 0,
  };

  $scope.loadAlarm = function (alarmData) {
    console.log("Load");
    console.log(alarmData);
    $scope.eventData.eventId = eventData.id;
    $scope.eventData.eventSensorId = eventData.sensor_id.toString();
    $scope.eventData.eventSensorNum = eventData.sensor_num.toString();
    $scope.eventData.eventTime = eventData.act_time;
  }

  $scope.deleteAlarm = function () {
    console.log("Delete");

    if ($scope.alarmData.eventId > 0) {
      eventService.deleteEvent($scope.alarmData.alarmId)
        .success( function (data)  {
          if (data &&
              data.status &&
              data.status === 'Successful') {

                $window.location.href = '/listAction';
              }

        });
    }
  }
}
