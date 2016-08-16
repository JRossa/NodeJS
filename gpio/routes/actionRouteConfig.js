
var actionRouteConfig = function (app) {

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

actionRouteConfig.prototype.init = function () {

  var self = this;

  self.dbCreateTable();

  self.addRoutes();
  self.processRoutes();
}


actionRouteConfig.prototype.dbCreateActionType = function () {

  actionType = [];

  var actionDao = require('../system/dao/sqliteActionDao');
  if (global.config.site.database === 'mysql') {
    actionDao = require('../system/dao/mysqlActionDao');
  }

  actionType.push ( {
    type        : 'ALARM_ON',
    description : 'Alarm is active'
  });

  actionType.push ( {
    type        : 'ALARM_OFF',
    description : 'Alarm is not active'
  });

  actionType.push ( {
    type        : 'ALARM_PERIOD_ON',
    description : 'Alarm period is active'
  });

  actionType.push ( {
    type        : 'ALARM_PERIOD_OFF',
    description : 'Alarm period is not active'
  });

  actionType.push ( {
    type        : 'ALARM_START',
    description : 'Alarm period begin'
  });

  actionType.push ( {
    type        : 'ALARM_END',
    description : 'Alarm period end'
  });

  actionType.push ( {
    type        : 'ALARM_SET',
    description : 'Alarm pin applied'
  });

  actionType.push ( {
    type        : 'ALARM_RESET',
    description : 'Alarm pin reset'
  });

  actionType.push ( {
    type        : 'ALARM_CONFIG',
    description : 'Alarm pin configuration modified'
  });

  actionDao.actionDao.createActionType(actionType,
    function (status){
      console.log('OK !!');
  },
    function (status){
      console.log('Error !!');
  });
}


actionRouteConfig.prototype.dbCreateTable = function () {

  var self = this;

  var actionDao = require('../system/dao/sqliteActionDao');
  if (global.config.site.database === 'mysql') {
    actionDao = require('../system/dao/mysqlActionDao');
  }

  actionDao.actionDao.createTableAction();

  actionDao.actionDao.createTableActionType( function (status) {

    if (status.status == "Finished") {
      console.log("Insert Action Types !!")
      self.dbCreateActionType();
    }
  });

}


actionRouteConfig.prototype.processRoutes = function () {

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

actionRouteConfig.prototype.addRoutes = function () {

  var self = this;

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/setAlarmRPi',
    callbackFunction : function(req, res) {

      res.render('setAlarmRPi', {
           title : "label.menubar_appTitle",
           pagename : "label.setAlarmRPi_pagename",
           modalname : "label.setAlarmRPi_pagename"
         });

    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/createAction',
    callbackFunction : function(req, res) {

      console.log("POST createAction");
      console.log(req.body);

      var actionDao = require('../system/dao/sqliteActionDao');
      if (global.config.site.database === 'mysql') {
        actionDao = require('../system/dao/mysqlActionDao');
      }

      actionDao.actionDao.createAction (req.body,

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
    requestUrl : '/deleteAction/:actionId',
    callbackFunction : function(req, res) {

      var actionDao = require('../system/dao/sqliteActionDao');
      if (global.config.site.database === 'mysql') {
        actionDao = require('../system/dao/mysqlActionDao');
      }

      actionDao.actionDao.deleteAction (req.params.actionId,

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
    requestUrl : '/getAllActions',
    callbackFunction : function(req, res) {

      var actionDao = require('../system/dao/sqliteActionDao');
      if (global.config.site.database === 'mysql') {
        actionDao = require('../system/dao/mysqlActionDao');
      }

      actionDao.actionDao.getAllAction (

        function (actionsData) {
//          console.log(JSON.stringify(sensorsData, null, 2));
          res.json({ actionsData : actionsData });
      });

    }
  });

  self.routeTable.push({

      requestType : 'get',
      requestUrl : '/listAction',
      callbackFunction : function (request, response) {
          response.render('listAction', {
            title : "label.menubar_appTitle",
            pagename : "label.listAction_pagename"
          });
      }
  });

}

module.exports = actionRouteConfig;
