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


  $scope.validateLoginUser = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearLoginUserMessage () {

    $scope.validateLoginUser.containsValidationError = false;
    $scope.validateLoginUser.errorMessage = "";
  }

  function displayLoginUserMessage () {

    $scope.validateLoginUser.containsValidationError = true;
    $scope.validateLoginUser.errorMessage = $scope.label.createPin_controller_enterPinBCM;
  }

  $scope.validateLoginPassword = {
    containsValidationError : false,
    errorMessage : "          "
  };

  function clearLoginPasswordMessage () {

    $scope.validateLoginPassword.containsValidationError = false;
    $scope.validateLoginPassword.errorMessage = "";
  }

  function displayLoginPasswordMessage () {

    $scope.validateLoginPassword.containsValidationError = true;
    $scope.validateLoginPassword.errorMessage = $scope.label.createPin_controller_enterPinBOARD;
  }

  $scope.signUpUser = function (userData) {

    console.log(userData);


  }


} // loginController
