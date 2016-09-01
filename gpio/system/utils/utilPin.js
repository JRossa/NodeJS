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

  var self  = this;

  var pi3GPIO = require('../pi3GPIO/pi3GPIO');
  var utilAction = require('./utilAction');

  utilAction.getActionTypeById(action,
     function (actionLst) {
        console.log(actionLst);
        console.log(actionLst.length);

        if (actionLst.length > 0 ) {
          utilAction.getLastAction (
            function (lastAction) {
              console.log(actionLst[0].id);
              console.log(lastAction);

              lastAction.typeId = actionLst[0].id;
              lastAction.allDay = lastAction.all_day;
              lastAction.periodId = lastAction.period_id;

              switch (action) {
                case "ALARM_SWITCH":
                  lastAction.periodId = null;
                case "ALARM_ON":
                  lastAction.armed = true;

                case "ALARM_OFF":
                  lastAction.armed = false;

                default:
              }

              utilAction.insertAction(lastAction);
          });
        } else {
          if (action == "PIN_SWITCH") {
            utilAction.getLastAction (
              function (lastAction) {
                console.log(lastAction);

                if (lastAction.armed) {
                  self.lastAction("ALARM_OFF");

                  var pinData = {
                    pinBOARD: process.env.PIN_SWITCH,
                    pinDirection : 'null',
                  };

                  pi3GPIO.pi3GPIO.setPinData(pinData);

                } else {
                  self.lastAction("ALARM_ON");
                }

            });
          }
        }   // else
     });

  },  // updateAction


  setPinSwitch : function () {
    var self = this;

    self.lastAction("PIN_SWITCH");

  },  // setPinSwitch


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
