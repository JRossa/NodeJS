'use strict';


angular.module('eventModule')
       .directive('timepicker', timepicker)
			 .directive('datetimepicker', datetimepicker);

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
			}

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
	}
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
				format: 'DD/MM/YYYY HH:mm'
			});

			if(!ngModel) return; // do nothing if no ng-model

			ngModel.$render = function(){
				element.find('input').val( ngModel.$viewValue || '' );
			}


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
	}
}
