'use strict';

/**
 * Bootstrap-toggle Directive
 * @link https://github.com/minhur/bootstrap-toggle
 *
 */

 /*
  toggle - checkbox directive
  https://jsfiddle.net/az3rq4na/
  https://gist.github.com/dave-newson/f6c5e9c2f3bc315e292c
  http://indrimuska.github.io/angular-switcher/

  http://weblogs.asp.net/dwahlin/creating-custom-angularjs-directives-part-3-isolate-scope-and-function-parameters
 */

angular.module("pinModule")
       .directive("checkboxToggle", checkboxToggle)
			 .directive('timepicker', timepicker);

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
			}

      var dateNow = new Date();

			element.datetimepicker({
				language: langKey,
				pickDate: false,
				pickSeconds: false,
        useSeconds: true,
        useCurrent: false,
        defaultDate: moment(dateNow).hours(0).minutes(0).seconds(0).milliseconds(0),
				pick12HourFormat: false,
				use24hours: true,
				pickTime: true,
				format: 'HH:mm:ss'
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
