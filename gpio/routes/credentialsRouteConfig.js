/*jslint node: true */
/*jshint strict:false */
'use strict';

var credentialsRouteConfig = function (app) {

  this.app = app;
  this.routeTable = [];

  this.init();
};


credentialsRouteConfig.prototype.init = function () {

  var self = this;

  self.addRoutes();
  self.processRoutes();

};


credentialsRouteConfig.prototype.processRoutes = function () {

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


credentialsRouteConfig.prototype.addRoutes = function () {

  var self = this;

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/getCredentials',
    callbackFunction : function(req, res) {

      var request = require('request');
      var utilEMail = require('../system/utils/utilEMail');

      utilEMail.readClientSecret(function (secrets) {

        console.log(secrets);

        var authUrl = utilEMail.generateAuthUrl(secrets, 1);

    //    console.log(authUrl);

        res.redirect(authUrl);
      });
    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/oauth2callback',
    callbackFunction : function(req, res) {

      var request = require('request');
      var utilEMail = require('../system/utils/utilEMail');
    //  console.log('----->  ' + req.query.code);
    //  console.log('----->  ' + code);

      utilEMail.readClientSecret(function (secrets) {

        console.log(secrets);

        utilEMail.processCode(code, secrets, 1);

        // let finish to write the token
        setTimeout(function(){
          res.redirect('/');
        }, 500);
      });
    }
//    res.end();
  });


};


module.exports = credentialsRouteConfig;
