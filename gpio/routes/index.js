var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', {
    title: "label.menubar_appTitle",
    labels: global.lang,
   });
});

module.exports = router;
