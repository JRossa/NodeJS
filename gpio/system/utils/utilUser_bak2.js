/*jslint node: true */
/*jshint strict:false */
'use strict';

var bcrypt   = require('bcrypt-nodejs');


var utilUser = function () {

  return {

    local    : {
      email        : '',
      password     : ''
    },

    facebook : {
      id           : '',
      token        : '',
      email        : '',
      name         : ''
    },

  twitter    : {
      id           : '',
      token        : '',
      displayName  : '',
      username     : ''
    },

    google   : {
      id           : '',
      token        : '',
      email        : '',
      name         : ''
    },

    save : function (OnErrorCallback) {

      OnErrorCallback({ error : "User already exists !!!"});

      /*
          userDao.userDao.createUser (userData,

            function (status) {
              // console.log(status);
              OnSuccessCallback(status);
          },function (status) {
              // console.log(status);
              OnErrorCallback(status);
          });
      */
    },


    findOne : function (params, OnErrorCallback, OnSuccessCallback) {

      var self = this;

      console.log(params);

      var userData = {
        google   : self.google,
        facebook : self.facebook,
        local    : self.local
      };

      console.log(userData);

      var userData = {
        name : '',
        email : '',
        password : '',
        username : ''
      };

      var userDao = require('../dao/sqliteUserDao');
      if (global.config.site.database === 'mysql') {
        userDao = require('../dao/mysqlUserDao');
      }

      OnSuccessCallback({ status : "Successful"});
    },


    generateHash : function(password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    },  // generateHash


    validPassword : function(password) {
      return bcrypt.compareSync(password, this.local.password);
    }  //  validPassword

  }

};

utilUser.init = function () {
  console.log('passou');
};

module.exports = utilUser;
