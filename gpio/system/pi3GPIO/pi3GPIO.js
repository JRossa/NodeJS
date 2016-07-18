

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

        // TODO - arm the alarm
        if (global.config.site.database === 'rpio') {
          var rpio = require('rpio');

          var options = {
            gpiomem: true,          /* Use /dev/gpiomem */
            mapping: 'physical',    /* Use the P1-P40 numbering scheme */
          }
          rpio.init(options);

          /* Configure P12 as output with the initiate state set high */
          rpio.open(12, rpio.OUTPUT, rpio.HIGH);
          
          setTimeout(function() {
            rpio.close(12);
          }, 60000);
        }
    });

  }, // createEvent

}

module.exports.pi3GPIO = pi3GPIO;
