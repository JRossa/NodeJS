
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

  self.dbCreateTable();
  self.addRoutes();
  self.processRoutes();

}

eventRouteConfig.prototype.dbCreateTable = function () {

  var eventDao = require('../system/dao/sqliteEventDao');
  if (global.config.site.database === 'mysql') {
    eventDao = require('../system/dao/mysqlEventDao');
  }

  eventDao.eventDao.createTable();

}


eventRouteConfig.prototype.processRoutes = function () {

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

eventRouteConfig.prototype.addRoutes = function () {

  var self = this;

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/createEvent',
    callbackFunction : function(req, res) {

      res.render('event/createEvent', {
           title : "label.menubar_appTitle",
           pagename : "label.createEvent_pagename"
         });

    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/createEvent',
    callbackFunction : function(req, res) {

      console.log("POST createEvent");
      console.log(req.body);
      console.log("POST createEvent");

//      var eventDao = require('../system/dao/sqliteEventDao');
      var eventDao = require('../system/pi3GPIO/pi3GPIO');

      eventDao.pi3GPIO.createEvent (req.body,

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
    requestType : 'post',
    requestUrl : '/setPinData',
    callbackFunction : function(req, res) {

      console.log("POST setPinData");
      console.log(req.body);

//      var eventDao = require('../system/dao/sqliteEventDao');
      var eventDao = require('../system/pi3GPIO/pi3GPIO');

      eventDao.pi3GPIO.setPinData (req.body);

    }
  });

  self.routeTable.push ( {
    requestType : 'delete',
    requestUrl : '/deleteEvent/:eventId',
    callbackFunction : function(req, res) {

      var eventDao = require('../system/dao/sqliteEventDao');
      if (global.config.site.database === 'mysql') {
        eventDao = require('../system/dao/mysqlEventDao');
      }

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

  self.routeTable.push ( {
    requestType : 'delete',
    requestUrl : '/deleteAllEvent',
    callbackFunction : function(req, res) {

      var eventDao = require('../system/dao/sqliteEventDao');
      if (global.config.site.database === 'mysql') {
        eventDao = require('../system/dao/mysqlEventDao');
      }

      eventDao.eventDao.deleteAllEvent (

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
    requestUrl : '/getAllEvents',
    callbackFunction : function(req, res) {

      var eventDao = require('../system/dao/sqliteEventDao');
      if (global.config.site.database === 'mysql') {
        eventDao = require('../system/dao/mysqlEventDao');
      }

      eventDao.eventDao.getAllEvent (

        function (eventsData) {
//          console.log(JSON.stringify(eventsData, null, 2));
          res.json({ eventsData : eventsData });
      });

    }
  });

  self.routeTable.push({

      requestType : 'get',
      requestUrl : '/listEvent',
      callbackFunction : function (request, response) {
          response.render('event/listEvent', {
            title : "label.menubar_appTitle",
            pagename : "label.listEvent_pagename"
          });
      }
  });

}

module.exports = eventRouteConfig;
