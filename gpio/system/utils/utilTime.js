'use strict'

var utilTime = {

    timeToMiliseconds : function (time) {

      if (time == null) {
        return null;
      }

      var a = time.split(':'); // split it at the colons

      // minutes are worth 60 seconds. Hours are worth 60 minutes.
      var seconds = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2] || 0);
      console.log(seconds);
      return seconds * 1000;
    },


    getServerTime : function (option) {

      var d = new Date();
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
    }

}

module.exports = utilTime;
