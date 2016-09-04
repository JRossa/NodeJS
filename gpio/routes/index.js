var express = require('express');
var router = express.Router();


function loadSettings (req, res) {

  var utilAction = require('../system/utils/utilAction');

  utilAction.getLastAction(
    function (alarmSettings) {
      console.log(alarmSettings);

      res.render('index', {
        title: "label.menubar_appTitle",
        labels: global.lang,
        alarmSettings : alarmSettings
       });
    }
  );
}


/* GET home page. */
router.get('/', function(req, res, next) {

  loadSettings(req, res);

/*
  var alarmSettings = {};

  alarmSettings.armed = true;
  alarmSettings.type_id = 4;

  res.render('index', {
    title: "label.menubar_appTitle",
    labels: global.lang,
    alarmSettings : alarmSettings
   });
*/
});


router.get('/webIOPi', function(req, res, next) {

  res.render('webIOPi', {
    title: "label.menubar_appTitle",
    labels: global.lang,
   });

});


router.get('/getCredentials', function(req, res, next) {

  console.log("GET getCredentials");
  console.log(req.body);

  var request = require('request');
  var utilEMail = require('../system/utils/utilEMail');

  utilEMail.readClientSecret(function (secrets) {

    console.log(secrets);

    var authUrl = utilEMail.generateAuthUrl(secrets, 1);

//    console.log(authUrl);

    res.redirect(authUrl);
  });

});


router.get('/oauth2callback', function(req, res) {
  var code = req.query.code;

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

  //res.end();
});


router.post('/setLanguage', function(req, res, next) {

    console.log(req.body.lang);
    global.i18n.setLanguage(req.body.lang);

    res.end();
  });


router.get('/myuser/:username', function(req, res, next) {

    console.log(req.params.username);
    console.error(req.params.username == 'e');

     if (req.params.username == 'e') {

       var err = new Error("User already exists !!");
       err.status = 300;
       next(err);
     } else {

       res.send(req.params.username);
    }
  });


module.exports = router;
