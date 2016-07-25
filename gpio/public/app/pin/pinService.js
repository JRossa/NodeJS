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
          pinNumber : pinData.pinNumber

        }
      );
    }, // createSensor

    getAllSensors: function () {

      return $http.get('/getAllSensors');

    }, // getAllSensors

    getAllSensorTypes: function () {

      return $http.get('/getAllSensorTypes');

    }, // getAllSensorTypes

    updatePin : function (pinData) {

      console.log("updatePin : Service");

      return $http.post('/updatePin',
        {
          pinId : pinData.pinId
        }
      );

    }, // updateSensor

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
