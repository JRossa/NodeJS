angular.module("eventModule")
       .factory("eventService", eventService);

eventService.$inject = ['$rootScope', '$http', '$location'];


function eventService ($rootScope, $http, $location) {

  return {

    createEvent : function (eventData) {

      console.log("Service: eventSensor");
      console.log(eventData);

      return $http.post('/createEvent',
        {
          eventSensorId : eventData.eventSensorId,
          eventTime: eventData.eventTime

        }
      );
    }, // createEvent

    getAllEvents: function () {

      return $http.get('/getAllEvents');

    }, // getAllEvents

    getAllSensors: function () {

      return $http.get('/getAllSensors');

    }, // getAllSensors

    deleteEvent : function (eventId) {

      console.log("deleteEvent : Service");
//      $rootScope.$broadcast('SOME_TAG', 'your value');

      // to TEST TODO
     return $http.delete('/deleteEvent/' + eventId);

      // More compatible with different browsers
    //  return $http['delete']('/deleteSensorType/' + sensorTypeId);
  }, // deleteEvent

  }; // return
}
