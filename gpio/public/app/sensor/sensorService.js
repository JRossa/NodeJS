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
