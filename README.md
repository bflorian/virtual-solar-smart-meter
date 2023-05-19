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
