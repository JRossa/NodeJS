/*jslint node: true */
/*jshint strict: false */
/*global angular: false */
'use strict';

angular.module("userModule")
       .factory("userService", userService);

userService.$inject = ['$rootScope', '$http', '$location'];


function userService ($rootScope, $http, $location) {

  return {

    createUser : function (userData) {

//      console.log("Service: createPin");
//      console.log(pinData);

      return $http.post('/createUser',
        {
          user : userData.user,
        }
      );
    }, // createUser


  }; // return
}
