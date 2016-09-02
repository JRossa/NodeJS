/*jslint node: true */
/*jshint strict:false */
'use strict';

var utilEvent = {

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


  countEvent : function (sensorId, intervalTime, OnSuccessCallback) {

    var eventDao = require('../dao/sqliteEventDao');
    if (global.config.site.database === 'mysql') {
      eventDao = require('../dao/mysqlEventDao');
    }

    eventDao.eventDao.checkEvent (sensorId, intervalTime,

      function (nEvents) {
        OnSuccessCallback(nEvents);
      });
  }

};


module.exports = utilEvent;
