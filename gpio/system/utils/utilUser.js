/*jslint node: true */
/*jshint strict:false */
'use strict';

var bcrypt   = require('bcrypt-nodejs');

//  https://dzone.com/articles/how-declare-modules-nodejs
//  http://stackoverflow.com/questions/1635116/javascript-class-method-vs-class-prototype-method
//  http://stackoverflow.com/questions/12180790/defining-methods-via-prototype-vs-using-this-in-the-constructor-really-a-perfo

var utilUser = function () {

  this.facebook = {
    id           : '',
    token        : '',
    email        : '',
    name         : ''
  };

};


utilUser.static = function(){ console.log('static'); };

utilUser.prototype.serviceOne = function(){ console.log('one'); };
utilUser.prototype.serviceTwo = function(){ };
utilUser.prototype.serviceThree = function(){ };

utilUser.prototype.local = {
                    email        : '',
                    password     : ''
  };

utilUser.prototype.google = {
                    id           : '',
                    token        : '',
                    email        : '',
                    name         : ''
  };


utilUser.findOne = function (params, OnErrorCallback, OnSuccessCallback) {

  var self = this;

  console.log(params);


  var userDao = require('../dao/sqliteUserDao');
  if (global.config.site.database === 'mysql') {
    userDao = require('../dao/mysqlUserDao');
  }


  userDao.userDao.findOne (params,

    function (status) {
      console.log(status);

      OnSuccessCallback({ status : "Successful"});
  });
};


utilUser.prototype.testUserData = function () {

  var self = this;

  console.log('testUserData');

  var userData = {
    google   : self.google,
    facebook : self.facebook,
    local    : self.local
  };

  console.log(userData);

};


utilUser.prototype.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};  // generateHash


utilUser.prototype.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};  //  validPassword



module.exports = utilUser;
