'use strict'

var utilPin = {


  getAlarmPin : function (OnSuccessCallback, OnErrorCallback) {

    var pinDao = require('../dao/sqlitePinDao');
    if (global.config.site.database === 'mysql') {
      pinDao = require('../dao/mysqlPinDao');
    }

    pinDao.pinDao.getOutputPin (false,
      function (alarmData) {
//        console.log(alarmData);
//        console.log(alarmData[0]);

        if (alarmData.length > 0 &&
              alarmData[0].board > 0 &&
                alarmData[0].input == false) {
          OnSuccessCallback({pin : alarmData[0].board,
                             duration: alarmData[0].alarm_duration});
        } else {
          OnErrorCallback({pin : null});
        }
    });

  },  // getAlarmPin


  getWarnPin : function (OnSuccessCallback, OnErrorCallback) {

    var pinDao = require('../dao/sqlitePinDao');
    if (global.config.site.database === 'mysql') {
      pinDao = require('../dao/mysqlPinDao');
    }

    pinDao.pinDao.getOutputPin (true,
      function (alarmData) {
//        console.log(alarmData);
//        console.log(alarmData[0]);

        if (alarmData.length > 0 &&
              alarmData[0].board > 0 &&
                alarmData[0].input == false) {
          OnSuccessCallback({pin : alarmData[0].board,
                             duration: alarmData[0].alarm_duration});
        } else {
          OnErrorCallback({pin : null});
        }
    });

  },  // getWarnPin


  getSensorData : function (pinBOARD, OnSuccessCallback, OnErrorCallback) {

    var pinDao = require('../dao/sqlitePinDao');
    if (global.config.site.database === 'mysql') {
      pinDao = require('../dao/mysqlPinDao');
    }

    pinDao.pinDao.getPinByBOARD (pinBOARD,
      function (sensorData) {
        console.log(sensorData);
        console.log(sensorData[0]);

        if (sensorData.length > 0 &&
              sensorData[0].sensor_id > 0 &&
                sensorData[0].input == true) {
          OnSuccessCallback({sensorId   : sensorData[0].sensor_id,
                             sensorWarn : sensorData[0].warn});
        } else {
          OnErrorCallback({sensorId : null});
        }
    });

  },  // getSensorData


  lastAction : function (action) {

  var utilAction = require('./utilAction');

  utilAction.getActionTypeById(action,
     function (action) {
        console.log(action);

        if (action.length > 0 ) {
          utilAction.getLastAction (
            function (lastAction) {
              console.log(action[0].id);
              console.log(lastAction);
              lastAction.typeId = action[0].id;
              lastAction.allDay = lastAction.all_day;
              lastAction.periodId = null;
              utilAction.insertAction(lastAction);
          });
        } // else TODO: action not found
     });

  },  // updateAction


  getAllInputPin : function (OnSuccessCallback) {

    var pinDao = require('../dao/sqlitePinDao');
    if (global.config.site.database === 'mysql') {
      pinDao = require('../dao/mysqlPinDao');
    }

    pinDao.pinDao.getAllInputPin (
      function (pinData) {
//        console.log(pinData);
        OnSuccessCallback(pinData);
    });

  }  // getAllInputPin

}


module.exports = utilPin;
