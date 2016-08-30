angular.module("sensorTypeModule")
       .controller("listSensorTypeController", listSensorTypeController);

listSensorTypeController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                                    '$controller', 'sensorTypeService', 'langService'];


function listSensorTypeController($rootScope, $scope, $window, $timeout,
                                  $controller, sensorTypeService, langService) {

  $scope.sensorTypes = [];

  angular.extend(this, $controller('langController', {$scope: $scope}));

/*
  $scope.$on('SOME_TAG', function(response) {
      console.log("Some tag");
  })
*/

  loadLanguage();

  getAllSensorTypes();

  function loadLanguage () {

    var langKey = $window.localStorage.getItem('langKey');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
          $scope.label = data;
//           $scope.label = {"menubar_home" : "Home"};
//           console.log(data);
          $scope.modalname = data.editSensorType_pagename
          $("#listSensorType").show();
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
          $scope.modalname = data.editSensorType_pagename
          $("#listSensorType").show();
        });

  }

  function getAllSensorTypes () {

    sensorTypeService.getAllSensorTypes()
      .success( function (data) {

        if (data &&
            data.sensorTypes &&
            data.sensorTypes.length > 0) {

              $scope.sensorTypes = data.sensorTypes;
              $("#listSensorType").show();
            }
      });

  };

  $scope.sensorType = {
    sensorTypeId : "",
    sensorTypeModel : "",
    sensorTypeFileName : "",
    sensorTypeObs : ""
  };

  $scope.loadSensorType = function (sensorType) {
//    console.log("Load");
//    console.log(sensorType);
    $scope.sensorType.sensorTypeId = sensorType.id;
    $scope.sensorType.sensorTypeModel = sensorType.model;
    $scope.sensorType.sensorTypeObs = sensorType.obs;
  }

  $scope.deleteSensorType = function () {
    console.log("Delete");

    if ($scope.sensorType.sensorTypeId > 0) {
      sensorTypeService.deleteSensorType($scope.sensorType.sensorTypeId)
        .success( function (data)  {
          if (data &&
              data.status &&
              data.status === 'Successful') {

                $window.location.href = '/listSensorType';
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
    $scope.validateSensorNumber.errorMessage = $scope.label.listSensorType_controller_enterSensorNum;
  };

  $scope.updateSensorType = function (sensorType) {

    var validationMessages = 0;

    if ($scope.sensorType.sensorTypeModel.length == 0) {

      displaySensorNumberMessage ();
      validationMessages++;
    }

    console.log("validationMessages : " + validationMessages);

    if (validationMessages > 0) {

      $timeout( function afterTimeOut () {
        clearSensorNumberMessage ();
      }, 2000);


    } else {
//      console.log(sensorType);


      sensorTypeService.updateSensorType(sensorType)
        .success(function (data) {
          //alert ("Sensor Type posted successfully");

          if (data) {
            console.log(data);
            if (data.status && data.status == 'Successful') {
              showMessage(true, false, $scope.label.listSensorType_controller_recordUpdated);
            }
            if (data.error) {
              showMessage(false, true, data.error + " !!");
            }

          }

          // $timeout( function () { TODO }, 3000);
          $timeout( function afterTimeOut () {
            showMessage(false, false, "");
            $window.location.href = '/listSensorType';
//            clearSensorType();
          }, 3000);

        });

    } // else

  }

  $scope.setSensorFileName = function (fileName) {

      $scope.sensorType.sensorFileName = fileName;
    }

}
