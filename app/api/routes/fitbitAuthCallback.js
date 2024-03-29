var express = require("express");
var axios = require("axios");
const e = require("express");
const fs = require("fs");
const path = require("path");
var router = express.Router();

const server_url = process.env.SERVER_URL;

const client_secret = process.env.FITBIT_CLIENT_SECRET;
const client_id = process.env.FITBIT_CLIENT_ID;
var accessToken = "";
var refreshToken = "";
var tokenExpirationTime;
//Encode client id and secret
const encodedClientIDAndSecret = btoa(client_id + ":" + client_secret);

async function refreshAccessToken(refreshToken) {
  const postData = {
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  };

  const headers = {
    Authorization: "Basic " + encodedClientIDAndSecret,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  return new Promise((resolve, reject) => {
    axios
      .post("https://api.fitbit.com/oauth2/token", postData, { headers })
      .then((response) => {
        accessToken = response.data.access_token;
        refreshToken = response.data.refresh_token;
        tokenExpirationTime = calculateExpirationTimeOfAccessToken(
          response.data.expires_in
        );
        console.log(response.data);
        console.log("New Access Token: " + accessToken);
        console.log("New Refresh Token: " + refreshToken);
        resolve(accessToken); // Resolve the promise with the access token
      })
      .catch((error) => {
        console.log("Token Refresh Failed");
        reject(error); // Reject the promise with the error
      });
  });
}

function calculateExpirationTimeOfAccessToken(secondsFromNow) {
  const now = new Date();
  tokenExpirationTime = now.setSeconds(now.getSeconds() + secondsFromNow);
}

/* GET fitbitAuthCallback page. */
router.get("/", (req, res) => {
  const { code } = req.query;

  // Extract access token and user ID from the query parameters
  const callbackUrl = new URL(req.url, `http://${req.headers.host}`);
  const callbackUrlTxt = callbackUrl.href;
  const url = new URL(callbackUrlTxt);
  const authCode = url.searchParams.get("code");

  console.log("The authCode is " + authCode);

  // POST to Fitbit API with auth code
  function performPostRequest() {
    const postData = {
      code: authCode,
      grant_type: "authorization_code",
      redirect_uri: server_url + "/fitbitAuthCallback",
    };

    const headers = {
      Authorization: "Basic " + encodedClientIDAndSecret,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    return new Promise((resolve, reject) => {
      axios
        .post("https://api.fitbit.com/oauth2/token", postData, { headers })
        .then((response) => {
          accessToken = response.data.access_token;
          refreshToken = response.data.refresh_token;
          tokenExpirationTime = calculateExpirationTimeOfAccessToken(
            response.data.expires_in
          );
          //console.log(response.data);
          //console.log("Access Token: " + accessToken);
          //console.log("Refresh Token: " + refreshToken);
          resolve(accessToken); // Resolve the promise with the access token
        })
        .catch((error) => {
          console.error(error);
          reject(error); // Reject the promise with the error
        });
    });
  }

  // GET request to Fitbit API to retrieve recent activity data with access token
  function performGetRequest(accessToken) {
    var date = new Date();
    var currentDay = String(date.getDate()).padStart(2, "0");
    var currentMonth = String(date.getMonth() + 1).padStart(2, "0");
    var currentYear = date.getFullYear();
    const activityName = "Weights";

    const endpointUrl = `https://api.fitbit.com/1/user/-/activities/list.json?beforeDate=${currentYear}-${currentMonth}-${currentDay}&sort=desc&offset=0&limit=15`;
    axios
      .get(endpointUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        //console.log(response.data);
        if (
          response.data.activities &&
          Array.isArray(response.data.activities)
        ) {
          const filteredActivities = response.data.activities.filter(
            (activity) => activity.activityName === activityName
          );
          console.log(filteredActivities);

          //Write fitbit data from api to json file for frontend to access
          const filePath = path.join(__dirname, 'fitbitData.json');
          fs.writeFile(filePath, JSON.stringify(filteredActivities), (err) => {
            if (err) {
              console.error(err);
            } else {
              console.log('JSON data has been written to file successfully.');
            }
          });
        } else {
          console.log("Activities not found in the response.");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function isAccessTokenExpired() {
    return tokenExpirationTime <= Date.now();
  }

  if (accessToken == "" || isAccessTokenExpired()) {
    performPostRequest()
      .then((accessToken) => {
        return performGetRequest(accessToken);
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    refreshAccessToken(refreshToken);
    performPostRequest()
      .then((accessToken) => {
        return performGetRequest(accessToken);
      })
      .catch((error) => {
        console.error(error);
      });
  }
  // Redirect the user or send a response as needed
  //res.send("authorization complete");
  res.redirect("f2ahclient://callback");
});

module.exports = router;
