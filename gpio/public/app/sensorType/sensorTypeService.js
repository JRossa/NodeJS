/*jslint node: true */
/*jshint strict:false */
/*global angular: false */
'use strict';

angular.module("sensorTypeModule")
       .factory("sensorTypeService", sensorTypeService);

sensorTypeService.$inject = ['$rootScope', '$http', '$location'];



function sensorTypeService ($rootScope, $http, $location) {

  return {

    createSensorType : function (sensorType) {

//      console.log("Service: createSensorType");
//      console.log("Service: " + sensorType);

      return $http.post('/createSensorType',
        {
          sensorTypeModel : sensorType.sensorTypeModel,
          sensorTypeObs : sensorType.sensorTypeObs

        }
      );
    }, // createSensorType

    getAllSensorTypes: function () {

      return $http.get('/getAllSensorTypes');

    }, // getAllSensorTypes

    updateSensorType : function (sensorType) {

      console.log("updateSensorType : Service");
      console.log(sensorType.sensorTypeId);
      console.log(sensorType.sensorTypeModel);
      console.log(sensorType.sensorTypeObs);

      return $http.post('/updateSensorType',
        {
          sensorTypeId : sensorType.sensorTypeId,
          sensorTypeModel : sensorType.sensorTypeModel,
          sensorTypeObs : sensorType.sensorTypeObs
        }
      );
    }, // updateeSensorType

    deleteSensorType : function (sensorTypeId) {

      console.log("deleteSensorType : Service");
//      $rootScope.$broadcast('SOME_TAG', 'your value');

      // to TEST TODO
     return $http.delete('/deleteSensorType/' + sensorTypeId);

      // More compatible with different browsers
    //  return $http['delete']('/deleteSensorType/' + sensorTypeId);
  }, // deleteSensorType

    getIdFromEndPoint : function () {
      var absoluteUtl = $location.absUrl();
      var segments = absoluteUtl.split("/");
      var sensorTypeId = segments [segments.length - 1];

      return sensorTypeId;
    }, // getIdFromEndPoint

    getSensorTypeById : function (sensorTypeId) {

      return $http.get('/getSensorTypeById/' + sensorTypeId);
    } // getSensorTypeById

  }; // return
}
