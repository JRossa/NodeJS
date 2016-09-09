/*jslint node: true */
/*jshint strict: false */
/*jslint jquery: true*/
/*global angular: false */
'use strict';

angular.module("userModule")
       .controller("userController", userController);

userController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                           '$controller', 'userService', 'langService'];

function userController($rootScope, $scope, $window, $timeout,
                         $controller, userService, langService) {


  $scope.userData = {

    name : "",
    email : "",
    password : "",
    username : ""

  };

  /*jshint validthis: true */
  angular.extend(this, $controller('langController', {$scope: $scope}));


  loadLanguage ();

  function loadLanguage () {

    var langKey = $window.localStorage.getItem('langKey');

    langService.loadLanguage(langKey)
        .then ( function (data) {
//           console.log(data);
           $scope.label = data;
           $("#signUpUser").show();
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
           $("#signUpUser").show();
        });

  };

  function clearloginData () {

    $scope.userData.user = "";
    $scope.userData.email = "";
    $scope.userData.password = "";
    $scope.userData.username = "";
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


  $scope.validateUserName = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearUserNameMessage () {

    $scope.validateUserName.containsValidationError = false;
    $scope.validateUserName.errorMessage = "";
  }

  function displayUserNameMessage () {

    $scope.validateUserName.containsValidationError = true;
    $scope.validateUserName.errorMessage = $scope.label.createPin_controller_enterPinBCM;
  }

  $scope.validateUserEMail = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearUserEMailMessage () {

    $scope.validateUserEMail.containsValidationError = false;
    $scope.validateUserEMail.errorMessage = "";
  }

  function displayUserEMailMessage () {

    $scope.validateUserEMail.containsValidationError = true;
    $scope.validateUserEMail.errorMessage = $scope.label.createPin_controller_enterPinBCM;
  }

  $scope.validateUserUserName = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearUserUserNameMessage () {

    $scope.validateUserUserName.containsValidationError = false;
    $scope.validateUserUserName.errorMessage = "";
  }

  function displayUserUserNameMessage () {

    $scope.validateUserUserName.containsValidationError = true;
    $scope.validateUserUserName.errorMessage = $scope.label.createPin_controller_enterPinBCM;
  }

  $scope.validateUserPassword = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearUserPasswordMessage () {

    $scope.validateUserPassword.containsValidationError = false;
    $scope.validateUserPassword.errorMessage = "";
  }

  function displayUserPasswordMessage () {

    $scope.validateUserPassword.containsValidationError = true;
    $scope.validateUserPassword.errorMessage = $scope.label.createPin_controller_enterPinBOARD;
  }


  $scope.signUpUser = function (userData) {


    console.log(userData);
    var validationMessages = 0;
  /*
    var validationMessages = requiredFieldValidationService.getRequiredFieldValidationErrorMessage (
      [
        { name : $scope.sensorType.sensorModel || "", errorMessage : "Please enter sensor model !!"},
        { name : $scope.sensorType.sensorObs || "", errorMessage : "Please enter sensor obs !!"}
      ]);
  */

    if ($scope.userData.email.length === 0) {

      displayUserEMailMessage ();
      validationMessages++;
    } else {

        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      	var validEMail = re.test($scope.userData.email);

        console.log(validEMail);
        if (!validEMail) {
          displayUserEMailMessage ();
          validationMessages++;
        }
    }


  //    console.log("validationMessages : " + validationMessages);

    if (validationMessages > 0) {

      $timeout( function afterTimeOut () {
        clearUserEMailMessage ();
      }, 2000);

    } else {
      console.log('OK');
    }

  }


} // loginController
