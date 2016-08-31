var utilTime = require('../utils/utilTime');
var utilPin = require('../utils/utilPin');
var utilEvent = require('../utils/utilEvent');

'use strict'

var pi3GPIO = {


  setOutputAlarm : function (rpio, pin, alarmDuration) {

    // TODO : check if alarm is armed
    console.log('Pin ' + pin + '(A) = %d', rpio.read(pin));
    console.log('Alarm Duration : ' + alarmDuration);

    duration = utilTime.timeToMiliseconds(alarmDuration);
    console.log('Alarm Duration : ' + duration);

    /* Configure P12 as output with the initiate state set high */
    rpio.open(pin, rpio.OUTPUT, rpio.HIGH);

    console.log('Pin ' + pin + '(B) = %d', rpio.read(pin));

    setTimeout(function() {
      rpio.close(pin);
    }, duration);

  },


  processEvent : function (eventData) {

    var searchTimeMinutes = 3;
    var maxAlarmEvents = 4;

    // interval in seconds
    var intervalTime = (searchTimeMinutes * 60 * 1000);

    utilEvent.countEvent (eventData.eventSensorId,
                                  intervalTime,

      function (nEvents) {
        // console.log(status);
        var NEvents = nEvents[0].numEvents;

        console.log("N Events  " + NEvents);

        console.log('pi3GPIO - ' + process.env.ENV_OS);

        // TODO - arm the alarm
        if (process.env.ENV_OS === 'rpio') {
          var rpio = require('rpio');

          var options = {
            gpiomem: true,          /* Use /dev/gpiomem */
            mapping: 'physical',    /* Use the P1-P40 numbering scheme */
          }

          console.log("------ RPIO --------- OK  " + (NEvents > maxAlarmEvents));

          rpio.init(options);

          if (NEvents > maxAlarmEvents) {
            utilPin.getAlarmPin(
              function (alarmPin) {
                console.log(alarmPin);
                pi3GPIO.setOutputAlarm(rpio, alarmPin.pin, alarmPin.duration);
            },function (alarmPin) {
                console.error(alarmPin);
            });
          } else {

            if (eventData.eventWarn == true) {
              utilPin.getWarnPin(
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


  listenPin : function (pin) {

//    function pin_button(pin)
//    {
//      console.log('Nuke button on pin %d pressed', pin);

    if (process.env.ENV_OS === 'rpio') {
      var rpio = require('rpio');

      /* Watch pin forever. */
//      console.log('Button event on pin %d, is now %d', pin, rpio.read(pin));
      if (rpio.read(pin) == 1) {

        utilPin.getSensorData (pin,
          function (sensorData) {
            console.log(sensorData);

            var stamp = utilTime.getServerTime(true);

            var eventData = {

              eventSensorId : sensorData.sensorId,
              eventWarn :  sensorData.sensorWarn,
              eventTime : stamp
            };

            console.log('INSERT : ' + eventData);

            utilEvent.insertEvent (eventData,
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

    utilEvent.insertEvent (eventData,
        function (status) {
          console.log(status);
          OnSuccessCallback(status);

          pi3GPIO.processEvent (eventData);

          console.log(utilTime.getServerTime(true));

        },function (status) {
            // console.log(status);
            OnErrorCallback(status);
        });
  } // createEvent

}


module.exports.pi3GPIO = pi3GPIO;
