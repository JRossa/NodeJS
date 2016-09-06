/*jslint node: true */
/*jshint strict: false */
/*global angular: false */
'use strict';

angular.module("loginModule")
       .factory("loginService", loginService);

loginService.$inject = ['$rootScope', '$http', '$location'];


function loginService ($rootScope, $http, $location) {

  return {

    createUser : function (loginData) {

//      console.log("Service: createPin");
//      console.log(pinData);

      return $http.post('/createLogin',
        {
          loginUser : loginData.user,
        }
      );
    }, // createUser


  }; // return
}
