angular.module("pinModule")
       .factory("pinService", pinService);

pinService.$inject = ['$rootScope', '$http', '$location'];


function pinService ($rootScope, $http, $location) {

  return {

    createPin : function (pinData) {

      console.log("Service: createPin");
      console.log(pinData);

      return $http.post('/createPin',
        {
          pinBCM : pinData.pinBCM,
          pinBOARD : pinData.pinBOARD,
          pinSensorId : pinData.pinSensorId,
          pinInput : pinData.pinInput,
          pinUsed : pinData.pinUsed,
          pinAlarmDuration : pinData.pinAlarmDuration
        }
      );
    }, // createPin

    getAllSensors: function () {

      return $http.get('/getAllSensors');

    }, // getAllSensors

    getAllPins: function () {

      return $http.get('/getAllPins');

    }, // getAllPins

    updatePin : function (pinData) {

      console.log("updatePin : Service");
      console.log(pinData);
      
      return $http.post('/updatePin',
        {
          pinId : pinData.pinId,
          pinBCM : pinData.pinBCM,
          pinBOARD : pinData.pinBOARD,
          pinSensorId : pinData.pinSensorId,
          pinInput : pinData.pinInput,
          pinUsed : pinData.pinUsed,
          pinAlarmDuration : pinData.pinAlarmDuration
        }
      );

    }, // updatePin

    deletePin : function (pinId) {

      console.log("deletePin : Service");
//      $rootScope.$broadcast('SOME_TAG', 'your value');

      // to TEST TODO
     return $http.delete('/deletePin/' + pinId);

      // More compatible with different browsers
    //  return $http['delete']('/deletePin/' + pinId);
  }, // deletePin

  }; // return
}
