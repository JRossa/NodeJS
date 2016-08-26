
var userRouteConfig = function (app) {

  this.app = app;
  this.routeTable = [];

  this.init();
}


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
}




userRouteConfig.prototype.dbCreateTable = function () {

  var self = this;

  var userDao = require('../system/dao/sqliteUserDao');
  if (global.config.site.database === 'mysql') {
    userDao = require('../system/dao/mysqlUserDao');
  }

  userDao.userDao.createTable();

}


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

}

userRouteConfig.prototype.addRoutes = function () {

  var self = this;

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/setAction',
    callbackFunction : function(req, res) {

      res.render('alarm/setAlarmRPi', {
           title : "label.menubar_appTitle",
           pagename : "label.setAction_pagename",
         });

    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/createUser',
    callbackFunction : function(req, res) {


      var userDao = require('../system/dao/sqliteUserDao');
      if (global.config.site.database === 'mysql') {
        userDao = require('../system/dao/mysqlUserDao');
      }

      userDao.userDao.createUser (req.body,

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


}

module.exports = userRouteConfig;
