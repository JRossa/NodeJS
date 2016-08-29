
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

  self.dbCreateTable();
  self.addRoutes();
  self.processRoutes();

}

pinRouteConfig.prototype.dbCreateTable = function () {

  var pinDao = require('../system/dao/sqlitePinDao');
  if (global.config.site.database === 'mysql') {
    pinDao = require('../system/dao/mysqlPinDao');
  }

  pinDao.pinDao.createTable();

}


pinRouteConfig.prototype.processRoutes = function () {

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

pinRouteConfig.prototype.addRoutes = function () {

  var self = this;

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/createPin',
    callbackFunction : function(req, res) {

      res.render('pin/createPin', {
           title : "label.menubar_appTitle",
           pagename : "label.createPin_pagename"
         });

    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/createPin',
    callbackFunction : function(req, res) {

//      console.log("POST createPin");
//      console.log(req.body);

      var pinDao = require('../system/dao/sqlitePinDao');
      if (global.config.site.database === 'mysql') {
        pinDao = require('../system/dao/mysqlPinDao');
      }

      pinDao.pinDao.createPin (req.body,

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
    requestUrl : '/editPin/:pinId',
    callbackFunction : function(req, res) {

//      res.render('editSensorType', { title : "GPIO", pagename : "Edit Sensor Type"});

      var pinDao = require('../system/dao/sqlitePinDao');
      if (global.config.site.database === 'mysql') {
        pinDao = require('../system/dao/mysqlPinDao');
      }
    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/updatePin',
    callbackFunction : function(req, res) {

      console.log("POST updatePin");

      console.log(req.body);

      var pinDao = require('../system/dao/sqlitePinDao');
      if (global.config.site.database === 'mysql') {
        pinDao = require('../system/dao/mysqlPinDao');
      }

      pinDao.pinDao.updatePin (req.body,

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
    requestUrl : '/deletePin/:pinId',
    callbackFunction : function(req, res) {

      var pinDao = require('../system/dao/sqlitePinDao');
      if (global.config.site.database === 'mysql') {
        pinDao = require('../system/dao/mysqlPinDao');
      }

      pinDao.pinDao.deletePin (req.params.pinId,

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
    requestUrl : '/getAllPins',
    callbackFunction : function(req, res) {

      var pinDao = require('../system/dao/sqlitePinDao');
      if (global.config.site.database === 'mysql') {
        pinDao = require('../system/dao/mysqlPinDao');
      }

      pinDao.pinDao.getAllPin (

        function (pinsData) {
//          console.log(JSON.stringify(sensorsData, null, 2));
          res.json({ pinsData : pinsData });
      });

    }
  });

  self.routeTable.push({

      requestType : 'get',
      requestUrl : '/listPin',
      callbackFunction : function (request, response) {
          response.render('pin/listPin', {
            title : "label.menubar_appTitle",
            pagename : "label.listPin_pagename"
          });
      }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/setGPIO',
    callbackFunction : function(req, res) {

      res.render('pin/createPin', {
           title : "label.menubar_appTitle",
           pagename : "label.createPin_pagename"
         });

    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/clearGPIO',
    callbackFunction : function(req, res) {

      res.render('pin/createPin', {
           title : "label.menubar_appTitle",
           pagename : "label.createPin_pagename"
         });

    }
  });

}

module.exports = pinRouteConfig;
