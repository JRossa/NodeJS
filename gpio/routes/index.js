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
