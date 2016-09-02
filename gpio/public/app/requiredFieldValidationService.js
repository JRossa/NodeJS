/*jslint node: true */
/*jshint strict: false */
/*global angular: false */
'use strict';

angular.module("sensorTypeModule")
       .factory("requiredFieldValidationService", requiredFieldValidationService);


function requiredFieldValidationService () {

  function _getRequiredValidationMessage (requiredInfos) {

    var errorMessages = [];

    console.log('_getRequiredValidationMessage');
    console.log(requiredInfos.length);

    if (requiredInfos.length > 0 ) {

      angular.forEach (requiredInfos, function (requiredInfo) {

        if (requiredInfo.name !== 'undefined' &&
            (requiredInfo.name === null ||
             requiredInfo.name === '' ||
             requiredInfo.name.length === 0)) {
               console.log(requiredInfo.errorMessage);
               errorMessages.push(requiredInfo.errorMessage);
             }
      });
    }
    return errorMessages;

  }

  return {

    getRequiredFieldValidationErrorMessage : _getRequiredValidationMessage
  };


}
