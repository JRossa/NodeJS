

var pi3GPIO = {

  createEvent : function (eventData, OnSuccessCallback, OnErrorCallback) {

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

  }, // createEvent



  setPinData : function (pinData) {

    function pin_button(pin)
    {
      console.log('Nuke button on pin %d pressed', pin);

      var eventDao = require('../dao/sqliteEventDao');
      if (global.config.site.database === 'mysql') {
        eventDao = require('../dao/mysqlEventDao');
      }

      /* Watch pin forever. */
      console.log('Button event on pin %d, is now %d', pin, rpio.read(pin));

      /* No need to read pin more than once. */
//    rpio.poll(pin, null);
    };


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
        rpio.pud(pinData.pinId, rpio.PULL_UP);
        
        rpio.poll(pinData.pinId, pin_button, rpio.POLL_HIGH);
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
