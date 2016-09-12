/*jslint node: true */
/*jshint strict: false */
/*jslint jquery: true*/
/*global angular: false */
/*global moment: false */
'use strict';

angular.module('userModule')
       .directive('match', match)
       .directive('tooltip', tooltip)
       .directive('timepicker', timepicker)
			 .directive('datetimepicker', datetimepicker);


tooltip.$inject = ["$parse", '$window'];

function tooltip ($parse, $window) {
/*
  return {
      restrict:'A',
      link: function(scope, element, attrs)
      {
          $(element)
              .attr('title',scope.$eval(attrs.tooltip))
              .tooltip({placement: "right"});
      }
  }
*/
  return {
    restrict: 'A',
    link: function(scope, element, attrs){
      if (attrs.toggle=="tooltip"){
        $(element).tooltip();
      }
      console.log(attrs.toggle);
      if (attrs.toggle=="popover"){
//        $(element).popover({placement: "left"});
        $(element).popover();
      }
    }
  }

}


match.$inject = ["$parse", '$window'];

function match ($parse, $window) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function(scope, elem, attrs, ctrl) {
            if(!ctrl || !attrs.match) {
                return;
            }

            var matchGetter = $parse(attrs.match);
            var caselessGetter = $parse(attrs.matchCaseless);
            var noMatchGetter = $parse(attrs.notMatch);
            var matchIgnoreEmptyGetter = $parse(attrs.matchIgnoreEmpty);

            scope.$watch(getMatchValue, function(){
                ctrl.$$parseAndValidate();
            });

            ctrl.$validators.match = function(modelValue, viewValue){
              var matcher = modelValue || viewValue;
              var match = getMatchValue();
              var notMatch = noMatchGetter(scope);
              var value;

              if (matchIgnoreEmptyGetter(scope) && !viewValue) {
                return true;
              }

              if(caselessGetter(scope)){
                value = angular.lowercase(matcher) === angular.lowercase(match);
              }else{
                value = matcher === match;
              }
              /*jslint bitwise: true */
              value ^= notMatch;
              /*jslint bitwise: false */
              return !!value;
            };

            function getMatchValue(){
                var match = matchGetter(scope);
                if(angular.isObject(match) && match.hasOwnProperty('$viewValue')){
                    match = match.$viewValue;
                }
                return match;
            }
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
        useSeconds: true,
				format: 'DD-MM-YYYY HH:mm:ss'
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
