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
          typeId : actionData.typeId,
          armed : actionData.armed,
          allDay : actionData.allDay,
          startPeriod : actionData.startPeriod,
          endPeriod : actionData.endPeriod
        }
      );
    }, // createAction


    //http://stackoverflow.com/questions/13760070/angularjs-passing-data-to-http-get-request
    getActionTypeByType : function (actionData) {

      console.log(actionData);

/*
      // req.query.type
      return $http.get('/getActionTypeByType', {
        params: {
          type : actionData.type
        }
      });

*/
      return $http.post('/getActionTypeByType',
        {
          type : actionData.type
        }
      );

    }, // getActionTypeByType


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
