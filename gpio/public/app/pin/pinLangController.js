angular.module("pinModule")
       .controller("langController", langController);

langController.$inject = ['$rootScope', '$scope', '$window', '$timeout',
                                'langService'];

function langController($rootScope, $scope, $window, $timeout,
                                langService) {

  $scope.showLang = {
   disabled: false,
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

  $scope.setToggleLang = function (langKey)  {
    setToggleLang(langKey);
  }
}
