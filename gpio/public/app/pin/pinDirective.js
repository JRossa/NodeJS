angular.module("pinModule")
       .directive("toggleCheckbox", toggleCheckbox);

toggleCheckbox.$inject = ['$scope', '$timeout'];


function toggleCheckbox(scope, timeout) {

  return {
    require: '?ngModel',
		restrict: 'A',
		link: function(scope, element, attrs, ngModel){

    }
  }
}
