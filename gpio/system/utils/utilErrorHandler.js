/*jslint node: true */
/*jshint strict:false */
'use strict';

var utilErrorHandler = {


   errorHandler : function (errorMsg1, errorMsg2, errorMsg3) {

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

      console.error(' ------- ------- ------- ------- Callback  -------> :  ');
      console.error(error);
    }

    return error;
   }

  };


  module.exports = utilErrorHandler;
