/*jslint node: true */
/*jshint strict:false */
'use strict';

var utilTime = require('../utils/utilTime');
var utilPin = require('../utils/utilPin');
var utilEvent = require('../utils/utilEvent');
var utilAction = require('../utils/utilAction');


var pi3GPIO = {


  setOutputAlarm : function (rpio, pin, alarmDuration) {

    console.log('Pin ' + pin + '(A) = %d', rpio.read(pin));
    console.log('Alarm Duration : ' + alarmDuration);

    var duration = utilTime.timeToMiliseconds(alarmDuration);
    console.log('Alarm Duration : ' + duration);

    /* Configure P12 as output with the initiate state set high */
    rpio.open(pin, rpio.OUTPUT, rpio.HIGH);

    console.log('Pin ' + pin + '(B) = %d', rpio.read(pin));

    setTimeout(function() {
      rpio.close(pin);
    }, duration);

  },


  processEvent : function (eventData) {

    var self = this;

    var searchSeconds = process.env.SEARCH_SECONDS;
    var maxAlarmEvents = process.env.MAX_EVENTS;

    // interval in seconds
    var intervalTime = (searchSeconds * 1000);

    utilEvent.countEvent (eventData.eventSensorId,
                                  intervalTime,

      function (nEvents) {
        // console.log(status);
        var NEvents = nEvents[0].numEvents;

        console.log("N Events  " + NEvents);

        console.log('pi3GPIO - ' + process.env.ENV_OS);

        if (process.env.ENV_OS === 'rpi') {
          var rpio = require('rpio');

          var options = {
            gpiomem: true,          /* Use /dev/gpiomem */
            mapping: 'physical',    /* Use the P1-P40 numbering scheme */
          };

          console.log("------ RPIO processEvent --------- OK  " + (NEvents > maxAlarmEvents));


          rpio.init(options);

          if (NEvents > maxAlarmEvents) {

            utilAction.getLastAction(
                function (alarmSettings) {

              // Check if alarm is ON or OFF
              if (alarmSettings.armed &&
                     alarmSettings.active) {

                utilPin.getAlarmPin(
                  function (alarmPin) {
                    console.log(alarmPin);
                    self.setOutputAlarm(rpio, alarmPin.pin, alarmPin.duration);
                },function (alarmPin) {
                    console.error(alarmPin);
                });  //  getAlarmPin
              }      //  if (alarmSettings.armed ...
            });      //  getLastAction
          } else {

            if (eventData.eventWarn === true) {
              utilPin.getWarnPin(
                function (alarmPin) {
                  console.log(alarmPin);
                  self.setOutputAlarm(rpio, alarmPin.pin, alarmPin.duration);
              },function (alarmPin) {
                  console.error(alarmPin);
              }); //  getWarnPin
            }     //  if (eventData.eventWarn == true)
          }       //  else (eventData.eventWarn == true)
        }         //  if (process.env.ENV_OS === 'rpi')
    });           //  function (nEvents)

  },


  listenPin : function (pin) {

    var self = this;
//    function pin_button(pin)
//    {
//      console.log('Nuke button on pin %d pressed', pin);

    if (process.env.ENV_OS === 'rpi') {
      /* Watch pin forever. */
//      console.log('Button event on pin %d, is now %d', pin, rpio.read(pin));
      var rpio = require('rpio');

      if (rpio.read(pin) == 1) {

        // Ckeck for PIN_SWITCH
        if (pin == process.env.PIN_SWITCH) {
          utilPin.setPinSwitch();
        } else {

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

                self.processEvent (eventData);

              }, function (data) {
                console.error(data);
              });

          },function (sensorData) {
              console.error(sensorData.sensorId);
          }); //  getSensorData
        }   //  if (pin == process.env.PIN_SWITCH)
      }     //  if (rpio.read(pin) == 1)
    }

      /* No need to read pin more than once. */
//    rpio.poll(pin, null);
  },


  setPinData : function (pinData) {

    var self = this;

    console.log('pi3GPIO - ' + process.env.ENV_OS);
    console.log(pinData);

    if (process.env.ENV_OS === 'rpi') {
      var rpio = require('rpio');

      var options = {
        gpiomem: true,          /* Use /dev/gpiomem */
        mapping: 'physical',    /* Use the P1-P40 numbering scheme */
      };

      console.log("------ RPIO setPinData --------- OK ");

      rpio.init(options);
      console.log("------ RPIO setPinData 1 --------- OK ");

      if (pinData.pinDirection == 'input') {
        /* Configure PXX as input with the internal pulldown resistor enabled */
        rpio.open(pinData.pinBOARD, rpio.INPUT);
        rpio.pud(pinData.pinBOARD, rpio.PULL_DOWN);
        console.log("------ RPIO setPinData 2 --------- OK ");

        rpio.poll(pinData.pinBOARD, self.listenPin, rpio.POLL_HIGH);
      }

      console.log("------ RPIO setPinData 3 --------- OK ");
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

    var self = this;

    eventData.eventTime = new Date(eventData.eventTime);

    utilEvent.insertEvent (eventData,
        function (status) {
          console.log(status);
          OnSuccessCallback(status);

          self.processEvent (eventData);

//          utilPin.lastAction("ALARM_CONFIG");
//          console.log(utilTime.checkActive("22:00", "22:30"));
           utilPin.setPinSwitch();

        },function (status) {
            // console.log(status);
            OnErrorCallback(status);
        });
  } // createEvent

};


module.exports.pi3GPIO = pi3GPIO;
