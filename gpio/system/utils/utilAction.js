/*jslint node: true */
/*jshint strict:false */
'use strict';

var utilAction = {


  getLastAction : function (OnSuccessCallback) {

    var utilTime = require('./utilTime');

    var actionDao = require('../dao/sqliteActionDao');
    if (global.config.site.database === 'mysql') {
      actionDao = require('../dao/mysqlActionDao');
    }

    actionDao.actionDao.getLastAction (

      function (actionsData) {
        console.log(JSON.stringify(actionsData, null, 2));

        if (actionsData.length == 1) {
          var alarmSettings = actionsData[0];

          if (alarmSettings.all_day === false) {

            actionDao.actionDao.getAlarmPeriod (alarmSettings.period_id,

              function (periodData) {
  //                console.log(JSON.stringify(periodData, null, 2));
                alarmSettings.startPeriod = periodData[0].start;
                alarmSettings.endPeriod = periodData[0].end;
                alarmSettings.active =
                     utilTime.checkActive(alarmSettings.startPeriod,
                                          alarmSettings.endPeriod);

                OnSuccessCallback(alarmSettings);
            });
          } else {
            alarmSettings.startPeriod = "";
            alarmSettings.endPeriod = "";
            alarmSettings.active = true;

            OnSuccessCallback(alarmSettings);
          }
        } else {

          OnSuccessCallback(actionsData);
        }
    });

  },  //  getLastAction


  insertAction : function (actionData) {

    var actionDao = require('../dao/sqliteActionDao');
    if (global.config.site.database === 'mysql') {
      actionDao = require('../dao/mysqlActionDao');
    }

    actionDao.actionDao.createAction (actionData,

      function (status) {
        // console.log(status);
//        OnSuccessCallback(status);
    },function (status) {
        // console.log(status);
//        OnErrorCallback(status);
    });


  },  //  insertAction


  getActionTypeById : function (action, OnSuccessCallback) {

    var actionDao = require('../dao/sqliteActionTypeDao');
    if (global.config.site.database === 'mysql') {
      actionDao = require('../dao/mysqlActionTypeDao');
    }

    console.log(action);
    actionDao.actionTypeDao.getActionTypeByTag (action,

      function (data) {
//          console.log(status);
        OnSuccessCallback(data);
    });

  }  //  getActionTypeById

};


module.exports = utilAction;
