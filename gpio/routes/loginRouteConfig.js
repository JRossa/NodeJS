/*jslint node: true */
/*jshint strict:false */
'use strict';

var loginRouteConfig = function (app) {

  this.app = app;

  this.routeTable = [];

  this.init();
};


loginRouteConfig.prototype.init = function () {

  var self = this;

  self.addRoutes();
  self.processRoutes();
};


loginRouteConfig.prototype.processRoutes = function () {

  var self = this;

  self.routeTable.forEach(function (route) {

      if (route.requestType == 'get') {

//          console.log(route);
          self.app.get(route.requestUrl, route.callbackFunction);
      } else if (route.requestType == 'post') {

//          console.log(route);
          self.app.post(route.requestUrl, route.callbackFunction);
      } else if (route.requestType == 'delete') {

//          console.log(route);
          self.app.delete(route.requestUrl, route.callbackFunction);
      } else if (route.requestType == 'put') {

//          console.log(route);
          self.app.put(route.requestUrl, route.callbackFunction);
      }

  });

};


loginRouteConfig.prototype.addRoutes = function () {

  var self = this;

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/login',
    callbackFunction : function(req, res) {

    console.log('passou');
    // render the page and pass in any flash data if it exists
    res.render('login/login', {
      title: "label.menubar_appTitle",
      labels: global.lang,
     });

    }
  });
  
};


module.exports = loginRouteConfig;
