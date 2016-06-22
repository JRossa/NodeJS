var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();
var dbInit = require('../system/db/dbInit');

var eventRouteConfig = function (app) {

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

eventRouteConfig.prototype.init = function () {

  var self = this;

  self.dbCreateTables();
  self.addRoutes();
  self.processRoutes();

}

eventRouteConfig.prototype.dbCreateTables = function () {

    var dbData = new sqlite3.Database(dbInit.dbName);

    dbData.serialize(function () {

      dbData.get("SELECT name FROM sqlite_master " +
          "WHERE type='table' AND name='tbl_event'", function (err, rows) {

          if (err !== null) {
              console.log(err);
          } else {
            if (rows === undefined) {
                dbData.run('CREATE TABLE "tbl_event" ' +
                    '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '[sensor_id] INTEGER NULL, ' +
                    '[time] TIMESTAMP UNIQUE  NULL)', function (err) {
                    if (err !== null) {
                        console.log(err);
                    } else {
                        console.log("SQL Table 'tbl_event' initialized.");
                    }
                });
            } else {
                console.log("SQL Table 'tbl_event' already initialized.");
            }
        }
      }); // get

    }); // serialize

}


eventRouteConfig.prototype.processRoutes = function () {

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

eventRouteConfig.prototype.addRoutes = function () {

  var self = this;

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/createEvent',
    callbackFunction : function(req, res) {

      console.log("POST createEvent");
      console.log(req.body);
      console.log("POST createEvent");

      var eventDao = require('../system/dao/sqliteEventDao');

      eventDao.eventDao.createEvent (req.body,

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
    requestUrl : '/createEvent',
    callbackFunction : function(req, res) {

      res.render('createEvent', {
           title : "label.menubar_appTitle",
           pagename : "label.createEvent_pagename"
         });

    }
  });

  self.routeTable.push ( {
    requestType : 'delete',
    requestUrl : '/deleteEvent/:eventId',
    callbackFunction : function(req, res) {

      var eventDao = require('../system/dao/sqliteEventDao');

      eventDao.eventDao.deleteEvent (req.params.eventId,

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
      requestUrl : '/listEvent',
      callbackFunction : function (request, response) {
          response.render('listEvent', {
            title : "label.menubar_appTitle",
            pagename : "label.listEvent_pagename"
          });
      }
  });

}

module.exports = eventRouteConfig;
