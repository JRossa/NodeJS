var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();
var dbInit = require('../system/db/dbInit');

var pinRouteConfig = function (app) {

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

pinRouteConfig.prototype.init = function () {

  var self = this;

  self.dbCreateTables();
  self.addRoutes();
  self.processRoutes();

}

pinRouteConfig.prototype.dbCreateTables = function () {

    var dbData = new sqlite3.Database(dbInit.dbName);

    dbData.serialize(function () {

      dbData.get("SELECT name FROM sqlite_master " +
          "WHERE type='table' AND name='tbl_pin'", function (err, rows) {

          if (err !== null) {
              console.log(err);
          } else {
            if (rows === undefined) {
                dbData.run('CREATE TABLE "tbl_pin" ' +
                    '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '[bcm] INTEGER UNIQUE NULL, ' +
                    '[board] INTEGER UNIQUE NULL, ' +
                    '[sensor_id] INTEGER UNIQUE NULL, ' +
                    '[input] BOOLEAN NULL, ' +
                    '[used] BOOLEAN  NULL, ' +
                    'FOREIGN KEY(sensor_id) REFERENCES tbl_sensor(id))', function (err) {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        console.log("SQL Table 'tbl_pin' initialized.");
                    }
                });
            } else {
                console.log("SQL Table 'tbl_pin' already initialized.");
            }
        }
      }); // get

    }); // serialize

}


pinRouteConfig.prototype.processRoutes = function () {

  var self = this;

  self.routeTable.forEach(function (route) {

      if (route.requestType == 'get') {

          console.log(route);
          self.app.get(route.requestUrl, route.callbackFunction);
      } else if (route.requestType == 'post') {

          console.log(route);
          self.app.post(route.requestUrl, route.callbackFunction);
      } else if (route.requestType == 'delete') {

          console.log(route);
          self.app.delete(route.requestUrl, route.callbackFunction);
      } else if (route.requestType == 'put') {

          console.log(route);
          self.app.put(route.requestUrl, route.callbackFunction);
      }

  });

}

pinRouteConfig.prototype.addRoutes = function () {

  var self = this;

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/createPin',
    callbackFunction : function(req, res) {

      console.log("POST createPin");
      console.log(req.body);

      var pinDao = require('../system/dao/sqliteEventDao');

      pinDao.pinDao.createEvent (req.body,

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
    requestType : 'get',
    requestUrl : '/createPin',
    callbackFunction : function(req, res) {

      res.render('createPin', {
           title : "label.menubar_appTitle",
           pagename : "label.createEvent_pagename"
         });

    }
  });

  self.routeTable.push ( {
    requestType : 'delete',
    requestUrl : '/deletePin/:pinId',
    callbackFunction : function(req, res) {

      var eventDao = require('../system/dao/sqliteEventDao');

      pinDao.pinDao.deleteEvent (req.params.pinId,

        function (status) {
          console.log(status);
          res.json(status);
      },function (status) {
        //          console.log(status);
          res.json(status);
      });
    }
  });

  self.routeTable.push({

      requestType : 'get',
      requestUrl : '/listPin',
      callbackFunction : function (request, response) {
          response.render('listPin', {
            title : "label.menubar_appTitle",
            pagename : "label.listEvent_pagename"
          });
      }
  });

}

module.exports = pinRouteConfig;
