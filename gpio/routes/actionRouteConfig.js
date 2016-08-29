
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
    type        : 'ALARM_SWITCH',
    description : 'Alarm configuration applied'
  });

  actionType.push ( {
    type        : 'ALARM_ON',
    description : 'Alarm is active (auto)'
  });

  actionType.push ( {
    type        : 'ALARM_OFF',
    description : 'Alarm is not active (auto)'
  });

  actionType.push ( {
    type        : 'ALARM_CONFIG',
    description : 'Alarm pin configuration applied'
  });

  actionType.push ( {
    type        : 'ALARM_SET',
    description : 'Alarm pin applied'
  });

  actionType.push ( {
    type        : 'ALARM_RESET',
    description : 'Alarm pin reset'
  });


  actionDao.actionDao.createActionType(actionType,
    function (status){
      console.log('OK !!');
  },
    function (status){
      console.log('Error !!');
  });
}


actionRouteConfig.prototype.dbCreateAlarmPeriod = function () {

  var actionDao = require('../system/dao/sqliteActionDao');
  if (global.config.site.database === 'mysql') {
    actionDao = require('../system/dao/mysqlActionDao');
  }

  alarmPeriod = {
    startPeriod : '00:00',
    endPeriod   : '00:00'
  };

  actionDao.actionDao.createAlarmPeriod(alarmPeriod,
    function (status){
      console.log(status);
  },
    function (status){
      console.log(status);
  });

}


actionRouteConfig.prototype.dbCreateTable = function () {

  var self = this;

  var actionDao = require('../system/dao/sqliteActionDao');
  if (global.config.site.database === 'mysql') {
    actionDao = require('../system/dao/mysqlActionDao');

    actionDao.actionDao.createTableActionType( function (status) {

      if (status.status == "Finished") {
        console.log("Insert Action Types !!")
        self.dbCreateActionType();

        actionDao.actionDao.createTableAlarmPeriod(function (status) {

          if (status.status == "Finished") {
            console.log("Insert Initial Period !!")
            self.dbCreateAlarmPeriod();

            actionDao.actionDao.createTableAction();
          }
        });
      }

    });

  } else {

    actionDao.actionDao.createTableAction();

    actionDao.actionDao.createTableActionType( function (status) {

      if (status.status == "Finished") {
        console.log("Insert Action Types !!")
        self.dbCreateActionType();
      }
    });

    actionDao.actionDao.createTableAlarmPeriod(function (status) {

      if (status.status == "Finished") {
        console.log("Insert Initial Period !!")
        self.dbCreateAlarmPeriod();
      }
    });
  }

/* for testing data storage
  actionDao.actionDao.getAlarmPeriod (1,

    function (actionsData) {
    console.log("Get Alarm Period !!");
    console.log(actionsData)
  });
*/

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
    requestUrl : '/createAction',
    callbackFunction : function(req, res) {


      var actionDao = require('../system/dao/sqliteActionDao');
      if (global.config.site.database === 'mysql') {
        actionDao = require('../system/dao/mysqlActionDao');
      }

      console.log("----------------POST createAction");
      console.log(req.body);

      if (req.body.allDay == false) {
        actionDao.actionDao.createAlarmPeriod (req.body,

          function (status) {
            // console.log(status);
            req.body.periodId = status.id;

            actionDao.actionDao.createAction (req.body,

              function (status) {
                // console.log(status);
                res.json(status);
            },function (status) {
                // console.log(status);
                res.json(status);
            });

        },function (status) {
            // console.log(status);
            res.json(status);
        });
      } else {

        req.body.periodId = null;

        actionDao.actionDao.createAction (req.body,

          function (status) {
            // console.log(status);
            res.json(status);
        },function (status) {
            // console.log(status);
            res.json(status);
        });
      }
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
        response.render('alarm/listAlarmRPi', {
          title : "label.menubar_appTitle",
          pagename : "label.listAction_pagename"
        });
    }
  });


  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/getAlarmSettings',
    callbackFunction : function(req, res) {

      var actionDao = require('../system/dao/sqliteActionDao');
      if (global.config.site.database === 'mysql') {
        actionDao = require('../system/dao/mysqlActionDao');
      }

      actionDao.actionDao.getLastAction (

        function (actionsData) {
          console.log(JSON.stringify(actionsData, null, 2));

          if (actionsData.length == 1) {
            var alarmSettings = actionsData[0];

            if (alarmSettings.all_day == false) {

              actionDao.actionDao.getAlarmPeriod (alarmSettings.period_id,

                function (periodData) {
//                console.log(JSON.stringify(periodData, null, 2));
                  alarmSettings.startPeriod = periodData[0].start;
                  alarmSettings.endPeriod = periodData[0].end;
                  res.json({ actionsData : [alarmSettings] });
              });
            } else {
              alarmSettings.startPeriod = "";
              alarmSettings.endPeriod = "";
              res.json({ actionsData : [alarmSettings] });
            }
          } else {
            res.json({ actionsData : actionsData });
          }
      });

    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/getActionTypeByType',
    callbackFunction : function(req, res) {

      console.log('server');

      var actionDao = require('../system/dao/sqliteActionTypeDao');
      if (global.config.site.database === 'mysql') {
        actionDao = require('../system/dao/mysqlActionTypeDao');
      }

      console.log(req.query.type);
      actionDao.actionTypeDao.getActionTypeByTag (req.query.type,

        function (data) {
//          console.log(status);
          res.json(data);
        });
    }
  });

  self.routeTable.push ( {
    requestType : 'post',
    requestUrl : '/getActionTypeByType',
    callbackFunction : function(req, res) {

        console.log('server');

      var actionDao = require('../system/dao/sqliteActionTypeDao');
      if (global.config.site.database === 'mysql') {
        actionDao = require('../system/dao/mysqlActionTypeDao');
      }

      // with post
      console.log(req.body.type);
      actionDao.actionTypeDao.getActionTypeByTag (req.body.type,

        function (status) {
//          console.log(status);
          res.json(status);
        });

    }
  });

}

module.exports = actionRouteConfig;
