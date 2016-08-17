angular.module("pinModule")
       .directive("editPinDirective", editPinDirective);

editPinDirective.$inject = ['$window', '$scope', '$timeout'];


function editPinDirective(window, scope, timeout) {

  return {
    restrict : 'E',


    link : function (scope, el, attrs) {


    } // link

  }; // return
}
