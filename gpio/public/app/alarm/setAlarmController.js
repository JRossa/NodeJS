angular.module("alarmModule")
       .controller("setAlarmController", setAlarmController);

setAlarmController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                              '$controller', 'alarmService', 'langService'];


function setAlarmController($rootScope, $scope, $window, $timeout,
                            $controller, alarmService, langService) {


  $scope.alarmPeriod = {
    start: "",
    end: ""
  }

  angular.extend(this, $controller('langController', {$scope: $scope}));

  loadLanguage ();

  //getSensorTypeById();

  function loadLanguage () {

    var langKey = $window.localStorage.getItem('langKey');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
           $("#setAlarmRPi").show();
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
           $("#setAlarmRPi").show();
        });

  }

  $scope.goInit = function () {

    console.log('passou');
    $window.location.href = '/';
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


  $scope.validateAlarmSet = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearAlarmSetMessage () {

    $scope.validateAlarmSet.containsValidationError = false;
    $scope.validateAlarmSet.errorMessage = "";
  };

  function displayAlarmSetMessage () {

    $scope.validateAlarmSet.containsValidationError = true;
    $scope.validateAlarmSet.errorMessage = "";
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
    $scope.validateAlarmDuration.errorMessage = "";
  };

  $scope.validateStartTimeInput = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearStartTimeInputMessage () {

    $scope.validateStartTimeInput.containsValidationError = false;
    $scope.validateStartTimeInput.errorMessage = "";
  };

  function displayStartTimeInputMessage () {

    $scope.validateStartTimeInput.containsValidationError = true;
    $scope.validateStartTimeInput.errorMessage = "";
  };

  $scope.validateEndTimeInput = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearEndTimeInputMessage () {

    $scope.validateEndTimeInput.containsValidationError = false;
    $scope.validateEndTimeInput.errorMessage = "";
  };

  function displayEndTimeInputMessage () {

    $scope.validateEndTimeInput.containsValidationError = true;
    $scope.validateEndTimeInput.errorMessage = "";
  };


  $scope.reloadPage = function () {

    if ($scope.showLang.changed == true) {
      console.log('passou');
      $window.location.href = '/setAlarmRPi';
      $scope.showLang.changed = false;
    }
  }


}
