var loginRouteConfig = function (app) {

  this.app = app;

  this.routeTable = [];

  this.init();
}


actionRouteConfig.prototype.init = function () {

  var self = this;

//  self.dbCreateTable();

  self.addRoutes();
  self.processRoutes();
}


actionRouteConfig.prototype.processRoutes = function () {

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

}

actionRouteConfig.prototype.addRoutes = function () {

  var self = this;

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/login',
    callbackFunction : function(req, res) {

      // render the page and pass in any flash data if it exists
      res.render('index', {
        title: "label.menubar_appTitle",
        labels: global.lang,
         });

    }
  });
/*
  // process the login form
  // app.post('/login', do all our passport stuff here);

  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/signup',
    callbackFunction : function(req, res) {

      // render the page and pass in any flash data if it exists
      res.render('signup', {
            message: req.flash('signupMessage')
         });

    }
  });

  // process the signup form
  // app.post('/signup', do all our passport stuff here);

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
=/
/*
app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
        user : req.user // get the user out of session and pass to template
    });
});
*/
/*
  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/profile',
    callbackFunction : function(req, res) {

      // render the page and pass in any flash data if it exists
      res.render('profile', {
           user : req.user // get the user out of session and pass to template
         });

    }
  });

  self.routeTable.push ( {
    requestType : 'get',
    requestUrl : '/logout',
    callbackFunction : function(req, res) {

      req.logout();
      res.redirect('/');
    }
  });
*/
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

module.exports = loginRouteConfig;
