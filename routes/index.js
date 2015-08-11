var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/done", function(req, res) {
  res.send("DONE!");
});

module.exports = router;
