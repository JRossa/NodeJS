angular.module("eventModule")
       .controller("createEventController", createEventController);

createEventController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                                 '$controller', 'eventService', 'langService'];

function createEventController($rootScope, $scope, $window, $timeout,
                               $controller, eventService, langService) {

  $scope.sensorsData = [];

  angular.extend(this, $controller('langController', {$scope: $scope}));


  loadLanguage ();
  getAllSensors ();


  function loadLanguage () {

    var langKey = $window.localStorage.getItem('langKey');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
           $("#createEvent").show();
        });
  }

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
           $("#createEvent").show();
        });

  }

  function getAllSensors () {
    eventService.getAllSensors()
      .success( function (data) {

        if (data &&
            data.sensorsData &&
            data.sensorsData.length > 0) {

              $scope.sensorsData = data.sensorsData;
              $("#listSensor").show();
            }
      });

  }

  function clearEventData () {

    $scope.eventData.eventSensorId = "";
    $scope.eventData.eventTime = "";
    $scope.eventTime = "";
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
  }


  $scope.validateEventSensorId = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearEventSensorIdMessage () {

    $scope.validateEventSensorId.containsValidationError = false;
    $scope.validateEventSensorId.errorMessage = "";
  }

  function displayEventSensorIdMessage () {

    $scope.validateEventSensorId.containsValidationError = true;
    $scope.validateEventSensorId.errorMessage = $scope.label.createEvent_controller_enterSensor;
  }

  $scope.validateEventTime = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearEventTimeMessage () {

    $scope.validateEventTime.containsValidationError = false;
    $scope.validateEventTime.errorMessage = "";
  }

  function displayEventTimeMessage () {

    $scope.validateEventTime.containsValidationError = true;
    $scope.validateEventTime.errorMessage = $scope.label.createEvent_controller_enterDate;
  }

  function displayEventCurrentTimeMessage () {

    $scope.validateEventTime.containsValidationError = true;
    $scope.validateEventTime.errorMessage = $scope.label.createEvent_controller_insertedCurrDate;;
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

  $scope.eventTime = "";

  $scope.createEvent = function (eventData) {

    var validationMessages = 0;
/*
    var validationMessages = requiredFieldValidationService.getRequiredFieldValidationErrorMessage (
      [
        { name : $scope.sensorType.sensorModel || "", errorMessage : "Please enter sensor model !!"},
        { name : $scope.sensorType.sensorObs || "", errorMessage : "Please enter sensor obs !!"}
      ]);
*/
    if (eventData.eventSensorId.length === 0) {

      displayEventSensorIdMessage ();
      validationMessages++;
    }

    var currDate = new Date();

    if ($scope.eventTime.toString().length === 0) {
//      displayEventTimeMessage ();
//      validationMessages++;
      if (validationMessages === 0) {

        $scope.eventData.eventTime = currDate;
        displayEventCurrentTimeMessage();
      }
    } else {
      console.log(eventData.eventTime);
    }

    console.log("validationMessages : " + validationMessages);

    if (validationMessages > 0) {

      $timeout( function afterTimeOut () {
        clearEventSensorIdMessage ();
        clearEventTimeMessage ();
      }, 2000);


    } else {
      // datetimepick
      if ($scope.eventTime.toString().length !== 0) {
        eventData.eventTime = convertDateTimePicker($scope.eventTime);
      }
      // input -> time
//      currDate = new Date(eventData.eventTime - 1000 * 60 * eventData.eventTime.getTimezoneOffset());
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
      eventService.createEvent(eventData)
        .success(function (data) {
          //alert ("Sensor Type posted successfully");

          if (data) {
            console.log(data);
            if (data.status && data.status == 'Successful') {
              showMessage(true, false, $scope.label.createEvent_controller_recordAdded);
            }
            if (data.error) {
              showMessage(false, true, data.error + " !!");
            }

          }

          // $timeout( function () { TODO }, 3000);
          $timeout( function afterTimeOut () {
            showMessage(false, false, "");
            clearEventData();
            clearEventTimeMessage ();
          }, 3000);

        });
    } // else

  }; // createEvent

  $scope.datetimeChange = function () {
    console.log("Change");
  };

} // createSensorController
