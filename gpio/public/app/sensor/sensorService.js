angular.module("sensorModule")
       .factory("sensorService", sensorService);

sensorService.$inject = ['$rootScope', '$http', '$location'];


function sensorService ($rootScope, $http, $location) {

  return {

    createSensor : function (sensor) {

//      console.log("Service: createSensorType");
//      console.log("Service: " + sensorType);

      return $http.post('/createSensor',
        {
          sensorNumber : sensor.sensorNumber,
          sensorTypeId : sensor.sensorTypeId,
          sensorLocation: sensor.Location

        }
      );
    }, // createSensor

    getAllSensorTypes: function () {

      return $http.get('/getAllSensorTypes');

    }, // getAllSensorTypes

    updateSensor : function (sensor) {
/*
      console.log("updateSensorType : Service");
      console.log(sensorType.sensorId);
      console.log(sensorType.sensorModel);
      console.log(sensorType.sensorObs);

      return $http.post('/updateSensorType',
        {
          sensorId : sensorType.sensorId,
          sensorModel : sensorType.sensorModel,
          sensorObs : sensorType.sensorObs
        }
      );
*/
    }, // updateSensor

    deleteSensor : function (sensorId) {

      console.log("deleteSensor : Service");
//      $rootScope.$broadcast('SOME_TAG', 'your value');

      // to TEST TODO
//     return $http.delete('/deleteSensorType/' + sensorTypeId);

      // More compatible with different browsers
    //  return $http['delete']('/deleteSensorType/' + sensorTypeId);
    }, // deleteSensor

  }; // return
}
