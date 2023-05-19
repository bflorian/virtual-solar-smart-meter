# Virtual Solar Smart Meter

This SmartApp is an example of how to use the SmartThings API to create a virtual device that
represents the current power usage of a home. It also shows how to create a virtual device that
represents the power production of a home's solar panels. These devices integrate with the
SmartThings Energy service in the SmartThings mobile app.

## File Structure

* definitions
    * apps
      * lambda.json &mdash; example Lambda SmartApp definition
      * webhook.json &mdash; example WebHook SmartApp definition
    * profiles
      * i18n
        * en.json &mdash; defines friendly names for the power meter device profile components
      * power-meter.json &mdash; power meter device profile definition
      * solar-panel.json &mdash; solar panel device profile definition
* locales
    * en.json &mdash; English version of the app configuration page text
* src
  * handlers
      * monthly-reset.js &mdash; scheduled event handler that resets the energy usage at the first of each month
      * page1.js &mdash; handler for SmartApp configuration page
      * uninstaled.js &mdash; handler called when the app is removed from a location
      * updated.js &mdash; handler called when the app is installed or updated
  * lib
    * device.js &mdash; creates energy meter and solar panel devices
    * house-model.js &mdash; simulates house energy usage
    * solar-panel-model.js &mdash; simulates solar panel energy production
  * index.js &mdash; AWS Lambda handler that calls the SmartApp
  * server.js &mdash; web server that calls the SmartApp
  * smartapp.js &mdash; the SmartApp implementation
* test &mdash; unit tests
* .env &mdash; environment variables used by the server
* .env.example &mdash; example .env file
* .gitignore &mdash; files to be ignored by git
* package.json &mdash; NodeJS package definition
* README.md &mdash; this file
* serverless.yml &mdash; Serverless configuration file for deploying to AWS Lambda

## Prerequisites
- A [Samsung Developer account](https://smartthings.developer.samsung.com/workspace/)

- The [SmartThings CLI](https://github.com/SmartThingsCommunity/smartthings-cli) installed

- [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/) installed

- [ngrok](https://ngrok.com/) or similar tool to create a secure tunnel to a publicly available URL

## Getting Started

### Clone this GitHub repository
```bash
git clone https://github.com/SmartThingsCommunity/virtual-solar-energy-meter.git
```

### Install node packages and start the server
```bash
cd virtual-solar-energy-meter
npm install
node server.js
```

### Start ngrok and point it to your server
```
ngrok http localhost:3000
```
Make note of the HTTPS forwarding URL, for example `https://c79461932dfc.ngrok.io`

### Create an automation in the developer workspace

Go to the SmartThings developer workspace and create an Automation SmartApp.
This app should have the scopes:
```
r:devices:*
x:devices:*
r:scenes:*
x:scenes:*
i:deviceprofiles:*
```
Choose the web-hook option when creating the app. The _targetURL_ should be set to the ngrok forwarding
URL with the path `/smartapp`, for example `https://c79461932dfc.ngrok.io/smartapp`

Take note of the `appId`, `clientId`, and `clientSecret` displayed after creating your app.

### Confirm that your app is ready to receive lifecycle events

Look in your server log for a line with a URL to use for verifying your app. Visit this URL to confirm
the location of your app (you can do this in a web browser).

### Create a .env file and restart the server

Create a file named `.env` in the project directory that sets your `appId`, `clientId`, and `clientSecret`.
For example:
```
APP_ID=912e0214-5706-4407-a299-b3796a57cf56
CLIENT_ID=61225bef-d2db-4ab0-82f6-d28c0f11911d
CLIENT_SECRET=94c2b3df-b0ab-4abd-84bf-1823d63b944c
```

and restart your NodeJS server. Do not restart ngrok or the URL will change (unless your are using a
paid account)

### Install your SmartApp and visit the web page

Install your SmartApp using the SmartThings mobile app. Then visit your local web server
to see and control devices and scenes.

http://localhost:3001
