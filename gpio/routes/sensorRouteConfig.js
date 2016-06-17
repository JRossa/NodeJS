var fs = require("fs");
var sqlite3 = require('sqlite3').verbose();
var dbInit = require('../system/db/dbInit');

var sensorRouteConfig = function (app) {

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

sensorRouteConfig.prototype.init = function () {

  var self = this;

  self.dbCreateTables();
  self.addRoutes();
  self.processRoutes();

}

sensorRouteConfig.prototype.dbCreateTables = function () {

    var dbData = new sqlite3.Database(dbInit.dbName);

    dbData.serialize(function () {
      dbData.get("SELECT name FROM sqlite_master " +
          "WHERE type='table' AND name='tbl_sensor'", function (err, rows) {

          if (err !== null) {
              console.log(err);
          } else {
              if (rows === undefined) {
                  dbData.run('CREATE TABLE "tbl_sensor" ' +
                      '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                      '[num] INTEGER  UNIQUE NULL, ' +
                      '[type_id] INTEGER  NULL, ' +
                      '[location] VARCHAR(50)  NULL)', function (err) {
                      if (err !== null) {
                          console.log(err);
                      } else {
                          console.log("SQL Table 'tbl_sensor' initialized.");
                      }
                  });
              } else {
                  console.log("SQL Table 'tbl_sensor' already initialized.");
              }
          }
        });

        dbData.get("SELECT name FROM sqlite_master " +
            "WHERE type='table' AND name='tbl_sensorType'", function (err, rows) {

            if (err !== null) {
                console.log(err);
            } else {
                if (rows === undefined) {
                    dbData.run('CREATE TABLE "tbl_sensorType" ' +
                        '([id] INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                        '[model] VARCHAR(20)  UNIQUE NULL, ' +
                        '[obs] VARCHAR(100)  NULL)', function (err) {
                        if (err !== null) {
                            console.log(err);
                        } else {
                            console.log("SQL Table 'tbl_sensorType' initialized.");
                        }
                    });
                } else {
                    console.log("SQL Table 'tbl_sensorType' already initialized.");
                }
            }
        });

    });

}


sensorRouteConfig.prototype.processRoutes = function () {

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

sensorRouteConfig.prototype.addRoutes = function () {

  var self = this;

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/createSensorType',
    callbackFunction : function(req, res) {

      res.render('createSensorType', { title : "GPIO", pagename : "Create Sensor Type"});

    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/createSensorType',
    callbackFunction : function(req, res) {

      console.log("POST createSensorType");

      console.log(req.body);

      var sensorDao = require('../system/dao/sqliteSensorDao');

      sensorDao.sensorDao.createSensorType (req.body,

        function (status) {
//          console.log(status);
          res.json(status);
      },function (status) {
        //          console.log(status);
          res.json(status);
      });
    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/editSensorType/:sensorTypeId',
    callbackFunction : function(req, res) {

//      res.render('editSensorType', { title : "GPIO", pagename : "Edit Sensor Type"});

      var sensorDao = require('../system/dao/sqliteSensorDao');

      sensorDao.sensorDao.getSensorTypeById (req.params.sensorTypeId,

        function (sensorType) {
          console.log(JSON.stringify(sensorType, null, 2));
          res.render('editSensorType', {
             title : "GPIO",
             pagename : "Edit Sensor Type",
             sensorType : sensorType
          });
      });

    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/getSensorTypeById/:sensorTypeId',
    callbackFunction : function(req, res) {

      var sensorDao = require('../system/dao/sqliteSensorDao');

      sensorDao.sensorDao.getSensorTypeById (req.params.sensorTypeId,

        function (sensorType) {
          console.log(JSON.stringify(sensorType, null, 2));
          res.json({ sensorType : sensorType });
      });

    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/updateSensorType',
    callbackFunction : function(req, res) {

      console.log("POST updateSensorType");

      console.log(req.body);

      var sensorDao = require('../system/dao/sqliteSensorDao');

      sensorDao.sensorDao.updateSensorType (req.body,

        function (status) {
//          console.log(status);
          res.json(status);
      },function (status) {
        //          console.log(status);
          res.json(status);
      });

    }
  });

  self.routeTable.push ( {
    requestType : 'delete',
    requestUrl : '/deleteSensorType/:sensorTypeId',
    callbackFunction : function(req, res) {

      var sensorDao = require('../system/dao/sqliteSensorDao');

      sensorDao.sensorDao.deleteSensorType (req.params.sensorTypeId,

        function (status) {
//          console.log(status);
          res.json(status);
      },function (status) {
        //          console.log(status);
          res.json(status);
      });

    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/getAllSensorTypes',
    callbackFunction : function(req, res) {

      var sensorDao = require('../system/dao/sqliteSensorDao');

      sensorDao.sensorDao.getAllSensorType (

        function (sensorTypes) {
          console.log(JSON.stringify(sensorTypes, null, 2));
          res.json({ sensorTypes : sensorTypes });
      });

    }
  });

  self.routeTable.push({

      requestType : 'get',
      requestUrl : '/listSensorType',
      callbackFunction : function (request, response) {

          response.render('listSensorType', { title : "GPIO", pagename : "List Sensor Type"});
      }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/createSensor',
    callbackFunction : function(req, res) {

      console.log("antes render");
      res.render('createSensor', { title : "GPIO", pagename : "Create Sensor"});

    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/createSensor',
    callbackFunction : function(req, res) {

      console.log("antes render");
      // res.render('createSensor', { title : "Create Sensor"});
      // We will have a DAO API that knows how to persist Data
      // into the database

    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/listSensors',
    callbackFunction : function(req, res) {

      console.log("antes render");
      res.render('listSensors', { title : "GPIO", pagename : "List Sensors"});

    }
  });


}

module.exports = sensorRouteConfig;
