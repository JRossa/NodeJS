/*jslint node: true */
/*jshint strict:false */
'use strict';
var utilEMail = require('./utilEMail');


var utilErrorHandler = {


   errorHandler : function (errorMsg1) {

    var error = {};
    var errorLst = [];

    if (typeof errorMsg1 !== 'undefined') {

      console.error(' ------- ------- ------- ------- errorHandler  -------> : ');
      console.error(errorMsg1);

      var err = errorMsg1;

      var myError = new Error();
      myError.name = 'createSensor';
      myError.errstk =  err.stack;
      myError.message = 'Sensor already exists !!!';
//                    console.log(myError);
      process.emit('warning', myError);
//                    console.log(errorl.stack);
      if (typeof err.errorLst !== 'undefined') {
        errorLst = err.errorLst;
      }

      var error = {
              query  : errorLst,
              err    : err,
              errstk : myError,
              error  : "Sensor already exists !!!"
      };

      if (process.env.ENV_OS !== 'rpi') {
        console.log(process.env.COMPUTERNAME);
        utilEMail.sendEMail('FROM : ' + process.env.COMPUTERNAME + '\n' +
                          JSON.stringify(error, null, 2));
      } else {
        console.log(process.env.$HOSTNAME);
        utilEMail.sendEMail('FROM : ' + process.env.$HOSTNAME + '\n' +
                          JSON.stringify(error, null, 2));
      }

      console.error(' ------- ------- ------- ------- Callback  -------> :  ');
      console.error(error);
    }

    return error;
   }

  };


  module.exports = utilErrorHandler;
