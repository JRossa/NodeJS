/*jslint node: true */
/*jshint strict:false */
'use strict';

var pinRouteConfig = function (app) {

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

pinRouteConfig.prototype.init = function () {

  var self = this;

  self.dbCreateTable();
  self.addRoutes();
  self.processRoutes();

};


pinRouteConfig.prototype.dbCreateTable = function () {

  var pinDao = require('../system/dao/sqlitePinDao');
  if (global.config.site.database === 'mysql') {
    pinDao = require('../system/dao/mysqlPinDao');
  }

  pinDao.pinDao.createTable();

};


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

};


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

      var utilPin = require('../system/utils/utilPin');

      utilPin.lastAction("ALARM_CONFIG");
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
//          console.log(JSON.stringify(pinsData, null, 2));

          res.json({ pinsData : pinsData,
                     pin_switch : process.env.PIN_SWITCH });
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

      var utilPin = require('../system/utils/utilPin');
      var pi3GPIO = require('../system/pi3GPIO/pi3GPIO');

      var pinData = {
        pinBOARD: "",
        pinDirection : 'input',
      };

      utilPin.getAllInputPin (
        function (pinInput) {
          for (var i = 0, len = pinInput.length; i < len; i++) {
            console.log("Set Pin : " + pinInput[i].board);

            if (pinData.used === true) {
              pinData.pinBOARD = pinInput[i].board;

              pi3GPIO.pi3GPIO.setPinData(pinData);
            }
          }
        });

    pinData.pinBOARD = process.env.PIN_SWITCH;
//    pi3GPIO.pi3GPIO.setPinData(pinData);

    utilPin.lastAction("ALARM_SET");
//      res.end();
      res.redirect('/');
    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/clearGPIO',
    callbackFunction : function(req, res) {

      var utilPin = require('../system/utils/utilPin');
      var pi3GPIO = require('../system/pi3GPIO/pi3GPIO');

      var pinData = {
        pinBOARD: "",
        pinDirection : 'null',
      };

      utilPin.getAllInputPin (
        function (pinInput) {
          for (var i = 0, len = pinInput.length; i < len; i++) {
            console.log("Clear Pin : " + pinInput[i].board);

            pinData.pinBOARD = pinInput[i].board;

            pi3GPIO.pi3GPIO.setPinData(pinData);
          }
        });

      pinData.pinBOARD = process.env.PIN_SWITCH;
      pi3GPIO.pi3GPIO.setPinData(pinData);

      utilPin.lastAction("ALARM_RESET");
//      res.end();
      res.redirect('/');
    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/setPinData',
    callbackFunction : function(req, res) {

      console.log("POST setPinData");
      console.log(req.body);

      var pin = false;
//      var eventDao = require('../system/dao/sqliteEventDao');
      if (pin) {
      var pi3GPIO = require('../system/pi3GPIO/pi3GPIO');

      pi3GPIO.pi3GPIO.setPinData (req.body);
    } else {
      var utilEMail = require('../system/utils/utilEMail');

      utilEMail.TOKEN_PATH();
//      utilEMail.getAuhorization();
      utilEMail.sendEMail('Here is the message');
    }
      // nothing to return
      res.end();

    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/setSwitchPin',
    callbackFunction : function(req, res) {

      console.log("POST setSwitchPin");
      console.log(req.body);

//      var eventDao = require('../system/dao/sqliteEventDao');
      var utilPin = require('../system/utils/utilPin');

      utilPin.setPinSwitch ();
      // nothing to return
      res.end();

    }
  });

};


module.exports = pinRouteConfig;
