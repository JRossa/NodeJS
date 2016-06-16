angular.module("gpioModule")

// From http://briantford.com/blog/angular-socket-io
.factory('socketService', ['$rootScope', function ($rootScope) {
    'use strict';

    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                console.log("Connect to server : socketService");
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },

        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                console.log(eventName + "   " + data);

                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }

    };
}]);
