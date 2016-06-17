angular.module("gpioModule")
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
  }

  $scope.loadLanguage = function ()  {

    var langKey = $scope.currentLang;

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

  }

}
