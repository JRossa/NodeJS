/*jslint node: true */
/*jshint strict: false */
/*jslint jquery: true*/
/*global angular: false */
'use strict';

angular.module("loginModule")
       .controller("loginController", loginController);

loginController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                           '$controller', 'loginService', 'langService'];

function loginController($rootScope, $scope, $window, $timeout,
                         $controller, loginService, langService) {


  $scope.loginData = {

    user : "",
    password : "",
    rememberMe : false

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
           $("#loginUser").show();
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
           $("#loginUser").show();
        });

  };

  function clearloginData () {

    $scope.loginData.user = "";
    $scope.loginData.password = "";
    $scope.loginData.rememberMe = false
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

  $scope.loginUser = function (loginData) {

    console.log(loginData);


  }


} // loginController
