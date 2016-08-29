

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

        console.log('Pin 12(A) = %d', rpio.read(12));

        /* Configure P12 as output with the initiate state set high */
        rpio.open(12, rpio.OUTPUT, rpio.HIGH);

        console.log('Pin 12(B) = %d', rpio.read(12));

        setTimeout(function() {
          rpio.close(12);
        }, 60000);
      }
    });
  },


  createEvent : function (eventData, OnSuccessCallback, OnErrorCallback) {

    pi3GPIO.insertEvent (eventData,
        function (status) {
          // console.log(status);
          OnSuccessCallback(status);

          pi3GPIO.processEvent (eventData);
          pi3GPIO.getSensorData(38 ,
            function (sensorId) {
              console.log(sensorId);
          },function (sensorId) {
              console.error(sensorId);
          });
      },function (status) {
          // console.log(status);
          OnErrorCallback(status);
      });


  }, // createEvent

  getSensorData : function (pinBOARD, OnSuccessCallback, OnErrorCallback) {

    var pinDao = require('../dao/sqlitePinDao');
    if (global.config.site.database === 'mysql') {
      pinDao = require('../dao/mysqlPinDao');
    }

    pinDao.pinDao.getPinByBOARD (pinBOARD,
      function (sensorData) {
        console.log(sensorData);
        console.log(sensorData[0]);
        if (sensorData[0].sensor_id > 0 &&
            sensorData[0].input == true) {
              console.log(sensorData);
          OnSuccessCallback({sensorId : sensorData[0].sensor_id});
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

        pi3GPIO.getSensorData(pin ,
          function (sensorId) {
            console.log(sensorId);

            var d = new Date();
            d.setMinutes(d.getMinutes() + d.getTimezoneOffset());

            var stamp = d.getFullYear() + "-" +
                ("0" + (d.getMonth()+1)).slice(-2) + "-" +
                ("0" +  d.getDate()).slice(-2) + " " +
                ("0" +  d.getHours()).slice(-2) + ":" +
                ("0" +  d.getMinutes()).slice(-2) + ":" +
                ("0" +  d.getSeconds()).slice(-2);

            var eventData = {

              eventSensorId : sensorId.sensorId,
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

      if (pinData.direction == 'input') {
        /* Configure PXX as input with the internal pulldown resistor enabled */
        rpio.open(pinData.pinId, rpio.INPUT);
        rpio.pud(pinData.pinId, rpio.PULL_DOWN);

        rpio.poll(pinData.pinId, pi3GPIO.listenPin, rpio.POLL_HIGH);
      }

      if (pinData.direction == 'null') {
        /* No need to read pin more than once. */
        rpio.poll(pinData.pinId, null);
      }

      if (pinData.direction == 'output') {

      }
    }

  }, // setPinData

}

module.exports.pi3GPIO = pi3GPIO;
