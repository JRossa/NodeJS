angular.module("sensorModule")
       .factory("sensorService", sensorService);

sensorService.$inject = ['$rootScope', '$http', '$location'];


function sensorService ($rootScope, $http, $location) {

  return {

    createSensor : function (sensorData) {

      console.log("Service: createSensor");
      console.log(sensorData);

      return $http.post('/createSensor',
        {
          sensorNumber : sensorData.sensorNumber,
          sensorTypeId : sensorData.sensorTypeId,
          sensorLocation: sensorData.sensorLocation

        }
      );
    }, // createSensor

    getAllSensors: function () {

      return $http.get('/getAllSensors');

    }, // getAllSensors

    getAllSensorTypes: function () {

      return $http.get('/getAllSensorTypes');

    }, // getAllSensorTypes

    updateSensor : function (sensorData) {

      console.log("updateSensor : Service");
      console.log(sensorData.sensorId);
      console.log(sensorData.sensorNumber);
      console.log(sensorData.sensorTypeId);
      console.log(sensorData.sensorLocation);

      return $http.post('/updateSensor',
        {
          sensorId : sensorData.sensorId,
          sensorNumber : sensorData.sensorNumber,
          sensorTypeId : sensorData.sensorTypeId,
          sensorLocation : sensorData.sensorLocation
        }
      );

    }, // updateSensor

    deleteSensor : function (sensorId) {

      console.log("deleteSensor : Service");
//      $rootScope.$broadcast('SOME_TAG', 'your value');

      // to TEST TODO
     return $http.delete('/deleteSensor/' + sensorId);

      // More compatible with different browsers
    //  return $http['delete']('/deleteSensorType/' + sensorTypeId);
    }, // deleteSensor

  }; // return
}
