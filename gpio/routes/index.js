var express = require('express');
var router = express.Router();


function loadSettings (req, res) {

  var actionDao = require('../system/dao/sqliteActionDao');
  if (global.config.site.database === 'mysql') {
    actionDao = require('../system/dao/mysqlActionDao');
  }

  actionDao.actionDao.getLastAction (

    function (actionsData) {
      console.log(JSON.stringify(actionsData, null, 2));

      if (actionsData.length == 1) {
        var alarmSettings = actionsData[0];

        if (alarmSettings.all_day == false) {

          actionDao.actionDao.getAlarmPeriod (alarmSettings.period_id,

            function (periodData) {
//                console.log(JSON.stringify(periodData, null, 2));
              alarmSettings.startPeriod = periodData[0].start;
              alarmSettings.endPeriod = periodData[0].end;

              res.render('index', {
                title : "label.menubar_appTitle",
                labels : global.lang,
                alarmSettings : alarmSettings
               });
          });
        } else {
          alarmSettings.startPeriod = "";
          alarmSettings.endPeriod = "";

          res.render('index', {
            title : "label.menubar_appTitle",
            labels : global.lang,
            alarmSettings : alarmSettings
           });
        }
      } else {

        res.render('index', {
          title : "label.menubar_appTitle",
          labels : global.lang,
          alarmSettings : actionsData
         });
      }
  });


}



/* GET home page. */
router.get('/', function(req, res, next) {

  loadSettings(req, res);
/*
  res.render('index', {
    title: "label.menubar_appTitle",
    labels: global.lang,
   });
*/
});

router.post('/setLanguage', function(req, res, next) {

    console.log(req.body.lang);
    global.i18n.setLanguage(req.body.lang);

    res.end();
  });


module.exports = router;
