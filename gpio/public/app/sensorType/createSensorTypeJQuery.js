/*jslint node: true */
/*jslint browser: true*/
/*jslint jquery: true*/
/*global angular: false */
/*global menuDropDown: false */
/*jshint strict:false */
'use strict';


$(document).ready( function() {
    $(':file').on('change', function(event, numFiles, label) {
      var fileName = $(":file").filestyle('pushNameFiles')[0].name;

      console.log(fileName);
      angular.element("#sensorImage").scope().setSensorFileName(fileName);
      document.getElementById('sensorImage').click();

    });


    $('#selectLang').change( function() {

//      console.log(angular.element("#sensorImage").scope().showLang.show_PT);
//      if (angular.element("#sensorImage").scope().showLang.show_PT) {
//        $('#divSensorModel').removeClass('col-md-8 col-lg-8');
//        $('#divSensorModel').addClass('col-md-10 col-lg-10');
//      }

//      if (angular.element("#sensorImage").scope().showLang.show_EN) {
//       $('#divSensorModel').removeClass('col-md-10 col-lg-10');
//        $('#divSensorModel').addClass('col-md-8 col-lg-8');
//      }
    });

});
