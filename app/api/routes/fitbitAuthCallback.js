var express = require("express");
var axios = require("axios");
var router = express.Router();

const client_secret = process.env.FITBIT_CLIENT_SECRET;
const client_id = process.env.FITBIT_CLIENT_ID;

/* GET fitbitAuthCallback page. */
router.get("/", (req, res) => {
  const { code } = req.query;

  // Extract access token and user ID from the query parameters
  const callbackUrl = new URL(req.url, `http://${req.headers.host}`);
  const callbackUrlTxt = callbackUrl.href;
  const url = new URL(callbackUrlTxt);
  const authCode = url.searchParams.get("code");

  console.log("The authCode is " + authCode);

  //Encode client id and secret
  const encodedClientIDAndSecret = btoa(client_id + ":" + client_secret);

  // POST to Fitbit API with auth code
  function performPostRequest() {
    const postData = {
      code: authCode,
      grant_type: "authorization_code",
      redirect_uri: "http://localhost:9000/fitbitAuthCallback",
    };

    const headers = {
      Authorization: "Basic " + encodedClientIDAndSecret,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    return new Promise((resolve, reject) => {
      axios
        .post("https://api.fitbit.com/oauth2/token", postData, { headers })
        .then((response) => {
          const accessToken = response.data.access_token;
          const refreshToken = response.data.refresh_token;
          console.log("Access Token: " + accessToken);
          console.log("Refresh Token: " + refreshToken);
          resolve(accessToken); // Resolve the promise with the access token
        })
        .catch((error) => {
          console.error(error);
          reject(error); // Reject the promise with the error
        });
    });
  }

  // GET request to Fitbit API to retrieve profile data with access token
  function performGetRequest(accessToken) {
    const endpointUrl = "https://api.fitbit.com/1/user/-/profile.json";
    axios
      .get(endpointUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  performPostRequest()
    .then((accessToken) => {
      return performGetRequest(accessToken);
    })
    .catch((error) => {
      console.error(error);
    });

  // Redirect the user or send a response as needed
  res.send("authorization complete");
});

module.exports = router;
