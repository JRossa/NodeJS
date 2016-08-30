var pi3GPIO = {

  insertEvent : function  (eventData, OnSuccessCallback, OnErrorCallback) {

    var eventDao = require('../dao/sqliteEventDao');
    if (global.config.site.database === 'mysql') {
      eventDao = require('../dao/mysqlEventDao');
    }

    eventDao.eventDao.createEvent (eventData,

      function (status) {
        // console.log(status);
        OnSuccessCallback(status);
    },function (status) {
        // console.log(status);
        OnErrorCallback(status);
    });

  },


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


  setOutputAlarm : function (rpio, pin, alarmDuration) {

    console.log('Pin ' + pin + '(A) = %d', rpio.read(pin));

    /* Configure P12 as output with the initiate state set high */
    rpio.open(pin, rpio.OUTPUT, rpio.HIGH);

    console.log('Pin ' + pin + '(B) = %d', rpio.read(pin));

    setTimeout(function() {
      rpio.close(pin);
    }, alarmDuration);

  },


  processEvent : function (eventData) {

    var eventDao = require('../dao/sqliteEventDao');
    if (global.config.site.database === 'mysql') {
      eventDao = require('../dao/mysqlEventDao');
    }

    // interval in seconds
    var intervalTime = (360 * 1000);

    eventDao.eventDao.checkEvent (eventData.eventSensorId,
                                  intervalTime,

      function (nEvents) {
        // console.log(status);
        var NEvents = [];
        NEvents = nEvents;

        console.log("N Events  " + NEvents[0].numEvents);

        console.log('pi3GPIO - ' + process.env.ENV_OS);

        // TODO - arm the alarm
        if (process.env.ENV_OS === 'rpio') {
          var rpio = require('rpio');

          var options = {
            gpiomem: true,          /* Use /dev/gpiomem */
            mapping: 'physical',    /* Use the P1-P40 numbering scheme */
          }

          console.log("------ RPIO --------- OK ");

          rpio.init(options);

          if (NEvents > 3) {
            pi3GPIO.getAlarmPin(
              function (alarmPin) {
                console.log(alarmPin);
                pi3GPIO.setOutputAlarm(rpio, alarmPin.pin, alarmPin.duration);
            },function (alarmPin) {
                console.error(alarmPin);
            });
          } else {

            if (eventData.eventWarn == true) {
              pi3GPIO.getWarnPin(
                function (alarmPin) {
                  console.log(alarmPin);
                  pi3GPIO.setOutputAlarm(rpio, alarmPin.pin, alarmPin.duration);
              },function (alarmPin) {
                  console.error(alarmPin);
              });
            } // if (eventData.eventWarn == true)

          } // else


        }  //  if (process.env.ENV_OS === 'rpio')
    });    //  function (nEvents)
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


  listenPin : function (pin) {

//    function pin_button(pin)
//    {
//      console.log('Nuke button on pin %d pressed', pin);

    var eventDao = require('../dao/sqliteEventDao');
    if (global.config.site.database === 'mysql') {
      eventDao = require('../dao/mysqlEventDao');
    }

    if (process.env.ENV_OS === 'rpio') {
      var rpio = require('rpio');

      /* Watch pin forever. */
//      console.log('Button event on pin %d, is now %d', pin, rpio.read(pin));
      if (rpio.read(pin) == 1) {

        pi3GPIO.getSensorData (pin,
          function (sensorData) {
            console.log(sensorData);

            var d = new Date();
            d.setMinutes(d.getMinutes() + d.getTimezoneOffset());

            var stamp = d.getFullYear() + "-" +
                ("0" + (d.getMonth()+1)).slice(-2) + "-" +
                ("0" +  d.getDate()).slice(-2) + " " +
                ("0" +  d.getHours()).slice(-2) + ":" +
                ("0" +  d.getMinutes()).slice(-2) + ":" +
                ("0" +  d.getSeconds()).slice(-2);

            var eventData = {

              eventSensorId : sensorData.sensorId,
              eventWarn :  sensorData.sensorWarn,
              eventTime : stamp
            };

            console.log('INSERT : ' + eventData);

            pi3GPIO.insertEvent (eventData,
              function (data) {
              console.log(data);

              pi3GPIO.processEvent (eventData);

            }, function (data) {
              console.error(data);
            });

        },function (sensorId) {
            console.error(sensorId);
        });
      }
    }

      /* No need to read pin more than once. */
//    rpio.poll(pin, null);
  },


  setPinData : function (pinData) {

    console.log('pi3GPIO - ' + process.env.ENV_OS);
    console.log(pinData);

    if (process.env.ENV_OS === 'rpio') {
      var rpio = require('rpio');

      var options = {
        gpiomem: true,          /* Use /dev/gpiomem */
        mapping: 'physical',    /* Use the P1-P40 numbering scheme */
      }

      console.log("------ RPIO --------- OK ");

      rpio.init(options);

      if (pinData.pinDirection == 'input') {
        /* Configure PXX as input with the internal pulldown resistor enabled */
        rpio.open(pinData.pinBOARD, rpio.INPUT);
        rpio.pud(pinData.pinBOARD, rpio.PULL_DOWN);

        rpio.poll(pinData.pinBOARD, pi3GPIO.listenPin, rpio.POLL_HIGH);
      }

      if (pinData.pinDirection == 'null') {
        /* No need to read pin more than once. */
        rpio.poll(pinData.pinBOARD, null);
      }

      if (pinData.pinDirection == 'output') {
         // Do nothing - wil be set by processEvent
      }
    }

  }, // setPinData


  createEvent : function (eventData, OnSuccessCallback, OnErrorCallback) {

    console.log("createEvent function");
    console.log(eventData);


    pi3GPIO.insertEvent (eventData,
        function (status) {
          console.log(status);
          OnSuccessCallback(status);

          pi3GPIO.processEvent (eventData);


        },function (status) {
            // console.log(status);
            OnErrorCallback(status);
        });


  } // createEvent


}

module.exports.pi3GPIO = pi3GPIO;
