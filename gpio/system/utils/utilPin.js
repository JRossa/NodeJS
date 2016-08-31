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

  },


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

  },


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

  },


  getAllOutputPin : function (OnSuccessCallback) {

    var pinDao = require('../dao/sqlitePinDao');
    if (global.config.site.database === 'mysql') {
      pinDao = require('../dao/mysqlPinDao');
    }

    pinDao.pinDao.getAllOutputPin (
      function (pinData) {
//        console.log(pinData);
        OnSuccessCallback(pinData);
    });

  }

}


module.exports = utilPin;
