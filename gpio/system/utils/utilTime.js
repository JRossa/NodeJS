/*jslint node: true */
/*jshint strict:false */
'use strict';

var utilTime = {

  timeToMiliseconds : function (time) {

    if (time === null) {
      return null;
    }

    var a = time.split(':'); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2] || 0);
    console.log(seconds);
    return seconds * 1000;
  },  // timeToMiliseconds


  checkActive : function (startTime, endTime) {

    var self = this;
    var active = false;
    var swap = false;

    var serverTime = self.getServerHours();

    var startHour = self.hoursToMinutes(startTime);
    var endHour = self.hoursToMinutes(endTime);
    var serverHour = self.hoursToMinutes(serverTime);

    console.log(startHour);
    console.log(serverHour);
    console.log(endHour);

    var diffHours = endHour - startHour;

    if (diffHours === 0) {
      active = endHour ==  serverHour;
      return active;
    }

    if (diffHours < 0 ) {
      // swap Hours
      var tmpHour = endHour;
      endHour = startHour;
      startHour = tmpHour;
      swap = true;
    }

    if (endHour >= serverHour &&
          startHour <= serverHour) {
      active = true;
    }

    active = swap ? !active: active;

    return active;
  },  // checkActive


  getServerHours : function () {

    var d = new Date();
//    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());
    d.setMinutes(d.getMinutes());

    var stamp = ("0" +  d.getHours()).slice(-2) + ":" +
                ("0" +  d.getMinutes()).slice(-2);
    console.log(stamp);
    return stamp;
  }, // getServerHours


  hoursToMinutes : function (hours) {

    if (hours === null) {
      return null;
    }

    var a = hours.split(':'); // split it at the colons

    // minutes are worth 60 seconds. Hours are worth 60 minutes.
    var minutes = (+a[0]) * 60 + (+a[1]);
//    console.log(minutes);
    return minutes;
  },  // hoursToMinutes


  convertTime : function (d, option) {

    if (option) {
      if (process.env.DB_ENGINE === 'mysql') {
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      }

      // Complete date plus hours, minutes, seconds
      // and a decimal fraction of a second
      return d.toJSON();
    } else {

      var stamp = d.getFullYear() + "-" +
          ("0" + (d.getMonth()+1)).slice(-2) + "-" +
          ("0" +  d.getDate()).slice(-2) + " " +
          ("0" +  d.getHours()).slice(-2) + ":" +
          ("0" +  d.getMinutes()).slice(-2) + ":" +
          ("0" +  d.getSeconds()).slice(-2);

      // pretty readable format - “1995-02-04 22:45:00”
      return stamp;
    }
  },  // convertTime


  getServerTime : function (option) {

    var d = new Date();
    // because of the search for last n pin events
    d.setMinutes(d.getMinutes() + d.getTimezoneOffset());

    if (option) {

      // Complete date plus hours, minutes, seconds
      // and a decimal fraction of a second
      return d.toJSON();
    } else {

      var stamp = d.getFullYear() + "-" +
          ("0" + (d.getMonth()+1)).slice(-2) + "-" +
          ("0" +  d.getDate()).slice(-2) + " " +
          ("0" +  d.getHours()).slice(-2) + ":" +
          ("0" +  d.getMinutes()).slice(-2) + ":" +
          ("0" +  d.getSeconds()).slice(-2);

      // pretty readable format - “1995-02-04 22:45:00”
      return stamp;
    }
  }  // getServerTime

};

module.exports = utilTime;
