angular.module("alarmModule")
       .controller("setAlarmController", setAlarmController);

setAlarmController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                                        'alarmService', 'langService'];


function setAlarmController($rootScope, $scope, $window, $timeout,
                                         alarmService, langService) {


  $scope.date = moment();

  $scope.showLang = {
   disabled: true,
   show_PT: false,
   show_EN : false
  };

  var langKey = $window.localStorage.getItem('langKey');

  setToggleLang(langKey)

  // used in toggle buttons labels
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

  loadLanguage ();

  //getSensorTypeById();

  function loadLanguage () {

//    var langKey = $window.localStorage.getItem('langKey');

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

  $scope.reloadPage = function () {

    if ($scope.showLang.changed == true) {
      console.log('passou');
      $window.location.href = '/setAlarmRPi';
      $scope.showLang.changed = false;
    }
  }

}
