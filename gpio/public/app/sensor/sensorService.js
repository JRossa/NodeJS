angular.module("gpioModule")
       .factory("sensorService", sensorService);

sensorService.$inject = ['$http', '$location'];



function sensorService ($http, $location) {

  return {

    createSensorType : function (sensorType) {

//      console.log("Service: createSensorType");
//      console.log("Service: " + sensorType);

      return $http.post('/createSensorType',
        {
          sensorModel : sensorType.sensorModel,
          sensorObs : sensorType.sensorObs

        }
      );
    }, // createSensorType

    getAllSensorTypes: function () {

      return $http.get('/getAllSensorTypes');

    }, // getAllSensorTypes

    updateSensorType : function (sensorType) {

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
    }, // updateeSensor

    createSensor : function (sensorData) {

      return $http.post('/createSensor',
        {
          sensorNumber : sensorData.sensorNumber,
          sensorType : sensorData.sensorType,
          sensorLocation : sensorData.sensorLocation
        }
      );
    }, // createSensor

    getIdFromEndPoint : function () {
      var absoluteUtl = $location.absUrl();
      var segments = absoluteUtl.split("/");
      var sensorTypeId = segments [segments.length - 1];

      return sensorTypeId;
    }, // getIdFromEndPoint

    getSensorTypeById : function (sensorTypeId) {

      return $http.get('/getSensorTypeById/' + sensorTypeId);
    }

  }; // return
}
