angular.module("eventModule")
       .controller("listEventController", listEventController);

listEventController.$inject = ['$window', '$scope', '$timeout', '$filter',
                                'eventService', 'langService'];


function listEventController($window, $scope, $timeout, $filter,
                              eventService, langService) {

  $scope.eventsData = [];

  var langKey = $window.localStorage.getItem('langKey');

/*
  $scope.$on('SOME_TAG', function(response) {
      console.log("Some tag");
  })
*/

  loadLanguage();

  getAllEvents();

  function loadLanguage () {
    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
//           $scope.label = {"menubar_home" : "Home"};
//           console.log(data);
           $("#listEvent").show();
        });
  };

  function getAllEvents () {
    eventService.getAllEvents()
      .success( function (data) {

        if (data &&
            data.eventsData &&
            data.eventsData.length > 0) {

              $scope.eventsData = data.eventsData;
              $("#listEvent").show();
            }
      });

  };

  $scope.eventData = {

    eventId : 0,
    eventSensorId : "",
    eventTime : ""

  };

  $scope.loadEvent = function (eventData) {
    console.log("Load");
    console.log(eventData);
    $scope.eventData.eventId = eventData.id;
    $scope.eventData.eventSensorId = eventData.sensor_id.toString();
    $scope.eventData.eventTime = eventData.act_time;
  }

  $scope.deleteEvent = function () {
    console.log("Delete");

    if ($scope.eventData.eventId > 0) {
      eventService.deleteEvent($scope.eventData.eventId)
        .success( function (data)  {
          if (data &&
              data.status &&
              data.status === 'Successful') {

                $window.location.href = '/listEvent';
              }

        });
    }
  }

  $scope.deleteAllEvent = function () {
    console.log("Delete All");

    eventService.deleteAllEvent()
        .success( function (data)  {
          if (data &&
              data.status &&
              data.status === 'Successful') {

                $window.location.href = '/listEvent';
              }
    });
  }

  eventData = {

    eventId : "",
    eventSensorId : "",
    eventTime : ""

  };

  var sensorsData = [];

  function getAllSensors () {
    eventService.getAllSensors()
      .success( function (data) {

        if (data &&
            data.sensorsData &&
            data.sensorsData.length > 0) {

              sensorsData = data.sensorsData;
            }
      });

  };

  // Returns a random integer between min (included) and max (included)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getAllSensors();

  $scope.insertEvent = function () {

    if (sensorsData.length > 0) {
      eventData.eventTime = new Date();
      var currDate = new Date(eventData.eventTime - 1000 * 60 * eventData.eventTime.getTimezoneOffset());

      indSensor = getRandomInt(1, sensorsData.length);

//      console.log("Ind Sensor " + indSensor);
//      console.log("Data Sensor " + sensorsData[indSensor].id);
      eventData.eventSensorId = sensorsData[indSensor].id;

      eventService.createEvent(eventData)
        .success(function (data) {
          //alert ("Sensor Type posted successfully");

          if (data) {
            if (data.status && data.status == 'Successful') {
              $window.location.href = '/listEvent';
            }
            if (data.error) {
              console.log(data.error + " !!");
            }
          }
      });
    }
  }

  pinData = {

    Id : "",
    Direction : "",
    SensorId : "",
    Time : ""

  };

  $scope.setPinData = function () {

    pinData.Id = 38;
    pinData.Direction = 'input';

    eventService.setPinData(pinData)
  }

  $scope.message = {

    containsSucessfulMessage : false,
    sucessfulMessage : ""
  };


  $scope.validationResult = {

    containsValidationError: false,
    validationResult : ""
  };


  function showMessage (successStatus, errorStatus, text) {

    $scope.message.containsSucessfulMessage = successStatus;
    $scope.message.containsErrorMessage = errorStatus;
    $scope.message.textMessage = text;
  };


  $scope.validateSensorNumber = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearSensorNumberMessage () {

    $scope.validateSensorNumber.containsValidationError = false;
    $scope.validateSensorNumber.errorMessage = "";
  };

  function displaySensorNumberMessage () {

    $scope.validateSensorNumber.containsValidationError = true;
    $scope.validateSensorNumber.errorMessage = "Enter a sensor model !!";
  };


  /*
        eventData.eventTime = currDate;

        console.log(currDate);

        var year = eventData.eventTime.getFullYear();
            date = eventData.eventTime.getDate(),
            month = eventData.eventTime.getMonth(),
            hours = eventData.eventTime.getHours(),
            minutes = eventData.eventTime.getMinutes(),
            seconds = eventData.eventTime.getSeconds();

        date = date < 10 ? '0'+(date+1) : date+1;
        month = month < 10 ? '0'+(month+1) : month+1;

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        console.log(eventData.eventTime.getTimezoneOffset());

        var timeStamp = date + "-" + month + "-" + year +
                               "" + hours+ ":" + minutes + ":" + seconds + "Z";

        console.log(eventData.eventTime);
        console.log(timeStamp);
        eventData.eventTime = timeStamp;
  */

  function selectSensor(searchSensor, itemSensor) {

    if (typeof searchSensor == "undefined") {
      return true;
    }

    if (searchSensor === "") {
      return true;
    }
//    console.log(typeof searchSensor);
//    console.log(itemSensor);
//    console.log(searchSensor == itemSensor);
    return itemSensor == searchSensor;

  }

  function selectTime(searchTime, itemTime, greater) {

//    console.log("----------------" + itemTime);
//    console.log(searchTime);

  if (typeof searchTime === "undefined") {
      return true;
    }

    if (searchTime == "") {
      return true;
    }

    console.log(itemTime > searchTime);
    if (greater) {
      return itemTime >= searchTime;
    } else {
      return itemTime <= searchTime;
    }
  }

  $scope.matchSelection = function(item){

    var sensorOk = true;
    var timeOk   = true;

//    console.log(item);

//    console.log($scope.searchText);

    if ($scope.searchText != null &&
        $scope.searchText.sensor_num != null) {
          sensorOk = selectSensor($scope.searchText.sensor_num, item.sensor_num);
    }

    if ($scope.searchText != null &&
        $scope.searchText.startTime != null) {
          timeOk = selectTime($scope.searchText.startTime.toJSON(), item.act_time, true);
    }

    if (timeOk) {
      if ($scope.searchText != null &&
          $scope.searchText.endTime != null) {
            timeOk = selectTime($scope.searchText.endTime.toJSON(), item.act_time, false);
      }
    }

//    console.log(sensorOk);
//    console.log(timeOk);
    return sensorOk && timeOk;
  }

  $scope.sort = function (item) {
    $scope.sortKey = item;
    $scope.reverse = !$scope.reverse;
  };

}
