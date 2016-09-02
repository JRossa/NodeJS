/*jslint node: true */
/*jshint strict: false */
/*jslint jquery: true*/
/*global angular: false */
/*global document: false */
'use strict';

angular.module("langModule")
       .controller("langController", langController);

langController.$inject = ['$rootScope', '$scope', '$window',
                          'langService', 'socketService'];


function langController ($rootScope, $scope, $window,
                         langService, socketService) {

  $scope.msg = [];


  function render (data) {

    $scope.msg = data;

    console.log($scope.msg);
  }

  $scope.changeLanguage = function (langKey)  {

    $rootScope.currentLang = langKey;

    console.log($window.navigator.language);
    $window.localStorage.setItem('langKey', langKey);
    $window.localStorage.setItem('langSet', 'teste');

    langService.loadLanguage(langKey)
        .then ( function (data) {
  //         console.log(data);
           $scope.label = data;
           $("#index").show();
        });

    langService.setLanguage(langKey);
  };

  $scope.loadLanguage = function ()  {


    socketService.on('messages', function (data) {
      console.log("socketService");
      console.log(data);
      render(data);
    });

    langService.loadLanguage(langKey)
        .then ( function (data) {
 //          console.log(data);
           $scope.label = data;
           $("#index").show();
        });

    langService.setLanguage(langKey);
  };

  $scope.showLang = {
    disabled: false,
    show_PT: true,
    show_EN : false
  };


  var langKey = $window.localStorage.getItem('langKey');


//  console.log(langKey)
  setToggleLang(langKey);

  // used in toggle buttons labels
  function setToggleLang(langKey) {

    langService.setLanguage(langKey);

    if (langKey == 'pt') {
      $scope.showLang.show_PT = true;
      $scope.showLang.show_EN = false;
    }

    if (langKey == 'en') {
      $scope.showLang.show_PT = false;
      $scope.showLang.show_EN = true;
    }
  }


  $scope.addMessage = function ()  {
    var payload = {
      author : document.getElementById('username').value,
      text : document.getElementById('msg').value
    };

    console.log("socketService : emit new-message");
    socketService.emit('new-message', payload);

    socketService.on('messages', function (data) {
      console.log("socketService");
      console.log(data);
      render(data);
    });

  };

}
