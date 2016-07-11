

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

        // TODO - arm the alarm
        console.log("N Events  " + NEvents[0].numEvents);
    });

  }, // createEvent

}

module.exports.pi3GPIO = pi3GPIO;
