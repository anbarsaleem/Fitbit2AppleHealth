var express = require('express');
var router = express.Router();
const path = require("path");

const filePath = path.join(__dirname, 'fitbitData.json');

/* GET fitbitData json */
router.get('/', function(req, res, next) {
  res.sendFile(filePath);
});

module.exports = router;