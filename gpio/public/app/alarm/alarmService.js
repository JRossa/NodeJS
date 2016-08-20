angular.module("alarmModule")
       .factory("alarmService", alarmService);

alarmService.$inject = ['$rootScope', '$http', '$location'];



function alarmService ($rootScope, $http, $location) {

  return {

    createAction : function (actionData) {

      console.log("Service: createAction");
      console.log(actionData);

      return $http.post('/createAction',
        {
          armed : actionData.armed,
          allDay : actionData.allDay,
          startPeriod : actionData.startPeriod,
          endPeriod : actionData.endPeriod
        }
      );
    }, // createAction


    getAllActions: function () {

      return $http.get('/getAllActions');

    }, // getAllActions


    getAlarmSettings: function () {

      return $http.get('/getAlarmSettings');

    }, // getAlarmSettings


    deleteAction : function (actionId) {

      console.log("deleteAction : Service");
//      $rootScope.$broadcast('SOME_TAG', 'your value');

      // to TEST TODO
      return $http.delete('/deleteAction/' + actionId);

//      More compatible with different browsers
//      return $http['delete']('/deletePin/' + pinId);
    }, // deleteAction

  }; // return
}
