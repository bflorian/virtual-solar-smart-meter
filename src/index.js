/**
 * Entry point for the SmartApp Lambda function. Not used when deployed as a web-hook app.
 */

const smartApp = require('./smartapp')

module.exports.handle = async (event, context, callback) => {
	await smartApp.handleLambdaCallback(event, context, callback)
}

