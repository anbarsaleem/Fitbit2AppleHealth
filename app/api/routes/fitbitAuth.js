var express = require('express');
var router = express.Router();
require(dotenv).config();

const serverUrl = process.env.SERVER_URL;
const formattedUrl = encodeURIComponent(serverUrl);

/* GET fitbitAuth page. */
router.get('/', function(req, res, next) {
  res.send("hhttps://www.fitbit.com/oauth2/authorize?response_type=code&client_id=23QYBD&scope=activity+cardio_fitness+electrocardiogram+heartrate+location+nutrition+oxygen_saturation+profile+respiratory_rate+settings+sleep+social+temperature+weight&redirect_uri=" + formattedUrl + "fitbitAuthCallback");
});

module.exports = router;