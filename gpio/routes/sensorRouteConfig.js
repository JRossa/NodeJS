/*jslint node: true */
/*jshint strict:false */
'use strict';

var sensorRouteConfig = function (app) {

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

sensorRouteConfig.prototype.init = function () {

  var self = this;

  self.dbCreateTable();
  self.addRoutes();
  self.processRoutes();

};


sensorRouteConfig.prototype.dbCreateTable = function () {

  var sensorDao = require('../system/dao/sqliteSensorDao');
  if (global.config.site.database === 'mysql') {
    sensorDao = require('../system/dao/mysqlSensorDao');
  }

  sensorDao.sensorDao.createTable();

};


sensorRouteConfig.prototype.processRoutes = function () {

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


sensorRouteConfig.prototype.addRoutes = function () {

  var self = this;

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/createSensor',
    callbackFunction : function(req, res) {
      res.render('sensor/createSensor', {
        title : "label.menubar_appTitle",
        pagename : "label.createSensor_pagename"
      });
    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/createSensor',
    callbackFunction : function(req, res, next) {

      console.log("POST createSensor");
      console.log(req.body);

      var sensorDao = require('../system/dao/sqliteSensorDao');
      if (global.config.site.database === 'mysql') {
        sensorDao = require('../system/dao/mysqlSensorDao');
      }

      sensorDao.sensorDao.createSensor (req.body,

        function (status) {
//          console.log(status);
          res.json(status);
      },function (status) {
//          console.error(status);
          res.json(status);
      });

    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/editSensor/:sensorId',
    callbackFunction : function(req, res) {

//      res.render('editSensorType', { title : "GPIO", pagename : "Edit Sensor Type"});

      var sensorDao = require('../system/dao/sqliteSensorDao');
      if (global.config.site.database === 'mysql') {
        sensorDao = require('../system/dao/mysqlSensorDao');
      }

/* TODO:
      sensorDao.sensorDao.getSensorById (req.params.sensorTypeId,

        function (sensorType) {
          console.log(JSON.stringify(sensorType, null, 2));
          res.render('editSensorType', {
             title : "GPIO",
             pagename : "Edit Sensor Type",
             sensorType : sensorType
          });
      });
*/
    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/getSensorTypeById/:sensorTypeId',
    callbackFunction : function(req, res) {

      var sensorDao = require('../system/dao/sqliteSensorDao');
      if (global.config.site.database === 'mysql') {
        sensorDao = require('../system/dao/mysqlSensorDao');
      }
/* TODO:
      sensorDao.sensorDao.getSensorTypeById (req.params.sensorTypeId,

        function (sensorType) {
          console.log(JSON.stringify(sensorType, null, 2));
          res.json({ sensorType : sensorType });
      });
*/
    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/updateSensor',
    callbackFunction : function(req, res) {

      console.log("POST updateSensor");

      console.log(req.body);

      var sensorDao = require('../system/dao/sqliteSensorDao');
      if (global.config.site.database === 'mysql') {
        sensorDao = require('../system/dao/mysqlSensorDao');
      }

      sensorDao.sensorDao.updateSensor (req.body,

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
    requestUrl : '/deleteSensor/:sensorId',
    callbackFunction : function(req, res) {

      var sensorDao = require('../system/dao/sqliteSensorDao');
      if (global.config.site.database === 'mysql') {
        sensorDao = require('../system/dao/mysqlSensorDao');
      }

      sensorDao.sensorDao.deleteSensor (req.params.sensorId,

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
    requestUrl : '/getAllSensors',
    callbackFunction : function(req, res) {

      var sensorDao = require('../system/dao/sqliteSensorDao');
      if (global.config.site.database === 'mysql') {
        sensorDao = require('../system/dao/mysqlSensorDao');
      }

      sensorDao.sensorDao.getAllSensor (

        function (sensorsData) {
//          console.log(JSON.stringify(sensorsData, null, 2));
          res.json({ sensorsData : sensorsData });
      });

    }
  });

  self.routeTable.push({

      requestType : 'get',
      requestUrl : '/listSensor',
      callbackFunction : function (request, response) {
          response.render('sensor/listSensor', {
            title : "label.menubar_appTitle",
            pagename : "label.listSensor_pagename"
          });
      }
  });

};


module.exports = sensorRouteConfig;
