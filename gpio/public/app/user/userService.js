/*jslint node: true */
/*jshint strict: false */
/*global angular: false */
'use strict';

angular.module("userModule")
       .factory('passwordService', passwordService)
       .factory("userService", userService);


passwordService.$inject = ['$rootScope', '$http', '$location'];

function passwordService ($rootScope, $http, $location) {


  function getStrength(pass) {
    var score = 0;
    if (!pass)
        return score;

    // award every unique letter until 5 repetitions
    var letters = new Object();
    for (var i=0; i<pass.length; i++) {
        letters[pass[i]] = (letters[pass[i]] || 0) + 1;
        score += 5.0 / letters[pass[i]];
    }

    // bonus points for mixing it up
    var variations = {
        digits: /\d/.test(pass),
        lower: /[a-z]/.test(pass),
        upper: /[A-Z]/.test(pass),
        nonWords: /\W/.test(pass),
    }

    var variationCount = 0;
    for (var check in variations) {
        variationCount += (variations[check] == true) ? 1 : 0;
    }
    score += (variationCount - 1) * 10;

    if(score > 100) score = 100;

    return parseInt(score);
  }

  return {

    getStrength: function(pass) {

      return getStrength(pass);
    }

  }

}


userService.$inject = ['$rootScope', '$http', '$location'];


function userService ($rootScope, $http, $location) {

  return {

    createUser : function (userData) {

//      console.log("Service: createPin");
//      console.log(pinData);

      return $http.post('/createUser',
        {
          name : userData.name,
          email : userData.email,
          password : userData.password,
          username : userData.username
        }
      );
    }, // createUser


  }; // return
}
