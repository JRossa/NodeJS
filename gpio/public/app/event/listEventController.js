angular.module("eventModule")
       .controller("listEventController", listEventController);

listEventController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                               '$controller', 'eventService', 'langService'];


function listEventController($rootScope, $scope, $window, $timeout,
                             $controller, eventService, langService) {

  $scope.eventsData = [];

  angular.extend(this, $controller('langController', {$scope: $scope}));

/*
  $scope.$on('SOME_TAG', function(response) {
      console.log("Some tag");
  })
*/

  loadLanguage();

  getAllSensors();
  getAllEvents();

  function loadLanguage () {

    var langKey = $window.localStorage.getItem('langKey');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
//           $scope.label = {"menubar_home" : "Home"};
//           console.log(data);
//           $("#listEvent").show();
        });
  };

  $scope.changeLanguage = function (langKey)  {
    $rootScope.currentLang = langKey;

  //  console.log($window.navigator.language);
    $window.localStorage.setItem('langKey', langKey);
    $window.localStorage.setItem('langSet', 'teste');

    $scope.setToggleLang(langKey);

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
//           $scope.label = {"menubar_home" : "Home"};
//           console.log(data);
//           $("#listEvent").show();
        });

  }

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
    eventSensorNum : "",
    eventTime : ""

  };

  $scope.loadEvent = function (eventData) {
    console.log("Load");
    console.log(eventData);
    $scope.eventData.eventId = eventData.id;
    $scope.eventData.eventSensorId = eventData.sensor_id.toString();
    $scope.eventData.eventSensorNum = eventData.sensor_num.toString();
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

  // Returns a random integer between min (included) and max (included)
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


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
    BOARD : "",
    Direction : "",
    SensorId : "",
    Time : ""

  };

  $scope.setPinData = function () {

    pinData.pinBOARD = 38;
    pinData.pinDirection = 'input';

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
    $scope.validateSensorNumber.errorMessage = $scope.label.listEvent_controller_enterSensorNum;
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

  function convertDateTimePicker(dateTime) {

    if (dateTime === "undefined" ||
               dateTime.toString() == "") {
      return dateTime;
    }

    var splitSearch = dateTime.split(" ");
    var splitDate = splitSearch[0].split("-");
    //var now = new Date("2008-08-28 23:30:00");

    var searchDate = new Date(splitDate[2] + "-" + splitDate[1] + "-" + splitDate[0] +
              " " + splitSearch[1] + ":00");

//    console.log(searchDate.getTime());
    if (isNaN(searchDate.getTime())) {  // d.valueOf() could also work
        // date is not valid
        return "";
      }

    // convert to localTime
//    var minutes = searchDate.getTimezoneOffset();
//    searchDate = new Date(searchDate.getTime() - 1000 * 60 * minutes);
    //  searchDate.toISOString().substr(0, 10);
    // "2014-11-19"
    // searchDate.toISOString()
    // "2014-11-19T17:30:34.015Z"
    return searchDate.toISOString();
  }

  function selectTime(searchTime, itemTime, greater) {

//    console.log("----------------" + itemTime);
    searchTime = convertDateTimePicker(searchTime);

//    console.log(searchTime);

    if (typeof searchTime === "undefined") {
      return true;
    }

    if (searchTime == "") {
      return true;
    }

//    console.log(itemTime > searchTime);
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
//          timeOk = selectTime($scope.searchText.startTime.toJSON(), item.act_time, true);
          timeOk = selectTime($scope.searchText.startTime, item.act_time, true);
    }

    if (timeOk) {
      if ($scope.searchText != null &&
          $scope.searchText.endTime != null) {
//            timeOk = selectTime($scope.searchText.endTime.toJSON(), item.act_time, false);
            timeOk = selectTime($scope.searchText.endTime, item.act_time, false);
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
