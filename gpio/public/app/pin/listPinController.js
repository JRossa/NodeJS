angular.module("pinModule")
       .controller("listPinController", listPinController);

listPinController.$inject = ['$window', '$scope', '$timeout',
                                'pinService', 'langService'];


function listPinController($window, $scope, $timeout,
                              pinService, langService) {

  $scope.sensorsData = [];
  $scope.pinsData = [];

  $scope.showLang = {

    show_PT: false,
    show_EN : false
  };


  var langKey = $window.localStorage.getItem('langKey');


//  console.log(langKey)
  setToggleLang(langKey)

  function setToggleLang(langKey) {

    if (langKey == 'pt') {
      $scope.showLang.show_PT = true;
      $scope.showLang.show_EN = false;
    }

    if (langKey == 'en') {
      $scope.showLang.show_PT = false;
      $scope.showLang.show_EN = true;
    }
  }


/*
  $scope.$on('SOME_TAG', function(response) {
      console.log("Some tag");
  })
*/

  loadLanguage();

  function loadLanguage () {
    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
          $scope.label = data;
//           $scope.label = {"menubar_home" : "Home"};
//           console.log(data);
          $scope.modalname = data.editPin_pagename
          $("#listSensor").show();
        });
  };

  getSensors();
  getAllPins();

  function getSensors () {
    pinService.getAllSensors()
      .success( function (data) {
        if (data &&
            data.sensorsData &&
            data.sensorsData.length > 0) {
//              console.log(data);
              $scope.sensorsData = data.sensorsData;
              $("#listPin").show();
            }
      });
  }

  function getAllPins () {
    pinService.getAllPins()
      .success( function (data) {

        if (data &&
            data.pinsData &&
            data.pinsData.length > 0) {


              $scope.pinsData = processPinsData(data.pinsData);
//              console.log($scope.pinsData);
              $("#listPin").show();
            }
      });

  }


  function processPinsData(pinsData) {

    console.log(pinsData);
    angular.forEach(pinsData, function (pinData) {
//      console.log(pinData);
      if (pinData.input == 'false') {
        pinData.pinInputImage = "Data-Export-icon.png";
      } else {
        if (pinData.input == 'true')  {
          pinData.pinInputImage = "Data-Import-icon.png";
        } else {
          pinData.pinInputImage = "false.png";
        }
      }

      if (pinData.used == 'false') {
        pinData.pinUsedImage = "on_off_red.png";
      } else {
        if (pinData.used == 'true')  {
          pinData.pinUsedImage = "on_off_green.png";
        } else {
          pinData.pinUsedImage = "on_off_blue.png";
        }
      }

    });

    return pinsData;
  }


  $scope.pinData = {

    pinId : "",
    pinBCM : "",
    pinBOARD : "",
    pinSensorId : "",
    pinSensorLocation : "",
    pinInput : "",
    pinInputImage : "",
    pinUsed : "",
    pinUsedImage : "",
    pinAlarmDuration : ""

  };

  $scope.loadPin = function (pinData) {
    console.log("Load");
    console.log(pinData);
    $scope.pinData.pinId = pinData.id;
    $scope.pinData.pinBCM = pinData.bcm;
    $scope.pinData.pinBOARD = pinData.board;
    $scope.pinData.pinSensorId = pinData.sensor_id.toString();
    $scope.pinData.pinInput = pinData.input.toString();
    $scope.pinData.pinUsed = pinData.used;
    $scope.pinData.pinAlarmDuration = pinData.alarm_duration;
  }

  $scope.deletePin = function () {
    console.log("Delete");

    if ($scope.pinData.pinId > 0) {
      pinService.deletePin($scope.pinData.pinId)
        .success( function (data)  {
          if (data &&
              data.status &&
              data.status === 'Successful') {

                $window.location.href = '/listPin';
              }

        });
    }
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


  $scope.validateAlarmDuration = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearAlarmDurationMessage () {

    $scope.validateAlarmDuration.containsValidationError = false;
    $scope.validateAlarmDuration.errorMessage = "";
  };

  function displayAlarmDurationMessage () {

    $scope.validateAlarmDuration.containsValidationError = true;
    $scope.validateAlarmDuration.errorMessage = "Enter a sensor model !!";
  };

  $scope.updatePin = function (pinData) {

    var validationMessages = 0;

    var pinInputState = $scope.$eval($('#pinInputState').text());
    pinData.pinInput = pinInputState.state

    if (pinInputState.state == 'false') {
      if ($scope.pinData.pinAlarmDuration.length == 0) {

        displayAlarmDurationMessage ();
        validationMessages++;
      }

    }

    var pinUsedState = $scope.$eval($('#pinUsedState').text());
    pinData.pinUsed = pinUsedState.state

    console.log(pinData)

    console.log("validationMessages : " + validationMessages);

    if (validationMessages > 0) {

      $timeout( function afterTimeOut () {
        clearAlarmDurationMessage ();
      }, 2000);


    } else {

      pinService.updatePin(pinData)
        .success(function (data) {
          //alert ("Sensor Type posted successfully");

          if (data) {
            console.log("data");
            if (data.status && data.status == 'Successful') {
              showMessage(true, false, "A recorded updated successfully !!");
            }
            if (data.error) {
              showMessage(false, true, data.error + " !!");
            }

          }

          // $timeout( function () { TODO }, 3000);
          $timeout( function afterTimeOut () {
            showMessage(false, false, "");
            $window.location.href = '/listPin';
//            clearSensorType();
          }, 3000);

        });

    } // else


  }


  $scope.setLocation = function (id) {

    console.log(id);

    for (var i = 0; i < $scope.sensorsData.length; i++) {
      var sensor = $scope.sensorsData[i];
//      console.log(counter.id);
      if (id == sensor.id) {
        return sensor.location;
      }
    }
  }

  $scope.matchSelection = function (item, b , pinsData, d) {

    var sensorOk = true;
    var timeOk   = true;

  }



}
