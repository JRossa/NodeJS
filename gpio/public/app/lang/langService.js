
/*jslint node: true */
/*jshint strict: false */
/*jshint jquery: true */
/*global angular: false */
'use strict';

angular.module("langModule")
       .factory("langService", langService);


langService.$inject = ['$http'];

function langService ($http) {

  return {

    loadLanguage : function (langKey) {

/*
 * com o $queue service

langService.$inject = ['$http', '$q'];
function langService ($http, $q) {


      var defer;
      defer =$q.defer();

      ........

      return defer.promise;
*/

      var defer = $.Deferred();

      //console.log(langKey);

      if (langKey === undefined) {
        langKey = 'pt';
      }

      var fileName = '/app/lang/data/locale-' + langKey + '.json';
      //console.log(fileName);

      $http.get(fileName)
        .success( function (data) {
//          console.log("Service");
//          console.log(data);
          defer.resolve(data);
        })
        .error(function(error){
          console.error("The async call has fail");
        });

      return defer.promise();
    }, // loadLanguage


    setLanguage : function (langKey) {
      $http.post('/setLanguage',
      {
        lang : langKey
      });


    }  // setLanguage


  }; // return
}    // function
