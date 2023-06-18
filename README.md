# Fitbit → Apple Health

@anbarsaleem

# Description

This is a full stack IOS application that integrates your Fitbit workout data to your Apple Health account. Users login to fitbit, authorize access to Apple Health data, & the app displays relevant weight workout info on a dashboard. Sync Fitbit workouts to Apple Health with one click (after allowing permissions)!


<aside>

**Backend**: ExpressJS              

**Frontend**: Ionic / VueJS

</aside>  
</br>

# Functionality/Instructions (Demo Screenshot Shown Below)

<aside>
❗ Must all be done after configuring environment with the steps below 👍🏽

</aside>

1. Click to `Login to Fitbit` and grant permission to the app to retrieve your workout data
    1. If it has been a while and you need to refresh or grab new data that you want to see on the cards that display your Weight workouts tracked on your fitbit device, click the `Refresh/Update Fitbit Data` Button
2. Your iPhone may ask you to allow the app access to read/write some features to/from your Apple Health data at this time
3. Whenever you see a workout that you’d like to sync, just click the button at the bottom of the card! :)
4. Your most recent daily step count is also available at the bottom of the app for easy access
</br>

# Steps to Build (w/ XCode)

### Prerequisites: Fitbit Developer Account, XCode, Apple Developer Account

1. Clone the Repo onto your machine
2. `cd` into the api folder
    1. Install dependencies with `npm install`
    2. Create .env file and include your own fitbit API client secret and client id
        1. Must create fitbit developer account and register your own application to receive keys (should only take 5 minutes)
            1. [https://dev.fitbit.com/build/reference/web-api/developer-guide/authorization/](https://dev.fitbit.com/build/reference/web-api/developer-guide/authorization/)
            2. For ease of using my routes, make your callback url http://localhost:9000/fitbitAuthCallback
        2. Once everything is configured, run `npm start` to start the server!
3. `cd` into the client folder
    1. Install dependencies with `npm install`
    2. Build the ionic app with `ionic capacitor build ios`
        1. This should open XCode where you should then make sure you have configured all of the items necessary like your team and provisioning profile under the “Signing and Capabilities” tab.
            1. The Bundle Identifier that is configured in my code is “com.ionic.fitbitapplehealth”
    3. Configure XCode simulator or your own device for deployment of the app and build with the ▶️ button
4. ***Build and run!***

![Demo Screenshot](/demo_screenshot.png)
