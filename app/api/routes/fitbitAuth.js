var express = require('express');
var router = express.Router();

/* GET fitbitAuth page. */
router.get('/', function(req, res, next) {
  res.send("hhttps://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23QYBD&scope=activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&redirect_uri=https%3A%2F%2Fmurmuring-temple-36333-5270dc63cfd6.herokuapp.com%2FfitbitAuthCallback")
});

module.exports = router;