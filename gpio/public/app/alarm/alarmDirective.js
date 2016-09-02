/*jslint node: true */
/*jshint strict: false */
/*jslint jquery: true*/
/*global angular: false */
/*global moment: false */
'use strict';


angular.module('alarmModule')
       .directive("checkboxToggle", checkboxToggle)
       .directive('timepicker', timepicker)
			 .directive('datetimepicker', datetimepicker);


 checkboxToggle.$inject = [];

 function checkboxToggle() {
   /**
    * Directive
    */
   return {
     restrict: 'A',
     transclude: true,
     replace: false,
     require: 'ngModel',
     link: function ($scope, $element, $attr, require) {

       var ngModel = require;

       // update model from Element
       var updateModelFromElement = function() {
           // If modified
           var checked = $element.prop('checked');
           if (checked != ngModel.$viewValue) {
               // Update ngModel
               ngModel.$setViewValue(checked);
               $scope.$apply();
           }
       };

       // Update input from Model
       var updateElementFromModel = function() {
           // Update button state to match model
           $element.trigger('change');
       };

       // Observe: Element changes affect Model
       $element.on('change', function() {
           updateModelFromElement();
       });

       // Observe: ngModel for changes
       $scope.$watch(function() {
           return ngModel.$viewValue;
       }, function() {
           updateElementFromModel();
       });

       // Initialise BootstrapToggle
       $element.bootstrapToggle();
     }
   };
 }


timepicker.$inject = ['$window'];

function timepicker ($window) {
	return {
		require: '?ngModel',
		restrict: 'A',
		link: function(scope, element, attrs, ngModel){

      var langKey = $window.localStorage.getItem('langKey');

			if(!ngModel) return; // do nothing if no ng-model


			ngModel.$render = function(){
				element.find('input').val( ngModel.$viewValue || '' );
			};

			element.datetimepicker({
				language: langKey,
				pickDate: false,
				pickSeconds: false,
				pick12HourFormat: false,
				use24hours: true,
				pickTime: true,
				format: 'HH:mm'
			});

			element.on('dp.change', function(){
				scope.$apply(read);
			});

			read();

			function read() {
				var value = element.find('input').val();
//				console.log(value);
				ngModel.$setViewValue(value);
			}
		}
	};

}


datetimepicker.$inject = ['$window'];

function datetimepicker ($window) {
	return {
		require: '?ngModel',
		restrict: 'A',
		link: function(scope, element, attrs, ngModel){

      var langKey = $window.localStorage.getItem('langKey');

      element.datetimepicker({
				language: langKey,
				format: 'DD-MM-YYYY HH:mm:00'
			});

			if(!ngModel) return; // do nothing if no ng-model

			ngModel.$render = function(){
				element.find('input').val( ngModel.$viewValue || '' );
			};


			element.on('dp.change', function(){
				scope.$apply(read);
			});

			read();

			function read() {
				var value = element.find('input').val();
//				console.log(value);
				ngModel.$setViewValue(value);
			}
		}
	};
  
}
