
var app = angular.module('myApp', ['pascalprecht.translate', 'ngSanitize']);

app.config(['$translateProvider', function ($translateProvider) {

/*
  $translateProvider.translations('en', {
    "HEADLINE": "What an awesome module!",
    "PARAGRAPH": "Srsly!",
    "PASSED_AS_TEXT": "Hey there! I'm passed as text value!",
    "PASSED_AS_ATTRIBUTE": "I'm passed as attribute value, cool ha?",
    "PASSED_AS_INTERPOLATION": "Beginners! I'm interpolated!",
    "VARIABLE_REPLACEMENT": "Hi {{name}}",
    "BUTTON_LANG_DE": "German",
    "BUTTON_LANG_EN": "English"
  });

  $translateProvider.translations('de', {
    "HEADLINE": "Was für ein großartiges Modul!",
    "PARAGRAPH": "Ernsthaft!",
    "PASSED_AS_TEXT": "Hey! Ich wurde als text übergeben!",
    "PASSED_AS_ATTRIBUTE": "Ich wurde als Attribut übergeben, cool oder?",
    "PASSED_AS_INTERPOLATION": "Anfänger! Ich bin interpoliert!",
    "VARIABLE_REPLACEMENT": "Hi {{name}}",
    "BUTTON_LANG_DE": "deutsch",
    "BUTTON_LANG_EN": "englisch"
  });
*/

  // configures staticFilesLoader
  $translateProvider.useStaticFilesLoader({
    prefix: 'app/lang/data/locale-',
    suffix: '.json'
  });


  // load 'en' table on startup
  $translateProvider.preferredLanguage('pt');

  $translateProvider.useSanitizeValueStrategy('escape');
  //$translateProvider.useSanitizeValueStrategy('escapeParameters');
  //$translateProvider.useSanitizeValueStrategy('sanitize');
}]);


app.controller('Ctrl', ['$translate', '$scope', '$http', function ($translate, $scope, $http) {

  $scope.changeLanguage = function (langKey) {

    var fileName = 'app/lang/data/locale-' + langKey + '.json';

    $http.get(fileName).success( function (data) {
      //console.log(data);
    });

    $translate.use(langKey);
  };
}]);
