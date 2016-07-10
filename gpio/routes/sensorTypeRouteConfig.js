
var sensorTypeRouteConfig = function (app) {

  this.app = app;
  this.routeTable = [];

  this.init();
}


/* Equivalent
sensorTypeRouteConfig function sensorTypeRouteConfig(app) {

  this.app = app;
  this.routeTable = [];
  this.init();
}
*/

sensorTypeRouteConfig.prototype.init = function () {

  var self = this;

  self.dbCreateTable();
  self.addRoutes();
  self.processRoutes();

}

sensorTypeRouteConfig.prototype.dbCreateTable = function () {

  var sensorTypeDao = require('../system/dao/sqliteSensorTypeDao');

  sensorTypeDao.sensorTypeDao.createTable();

}


sensorTypeRouteConfig.prototype.processRoutes = function () {

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

sensorTypeRouteConfig.prototype.addRoutes = function () {

  var self = this;

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/createSensorType',
    callbackFunction : function(req, res) {
      res.render('createSensorType', {
        title : "label.menubar_appTitle",
        pagename : "label.createSensorType_pagename"
      });
    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/createSensorType',
    callbackFunction : function(req, res) {

      console.log("POST createSensorType");

      console.log(req.body);

      var sensorTypeDao = require('../system/dao/sqliteSensorTypeDao');

      sensorTypeDao.sensorTypeDao.createSensorType (req.body,

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

      var sensorTypeDao = require('../system/dao/sqliteSensorTypeDao');

      sensorTypeDao.sensorTypeDao.getSensorTypeById (req.params.sensorTypeId,

        function (sensorType) {
          console.log(JSON.stringify(sensorType, null, 2));
          res.render('editSensorType', {
             title : "label.menubar_appTitle",
             pagename : "label.editSensorType_pagename",
             sensorType : sensorType
          });
      });

    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/getSensorTypeById/:sensorTypeId',
    callbackFunction : function(req, res) {

      var sensorTypeDao = require('../system/dao/sqliteSensorTypeDao');

      sensorTypeDao.sensorTypeDao.getSensorTypeById (req.params.sensorTypeId,

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

      var sensorTypeDao = require('../system/dao/sqliteSensorTYpeDao');

      sensorTypeDao.sensorTypeDao.updateSensorType (req.body,

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

      var sensorTypeDao = require('../system/dao/sqliteSensorTypeDao');

      sensorTypeDao.sensorTypeDao.deleteSensorType (req.params.sensorTypeId,

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

      var sensorTypeDao = require('../system/dao/sqliteSensorTypeDao');

      sensorTypeDao.sensorTypeDao.getAllSensorType (

        function (sensorTypes) {
//          console.log(JSON.stringify(sensorTypes, null, 2));
          res.json({ sensorTypes : sensorTypes });
      });

    }
  });

  self.routeTable.push({

      requestType : 'get',
      requestUrl : '/listSensorType',
      callbackFunction : function (request, response) {
          response.render('listSensorType', {
            title : "label.menubar_appTitle",
            pagename : "label.listSensorType_pagename"
          });
      }
  });

}

module.exports = sensorTypeRouteConfig;
