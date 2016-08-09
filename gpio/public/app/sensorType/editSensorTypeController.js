angular.module("sensorTypeModule")
       .controller("editSensorTypeController", editSensorTypeController);

editSensorTypeController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                                        'sensorTypeService', 'langService'];


function editSensorTypeController($rootScope, $scope, $window, $timeout,
                                         sensorTypeService, langService) {

  $scope.sensorType = {
    sensorId : "",
    sensorModel : "",
    sensorObs : ""
  };

  // https://docs.angularjs.org/api/ng/function/angular.element
  //$('#sensorId').hide();
//  console.log($('#nodeSensorType').text());

  // http://stackoverflow.com/questions/29243854/difference-between-angular-fromjson-and-scope-eval-when-applied-to-json-string
  // Gives an error with newline char(10)
  //  var nodeSensorType = angular.fromJson($('#nodeSensorType').text());

  var nodeSensorType = $scope.$eval($('#nodeSensorType').text());
//  console.log(nodeSensorType);

  console.log(nodeSensorType.id);
  console.log(nodeSensorType.model);
  console.log(nodeSensorType.obs);

  $scope.sensorType.sensorId = nodeSensorType.id;
  $scope.sensorType.sensorModel = nodeSensorType.model;
  $scope.sensorType.sensorObs = nodeSensorType.obs;

  loadLanguage ();

  //getSensorTypeById();

  function loadLanguage () {

    var langKey = $window.localStorage.getItem('langKey');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
           $("#editSensorType").show();
        });
  }

  $scope.changeLanguage = function (langKey)  {
    $rootScope.currentLang = langKey;

  //  console.log($window.navigator.language);
    $window.localStorage.setItem('langKey', langKey);
    $window.localStorage.setItem('langSet', 'teste');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
           $("#editSensorType").show();
        });

  }

  function bindView (sensorType) {

    $scope.sensorType.sensorModel = sensorType.model;
    $scope.sensorType.sensorObs = sensorType.obs;
  }

  function getSensorTypeById () {

    sensorTypeService.getSensorTypeById(sensorTypeService.getIdFromEndPoint())
      .success( function (data) {

         if (data &&
            data.sensorType &&
            data.sensorType.length > 0) {

              //bindView(data.sensorType[0]);
              //bindView(data.sensorType[0]);
            }
      });

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
    $scope.validateSensorNumber.errorMessage = $scope.label.editSensorType_controller_enterSensorNum;
  };

  $scope.updateSensorType = function (sensorType) {

    var validationMessages = 0;

    if ($scope.sensorType.sensorModel.length == 0) {

      displaySensorNumberMessage ();
      validationMessages++;
    }

    console.log("validationMessages : " + validationMessages);

    if (validationMessages > 0) {

      $timeout( function afterTimeOut () {
        clearSensorNumberMessage ();
      }, 2000);


    } else {

      sensorTypeService.updateSensorType(sensorType)
        .success(function (data) {
          //alert ("Sensor Type posted successfully");

          if (data) {
            console.log("data");
            if (data.status && data.status == 'Successful') {
              showMessage(true, false, $scope.label.editSensorType_controller_recordUpdated);
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

}
