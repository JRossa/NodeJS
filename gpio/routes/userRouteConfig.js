/*jslint node: true */
/*jshint strict:false */
'use strict';

var userRouteConfig = function (app) {

  this.app = app;
  this.routeTable = [];

  this.init();
};


/* Equivalent
sensorRouteConfig function sensorRouteConfig(app) {

  this.app = app;
  this.routeTable = [];
  this.init();
}
*/

userRouteConfig.prototype.init = function () {

  var self = this;

  self.dbCreateTable();

  self.addRoutes();
  self.processRoutes();
};




userRouteConfig.prototype.dbCreateUser = function () {

  var userDao = require('../system/dao/sqliteUserDao');
  if (global.config.site.database === 'mysql') {
    userDao = require('../system/dao/mysqlUserDao');
  }

  var userData = {
    username    : 'user',
    password : null
  };

  userDao.userDao.createUser(userData,
    function (status){
      console.log(status);
  },
    function (status){
      console.log(status);
  });

};


userRouteConfig.prototype.dbCreateTable = function () {

  var self = this;

  var userDao = require('../system/dao/sqliteUserDao');
  if (global.config.site.database === 'mysql') {
    userDao = require('../system/dao/mysqlUserDao');
  }

  userDao.userDao.createTable(function (status) {

    if (status.status == "Finished") {

      setTimeout( function() {
        self.dbCreateUser();
      }, 2000);
    }
  });

  userDao.userDao.createTableCredential(function (status) {

  });

  userDao.userDao.createTablePerson(function (status) {

  });

};


userRouteConfig.prototype.processRoutes = function () {

  var self = this;

  self.routeTable.forEach(function (route) {

      if (route.requestType == 'get') {

//          console.log(route);
          self.app.get(route.requestUrl, route.callbackFunction);
      } else if (route.requestType == 'post') {

//          console.log(route);
          self.app.post(route.requestUrl, route.callbackFunction);
      } else if (route.requestType == 'delete') {

//          console.log(route);
          self.app.delete(route.requestUrl, route.callbackFunction);
      } else if (route.requestType == 'put') {

//          console.log(route);
          self.app.put(route.requestUrl, route.callbackFunction);
      }

  });

};


userRouteConfig.prototype.addRoutes = function () {

  var self = this;

// http://qnimate.com/express-js-middleware-tutorial/
  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/user',
    callbackFunction : function(req, res, next) {

     res.write('first \n');
     next();
    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/user',
    callbackFunction : function(req, res, next) {

      res.write('second');
      res.end();
    }
  });


// http://stackoverflow.com/questions/10695629/what-is-the-parameter-next-used-for-in-express
  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/user/:username',
    callbackFunction : function(req, res, next) {

      console.log(req.params.username);
      console.error(req.params.username == 'e');

       if (req.params.username == 'e') {

         var err = new Error("User already exists !!");
         err.status = 300;
         next(err);
       } else {

         res.send(req.params.username);
      }
    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/createUser',
    callbackFunction : function(req, res) {


      res.render('user/createUser', {
           title : "label.menubar_appTitle",
           pagename : "label.createPin_pagename"
         });
    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/createUser',
    callbackFunction : function(req, res) {

      // https://github.com/FredKSchott/the-node-way
      var utilUser = require('../system/utils/utilUser');

      var newUser = new utilUser();

      utilUser.static();
      newUser.serviceOne();

      newUser.local.email = req.body.email;
      newUser.local.password = newUser.generateHash(req.body.password);

//      res.json({ status : "Successful"});

      utilUser.findOne (req.body,

        function (status) {
          // console.log(status);
          res.json(status);
      },function (status) {
          // console.log(status);
          res.json(status);
      });

    }
  });


  self.routeTable.push ( {
    requestType : 'delete',
    requestUrl : '/deleteUser/:userId',
    callbackFunction : function(req, res) {

      var userDao = require('../system/dao/sqliteUserDao');
      if (global.config.site.database === 'mysql') {
        userDao = require('../system/dao/mysqlUserDao');
      }

      userDao.userDao.deleteAction (req.params.actionId,

        function (status) {
          console.log(status);
          res.json(status);
      },function (status) {
        //          console.log(status);
          res.json(status);
      });
    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/getAllUsers',
    callbackFunction : function(req, res) {

      var userDao = require('../system/dao/sqliteUserDao');
      if (global.config.site.database === 'mysql') {
        userDao = require('../system/dao/mysqlUserDao');
      }

      userDao.actionDao.getAllUser (

        function (usersData) {
//          console.log(JSON.stringify(sensorsData, null, 2));
          res.json({ usersData : usersData });
      });

    }
  });

};


module.exports = userRouteConfig;
