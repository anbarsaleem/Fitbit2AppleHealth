var express = require('express');
var router = express.Router();

/* GET fitbitAuth page. */
router.get('/', function(req, res, next) {
  res.render("fitbitAuth")
});

module.exports = router;